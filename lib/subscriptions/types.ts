export type SubscriptionPlan = "free" | "premium";

export type VendorSubscriptionStatus = {
  isPremium: boolean;
  plan: SubscriptionPlan;
  activeItemCount: number;
  maxFreeItems: number;
  canPublishMore: boolean;
};

export type SubscriptionStatusResponse = {
  success: boolean;
  message: string;
  data: VendorSubscriptionStatus;
};

export type CheckoutSession = {
  url: string;
};

export type CheckoutSessionResponse = {
  success: boolean;
  message: string;
  data: CheckoutSession;
};

export type PaymentConfirmation = {
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  plan: string;
  createdAt: string;
};

export type PaymentConfirmationResponse = {
  success: boolean;
  message: string;
  data: PaymentConfirmation;
};
