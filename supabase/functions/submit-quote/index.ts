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
      // Email 1: Lead notification to Owner (High-contrast, mobile-first, direct action buttons)
      const ownerSubject = `[New Lead] ${service} - ${name} (${phone})`;
      const formattedDate = new Date().toLocaleString("en-US", {
        timeZone: "America/Edmonton",
        dateStyle: "medium",
        timeStyle: "short",
      });

      const ownerHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Quote Request - Keystone Renovations</title>
        </head>
        <body style="margin: 0; padding: 24px 12px; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center">
                <!-- Card Container -->
                <table role="presentation" width="100%" style="max-width: 580px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06); overflow: hidden; text-align: left;" border="0" cellspacing="0" cellpadding="0">
                  
                  <!-- Top Header Banner -->
                  <tr>
                    <td style="background-color: #071E17; padding: 26px 30px; border-bottom: 3px solid #10B981;">
                      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td>
                            <div style="font-size: 13px; font-weight: 700; letter-spacing: 0.12em; color: #A7F3D0; text-transform: uppercase; margin-bottom: 6px;">
                              KEY<span style="color: #F59E0B;">STONE</span> RENOVATIONS
                            </div>
                            <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 800; margin: 0; line-height: 1.2;">
                              New Quote Request
                            </h1>
                          </td>
                          <td align="right" valign="top">
                            <span style="background-color: rgba(16, 185, 129, 0.2); color: #34D399; border: 1px solid rgba(52, 211, 153, 0.4); font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.05em; display: inline-block;">
                              ⚡ New Lead
                            </span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Main Content Area -->
                  <tr>
                    <td style="padding: 28px 30px 20px;">
                      
                      <!-- Quick Action Buttons -->
                      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                        <tr>
                          <td>
                            <a href="tel:${escapeHtml(phone)}" style="display: inline-block; background-color: #071E17; color: #FFFFFF; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 20px; border-radius: 8px; margin-right: 8px; margin-bottom: 8px;">
                              📞 Call Lead Now
                            </a>
                            <a href="mailto:${escapeHtml(email)}" style="display: inline-block; background-color: #F8FAFC; color: #0F172A; font-weight: 700; font-size: 14px; text-decoration: none; padding: 11px 18px; border-radius: 8px; border: 1px solid #CBD5E1; margin-bottom: 8px;">
                              ✉️ Email Lead
                            </a>
                          </td>
                        </tr>
                      </table>

                      <!-- Details Table -->
                      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: separate; border-spacing: 0; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 14px 18px; border-bottom: 1px solid #E2E8F0; width: 35%; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B;">
                            Customer Name
                          </td>
                          <td style="padding: 14px 18px; border-bottom: 1px solid #E2E8F0; font-size: 16px; font-weight: 700; color: #0F172A;">
                            ${escapeHtml(name)}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 14px 18px; border-bottom: 1px solid #E2E8F0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B;">
                            Requested Service
                          </td>
                          <td style="padding: 14px 18px; border-bottom: 1px solid #E2E8F0;">
                            <span style="background-color: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; font-size: 13px; font-weight: 700; padding: 4px 10px; border-radius: 6px; display: inline-block;">
                              ${escapeHtml(service)}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 14px 18px; border-bottom: 1px solid #E2E8F0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B;">
                            Phone Number
                          </td>
                          <td style="padding: 14px 18px; border-bottom: 1px solid #E2E8F0; font-size: 15px; font-weight: 600;">
                            <a href="tel:${escapeHtml(phone)}" style="color: #059669; text-decoration: none;">
                              ${escapeHtml(phone)}
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 14px 18px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B;">
                            Email Address
                          </td>
                          <td style="padding: 14px 18px; font-size: 15px; font-weight: 600;">
                            <a href="mailto:${escapeHtml(email)}" style="color: #059669; text-decoration: none;">
                              ${escapeHtml(email)}
                            </a>
                          </td>
                        </tr>
                      </table>

                      <!-- Project Details & Notes Box -->
                      <div style="margin-bottom: 10px;">
                        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #475569; margin-bottom: 8px;">
                          Project Details &amp; Notes
                        </div>
                        <div style="background-color: #F8FAFC; border: 1px solid #CBD5E1; border-left: 4px solid #059669; border-radius: 8px; padding: 16px 18px; font-size: 15px; line-height: 1.6; color: #0F172A; white-space: pre-wrap; word-break: break-word;">
                          ${escapeHtml(project_details || "No additional project notes provided by the client.")}
                        </div>
                      </div>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 18px 30px; font-size: 12px; color: #64748B; text-align: center; line-height: 1.5;">
                      <div>Lead ID: <code style="font-family: monospace; color: #0F172A; background-color: #E2E8F0; padding: 2px 6px; border-radius: 4px;">${inserted.id}</code></div>
                      <div style="margin-top: 4px;">Received: <strong>${formattedDate}</strong> (Alberta Time)</div>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      // Email 2: Confirmation to Visitor (Clean, reassuring, high-trust)
      const visitorSubject = `Quote Request Received - Keystone Renovations`;
      const visitorHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>We Received Your Quote Request - Keystone Renovations</title>
        </head>
        <body style="margin: 0; padding: 24px 12px; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center">
                <!-- Card Container -->
                <table role="presentation" width="100%" style="max-width: 580px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06); overflow: hidden; text-align: left;" border="0" cellspacing="0" cellpadding="0">
                  
                  <!-- Top Header Banner -->
                  <tr>
                    <td style="background-color: #071E17; padding: 28px 32px; border-bottom: 3px solid #F59E0B;">
                      <div style="font-size: 13px; font-weight: 700; letter-spacing: 0.12em; color: #A7F3D0; text-transform: uppercase; margin-bottom: 4px;">
                        KEY<span style="color: #F59E0B;">STONE</span> RENOVATIONS
                      </div>
                      <div style="color: #94A3B8; font-size: 13px; margin: 0;">
                        Calgary &amp; Alberta Construction &amp; Renovation
                      </div>
                    </td>
                  </tr>

                  <!-- Main Content Area -->
                  <tr>
                    <td style="padding: 32px 32px 24px;">
                      
                      <h2 style="color: #0F172A; font-size: 22px; font-weight: 800; margin: 0 0 16px 0;">
                        Hi ${escapeHtml(name)},
                      </h2>

                      <p style="font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px 0;">
                        Thank you for reaching out to <strong>Keystone Renovations</strong>. We have received your request for <strong>${escapeHtml(service)}</strong>.
                      </p>

                      <!-- Principle Quote Banner -->
                      <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-left: 4px solid #10B981; border-radius: 8px; padding: 14px 18px; margin: 20px 0; font-size: 14px; color: #166534; font-style: italic; line-height: 1.5;">
                        "The crew that shows up should be the crew that finishes the job."
                        <span style="font-style: normal; display: block; font-weight: 600; font-size: 12px; color: #15803D; margin-top: 4px;">— Keystone Founding Principle</span>
                      </div>

                      <!-- What Happens Next -->
                      <div style="margin: 24px 0;">
                        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #64748B; margin-bottom: 12px;">
                          What to expect next
                        </div>
                        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding: 8px 0; font-size: 14px; line-height: 1.5; color: #334155;">
                              <strong style="color: #0F172A;">1. Project Review:</strong> An estimator will review your project details and scope within 1 business day.
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-size: 14px; line-height: 1.5; color: #334155;">
                              <strong style="color: #0F172A;">2. Honest Estimate:</strong> We provide straightforward, transparent pricing with no high-pressure sales tactics.
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; font-size: 14px; line-height: 1.5; color: #334155;">
                              <strong style="color: #0F172A;">3. Same Trusted Crew:</strong> No subcontracting the critical work to strangers — our team sees it through.
                            </td>
                          </tr>
                        </table>
                      </div>

                      <!-- Submitted Details Summary -->
                      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px 18px; margin-top: 24px;">
                        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; margin-bottom: 6px;">
                          Summary of your request
                        </div>
                        <div style="font-size: 15px; font-weight: 700; color: #0F172A; margin-bottom: 6px;">
                          ${escapeHtml(service)}
                        </div>
                        ${project_details ? `<div style="font-size: 14px; line-height: 1.5; color: #475569; border-top: 1px solid #E2E8F0; padding-top: 8px; margin-top: 8px;">${escapeHtml(project_details)}</div>` : ""}
                      </div>

                      <!-- Urgent Assistance CTA -->
                      <div style="background-color: #071E17; border-radius: 8px; padding: 20px 22px; margin-top: 24px; color: #FFFFFF;">
                        <div style="color: #A7F3D0; font-size: 15px; font-weight: 700; margin-bottom: 6px;">
                          Need immediate assistance?
                        </div>
                        <p style="color: #CBD5E1; font-size: 14px; line-height: 1.5; margin: 0;">
                          Call us directly at <a href="tel:4035054015" style="color: #F59E0B; font-weight: 700; text-decoration: none;">403 505 4015</a> or email us at <a href="mailto:gaurav.tyagi@keystonerenov.com" style="color: #34D399; font-weight: 600; text-decoration: none;">gaurav.tyagi@keystonerenov.com</a>.
                        </p>
                      </div>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 32px; font-size: 12px; color: #64748B; text-align: center; line-height: 1.5;">
                      <div><strong>Keystone Renovations</strong> &bull; Calgary &amp; Edmonton &amp; Alberta-Wide</div>
                      <div style="margin-top: 4px; color: #94A3B8;">Licensed &bull; Insured &bull; Over 20 Years of Craftsmanship</div>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
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
