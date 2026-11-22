export type ProfileUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  isBlocked?: boolean | null;
  subscriptionPlan?: string | null;
  businessName?: string | null;
  createdAt?: string | Date | null;
};
