import type { ApiResponse, MenuItem, VendorInfo } from "@/lib/menu-items/types";

export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";

/** The item payload nested in an order (subset of `MenuItem`). */
export type OrderMenuItemSummary = Pick<
  MenuItem,
  "_id" | "itemName" | "images" | "price" | "category"
>;

/** The vendor payload nested in an order (`VendorInfo` + email). */
export type OrderVendorSummary = VendorInfo & {
  email?: string;
};

export type Order = {
  _id: string;
  itemId: string;
  vendorId: string;
  customerId: string;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
  status: OrderStatus;
  createdAt: string;
  requestDate: string;
  item: OrderMenuItemSummary;
  vendor: OrderVendorSummary;
};

export type OrdersResponse = ApiResponse<Order[]>;

export type CancelOrderResponse = ApiResponse<unknown>;

export type CustomerOverview = {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  cancelled: number;
};

export type CustomerOverviewResponse = ApiResponse<CustomerOverview>;
