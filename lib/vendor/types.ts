export type VendorOverview = {
  totalMenuItems: number;
  activeMenuItems: number;
  pendingOrders: number;
  acceptedOrders: number;
  currentSubscriptionPlan: "free" | "premium";
};

export type VendorOverviewResponse = {
  success: boolean;
  message: string;
  data: VendorOverview;
};
