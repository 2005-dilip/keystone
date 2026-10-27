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

/**
 * Checks if a user has an active record in public.admin_users
 */
export async function checkIsAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to verify admin status:', err);
    return false;
  }
}

/**
 * Fetches aggregate counts of leads grouped by status
 */
export async function fetchLeadStats(): Promise<{
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
}> {
  const { data, error } = await supabase
    .from('quote_requests')
    .select('status');

  if (error) {
    throw new Error(`Failed to load lead statistics: ${error.message}`);
  }

  const stats = {
    total: data.length,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    lost: 0,
  };

  data.forEach((row: { status: string }) => {
    const s = row.status?.toLowerCase();
    if (s === 'new') stats.new++;
    else if (s === 'contacted') stats.contacted++;
    else if (s === 'qualified') stats.qualified++;
    else if (s === 'converted') stats.converted++;
    else if (s === 'lost') stats.lost++;
  });

  return stats;
}

/**
 * Fetches paginated, filtered, and sorted leads from public.quote_requests
 */
export async function fetchLeads(options: {
  search?: string;
  status?: string;
  service?: string;
  sortOrder?: 'newest' | 'oldest';
  page?: number;
  pageSize?: number;
}) {
  const page = options.page || 1;
  const pageSize = options.pageSize || 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('quote_requests')
    .select('*', { count: 'exact' });

  // Status Filter
  if (options.status && options.status !== 'all') {
    query = query.eq('status', options.status);
  }

  // Service Filter
  if (options.service && options.service !== 'all') {
    query = query.eq('service', options.service);
  }

  // Search Filter (name, email, phone)
  if (options.search && options.search.trim()) {
    const term = `%${options.search.trim()}%`;
    query = query.or(`name.ilike.${term},email.ilike.${term},phone.ilike.${term}`);
  }

  // Sorting
  const ascending = options.sortOrder === 'oldest';
  query = query.order('created_at', { ascending });

  // Pagination
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch leads: ${error.message}`);
  }

  return {
    data: (data || []) as import('../types').QuoteRequest[],
    count: count || 0,
  };
}

/**
 * Updates a lead's status in public.quote_requests
 */
export async function updateLeadStatus(id: string, status: import('../types').LeadStatus) {
  const { data, error } = await supabase
    .from('quote_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update lead status: ${error.message}`);
  }

  return data as import('../types').QuoteRequest;
}

/**
 * Deletes a lead record from public.quote_requests
 */
export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase
    .from('quote_requests')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete lead: ${error.message}`);
  }
}

