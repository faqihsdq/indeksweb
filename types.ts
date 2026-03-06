export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  specs: string;
  capacity: string;
  min_order: string;
  image_url: string;
  category: string;
  label?: string;
  coa_url?: string;
  msds_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: number;
  name: string;
  company: string;
  whatsapp: string;
  email: string;
  product_id?: number;
  product_name?: string;
  quantity: string;
  location: string;
  notes: string;
  status: 'new' | 'contacted' | 'deal';
  created_at: string;
}

export interface SampleRequest {
  id: number;
  pic_name: string;
  company: string;
  position: string;
  email: string;
  whatsapp: string;
  product: string;
  monthly_volume: string;
  address: string;
  notes: string;
  status: 'new' | 'contacted' | 'sent' | 'delivered';
  shipping_date?: string;
  tracking_number?: string;
  created_at: string;
}

export interface AdminStats {
  totalInquiries: number;
  totalVisitors: number;
  whatsappClicks: number;
  totalQuotations: number;
  wonQuotations: number;
  lostQuotations: number;
  totalRevenue: number;
  recentInquiries: Inquiry[];
  popularProducts: { name: string; views: number }[];
}

export interface Quotation {
  id: number;
  quotation_number: string;
  inquiry_id?: number;
  buyer_name: string;
  company: string;
  buyer_address?: string;
  whatsapp: string;
  email: string;
  product_name: string;
  quantity: string;
  unit_price: number;
  total_price: number;
  tax_type: 'PPN' | 'Non-PPN';
  tax_amount: number;
  grand_total: number;
  po_number?: string;
  npwp?: string;
  lead_time: string;
  payment_terms: string;
  delivery_terms: string;
  notes: string;
  status: 'Draft' | 'Sent' | 'Viewed' | 'Negotiation' | 'Won' | 'Lost';
  created_at: string;
}

export interface Customer {
  id: number;
  company_name: string;
  pic_name: string;
  address: string;
  npwp: string;
  whatsapp: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  company: string;
  quote: string;
  photo_url?: string;
  logo_url?: string;
  rating: number;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  author: string;
  created_at: string;
  updated_at: string;
}
