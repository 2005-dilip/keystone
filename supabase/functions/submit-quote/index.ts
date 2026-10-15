import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface QuotePayload {
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  project_details?: string;
}

// Helper to escape HTML characters to prevent XSS in email templates
function escapeHtml(str: string): string {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Helper to send email via Resend REST API
async function sendResendEmail(
  apiKey: string,
  from: string,
  to: string[],
  subject: string,
  html: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
      }),
    });

    const body = await res.json();
    if (!res.ok) {
      return { success: false, error: body.message || JSON.stringify(body) };
    }
    return { success: true, data: body };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to send email via Resend" };
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Only POST is supported." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    let payload: QuotePayload;
    try {
      payload = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const name = (payload.name || "").trim();
    const phone = (payload.phone || "").trim();
    const email = (payload.email || "").trim().toLowerCase();
    const service = (payload.service || "").trim();
    const project_details = (payload.project_details || "").trim();

    // 1. Validation
    const errors: string[] = [];
    if (!name || name.length < 2) {
      errors.push("Name is required (at least 2 characters).");
    }
    if (!phone || phone.length < 7) {
      errors.push("Valid phone number is required.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push("Valid email address is required.");
    }
    if (!service) {
      errors.push("Service selection is required.");
    }

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ error: "Validation failed", details: errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Initialize Supabase Client with service role key (or anon key fallback)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 3. Prevent duplicate inserts within a 10-minute window
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: existing, error: checkError } = await supabase
      .from("quote_requests")
      .select("*")
      .eq("email", email)
      .eq("phone", phone)
      .eq("service", service)
      .gte("created_at", tenMinutesAgo)
      .order("created_at", { ascending: false })
      .limit(1);

    if (checkError) {
      console.warn("Duplicate check query notice:", checkError);
    }

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Quote request already received. We'll be in touch shortly!",
          data: existing[0],
          is_duplicate: true,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Insert into database
    const { data: inserted, error: insertError } = await supabase
      .from("quote_requests")
      .insert([
        {
          name,
          phone,
          email,
          service,
          project_details,
          status: "new",
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to store quote request in database", details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Send Resend Emails
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const ownerEmail = Deno.env.get("OWNER_EMAIL") || "gaurav.tyagi@keystonerenov.com";
    const fromEmail = Deno.env.get("FROM_EMAIL") || "Keystone Renovations <onboarding@resend.dev>";

    let ownerEmailResult: { success: boolean; data?: any; error?: string } = {
      success: false,
      error: "RESEND_API_KEY secret not set",
    };
    let visitorEmailResult: { success: boolean; data?: any; error?: string } = {
      success: false,
      error: "RESEND_API_KEY secret not set",
    };

    if (resendApiKey) {
      // Email 1: Lead notification to Owner
      const ownerSubject = `[New Lead] ${service} - ${name} (${phone})`;
      const ownerHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #041712; color: #F4EFE6; margin: 0; padding: 20px; }
            .card { background-color: #071E17; border: 1px solid #1C5645; border-radius: 8px; max-width: 600px; margin: 0 auto; padding: 32px; }
            .header { border-bottom: 2px solid #7FE8C8; padding-bottom: 16px; margin-bottom: 24px; }
            .title { color: #7FE8C8; font-size: 24px; margin: 0 0 8px 0; font-weight: 700; }
            .sub { color: #A8B8B0; font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 0.05em; }
            .field-row { margin-bottom: 16px; }
            .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #C59B27; margin-bottom: 4px; font-weight: 600; }
            .value { font-size: 16px; color: #F4EFE6; }
            .value a { color: #7FE8C8; text-decoration: none; }
            .box { background-color: #0C1814; border: 1px solid #1C5645; border-radius: 6px; padding: 16px; margin-top: 16px; font-size: 15px; line-height: 1.5; white-space: pre-wrap; }
            .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #1C5645; font-size: 12px; color: #5C7268; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1 class="title">New Quote Request</h1>
              <p class="sub">Keystone Renovations Lead Notification</p>
            </div>
            <div class="field-row">
              <div class="label">Customer Name</div>
              <div class="value"><strong>${escapeHtml(name)}</strong></div>
            </div>
            <div class="field-row">
              <div class="label">Phone</div>
              <div class="value"><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></div>
            </div>
            <div class="field-row">
              <div class="label">Email</div>
              <div class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
            </div>
            <div class="field-row">
              <div class="label">Requested Service</div>
              <div class="value" style="color:#7FE8C8; font-weight:600;">${escapeHtml(service)}</div>
            </div>
            <div class="field-row">
              <div class="label">Project Details &amp; Notes</div>
              <div class="box">${escapeHtml(project_details || "No additional project notes provided.")}</div>
            </div>
            <div class="footer">
              Lead ID: ${inserted.id} &bull; Received: ${new Date().toLocaleString()} (Alberta Time)
            </div>
          </div>
        </body>
        </html>
      `;

      // Email 2: Confirmation to Visitor
      const visitorSubject = `We received your quote request - Keystone Renovations`;
      const visitorHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F4EFE6; color: #0C1814; margin: 0; padding: 20px; }
            .card { background-color: #FFFFFF; border: 1px solid #DCD6C2; border-radius: 8px; max-width: 600px; margin: 0 auto; padding: 36px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
            .header { border-bottom: 2px solid #071E17; padding-bottom: 20px; margin-bottom: 24px; }
            .logo { font-size: 22px; font-weight: 800; color: #071E17; letter-spacing: 0.05em; }
            .logo span { color: #C59B27; }
            .sub { color: #5C7268; font-size: 13px; margin: 4px 0 0 0; text-transform: uppercase; }
            .greeting { font-size: 18px; font-weight: 600; color: #071E17; margin-bottom: 16px; }
            p { font-size: 15px; line-height: 1.6; color: #33443C; margin: 0 0 16px 0; }
            .highlight-box { background-color: #F8F6F0; border-left: 4px solid #071E17; padding: 16px 20px; margin: 20px 0; border-radius: 0 6px 6px 0; }
            .highlight-box .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #5C7268; font-weight: 600; margin-bottom: 4px; }
            .highlight-box .value { font-size: 16px; font-weight: 600; color: #071E17; }
            .contact-cta { background-color: #071E17; color: #F4EFE6; padding: 20px; border-radius: 6px; margin: 28px 0; }
            .contact-cta h3 { color: #7FE8C8; margin: 0 0 8px 0; font-size: 16px; }
            .contact-cta p { color: #DCD6C2; font-size: 14px; margin: 0; }
            .contact-cta a { color: #7FE8C8; font-weight: 600; text-decoration: none; }
            .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #EAE5D8; font-size: 12px; color: #8C9992; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="logo">KEY<span>STONE</span> RENOVATIONS</div>
              <div class="sub">Calgary &amp; Alberta Construction &amp; Renovation</div>
            </div>
            <div class="greeting">Hi ${escapeHtml(name)},</div>
            <p>Thank you for reaching out to Keystone Renovations. We have received your request for <strong>${escapeHtml(service)}</strong>.</p>
            <p>Our founding principle is simple: <em>"The crew that shows up should be the crew that finishes the job."</em> One of our estimators will review your project details and get back to you with a straight, no-pressure quote.</p>
            
            <div class="highlight-box">
              <div class="label">Summary of your request</div>
              <div class="value">${escapeHtml(service)}</div>
              ${project_details ? `<div style="margin-top:8px; font-size:14px; color:#5C7268;">${escapeHtml(project_details)}</div>` : ""}
            </div>

            <div class="contact-cta">
              <h3>Need immediate assistance?</h3>
              <p>Give us a call directly at <a href="tel:4035054015">403 505 4015</a> or email us at <a href="mailto:gaurav.tyagi@keystonerenov.com">gaurav.tyagi@keystonerenov.com</a>.</p>
            </div>

            <div class="footer">
              Keystone Renovations &bull; Calgary, AB &bull; Licensed &amp; Insured across Alberta
            </div>
          </div>
        </body>
        </html>
      `;

      // Execute both emails concurrently
      const [ownerRes, visitorRes] = await Promise.all([
        sendResendEmail(resendApiKey, fromEmail, [ownerEmail], ownerSubject, ownerHtml),
        sendResendEmail(resendApiKey, fromEmail, [email], visitorSubject, visitorHtml),
      ]);

      ownerEmailResult = ownerRes;
      visitorEmailResult = visitorRes;

      if (!ownerRes.success) console.error("Owner email error:", ownerRes.error);
      if (!visitorRes.success) console.error("Visitor email error:", visitorRes.error);
    } else {
      console.warn("RESEND_API_KEY secret not set. Skipping email dispatch.");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Quote request submitted successfully!",
        data: inserted,
        notifications: {
          owner_email_sent: ownerEmailResult.success,
          owner_email_error: ownerEmailResult.error || null,
          visitor_email_sent: visitorEmailResult.success,
          visitor_email_error: visitorEmailResult.error || null,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Unhandled error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
