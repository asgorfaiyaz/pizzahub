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
