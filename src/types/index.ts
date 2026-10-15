export interface QuoteFormData {
  name: string;
  phone: string;
  email: string;
  service: string;
  project_details: string;
}

export interface ServiceItem {
  num: string;
  code: string;
  title: string;
  description: string;
  path: string;
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
