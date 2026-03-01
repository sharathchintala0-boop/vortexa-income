export interface Order {
  id: string;
  customerId: string;
  serverType: string;
  quantity: number;
  paymentGateway: string;
  price: number;
  plan: string;
  months: string;
  date: string;
  notes?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
}
