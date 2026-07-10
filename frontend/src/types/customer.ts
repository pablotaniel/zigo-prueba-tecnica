export interface Customer {
  id: string;
  email: string;
  name: string;
  created_at?: string;
}

export interface CustomerInput {
  email: string;
  name: string;
}