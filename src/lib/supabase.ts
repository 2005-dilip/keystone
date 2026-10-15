import { createClient } from '@supabase/supabase-js';
import type { QuoteFormData, SubmissionResponse } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://epnmccwejtfdijjqtvpe.supabase.co';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_ERnJogpO6gIVAtAldHd0qg_1eIUGaMv';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

/**
 * Submits a quote request through the Supabase Edge Function with Resend notifications,
 * falling back to direct table insertion if the function is temporarily unreachable.
 */
export async function submitQuoteForm(formData: QuoteFormData): Promise<SubmissionResponse> {
  const edgeFunctionUrl = `${supabaseUrl}/functions/v1/submit-quote`;

  try {
    // 1. Primary Strategy: Call Supabase Edge Function (saves lead + dispatches Resend emails)
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabasePublishableKey,
        'Authorization': `Bearer ${supabasePublishableKey}`,
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || result.details?.join(', ') || 'Submission failed');
    }

    return result as SubmissionResponse;
  } catch (edgeError: any) {
    console.warn('Edge Function submission attempt error, trying fallback:', edgeError.message);

    // 2. Fallback Strategy: Direct Supabase Client Insert to preserve lead
    try {
      const { data, error: insertError } = await supabase
        .from('quote_requests')
        .insert([
          {
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim().toLowerCase(),
            service: formData.service.trim(),
            project_details: formData.project_details.trim(),
            status: 'new',
          },
        ])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      return {
        success: true,
        message: "Thanks! We've received your project details and will be in touch shortly.",
        data,
      };
    } catch (fallbackError: any) {
      console.error('Direct fallback insert error:', fallbackError);
      return {
        success: false,
        error: edgeError.message || fallbackError.message || 'Unable to submit quote. Please call us directly at 403 505 4015.',
      };
    }
  }
}
