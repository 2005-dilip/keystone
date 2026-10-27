export interface QuoteFormData {
  name: string;
  phone: string;
  email: string;
  service: string;
  project_details: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceSection {
  question: string;
  paragraphs: string[];
}

export interface ServiceItem {
  num: string;
  code: string;
  title: string;
  description: string;
  path: string;
}

export interface DetailedService {
  slug: string;
  num: string;
  code: string;
  title: string;
  quoteService: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  summary: string;
  iconPath: string;
  sections: ServiceSection[];
  faqs: ServiceFAQ[];
  cta: {
    name: string;
    phone: string;
    phoneTel: string;
    email: string;
    note: string;
  };
}

export interface SubmissionResponse {
  success: boolean;
  message?: string;
  is_duplicate?: boolean;
  data?: any;
  error?: string;
  details?: string[];
  notifications?: {
    owner_email_sent: boolean;
    owner_email_error: string | null;
    visitor_email_sent: boolean;
    visitor_email_error: string | null;
  };
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export interface QuoteRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  project_details?: string | null;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
}

export interface LeadFilterOptions {
  search?: string;
  status?: LeadStatus | 'all';
  service?: string | 'all';
  sortOrder?: 'newest' | 'oldest';
  page?: number;
  pageSize?: number;
}

export interface AdminUser {
  user_id: string;
  email: string;
  role: string;
  created_at: string;
}
