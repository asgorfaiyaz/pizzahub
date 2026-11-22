export type TransactionVendor = {
  _id: string;
  name: string;
  email: string;
  businessName?: string;
  phone?: string;
};

export type Transaction = {
  _id: string;
  transactionId: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  paymentMethod: string[];
  createdAt: string;
  transactionDate: string;
  subscriptionPlan: boolean;
  vendor: TransactionVendor | null;
};

export type TransactionsPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type TransactionsResponse = {
  success: boolean;
  message: string;
  data: Transaction[];
  pagination?: TransactionsPagination;
};
