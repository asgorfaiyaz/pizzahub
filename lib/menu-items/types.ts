export type MenuItemStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "inactive";

export const MENU_ITEM_CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
] as const;

export type MenuItemCategory = (typeof MENU_ITEM_CATEGORIES)[number];

export type CreateMenuItemInput = {
  itemName: string;
  category: MenuItemCategory;
  description: string;
  price: number;
  location: string;
  images: string[];
};

export type UpdateMenuItemInput = Partial<CreateMenuItemInput> & {
  status?: MenuItemStatus;
};

export type VendorInfo = {
  _id: string;
  name: string;
  businessName?: string;
};

export type MenuItem = CreateMenuItemInput & {
  _id: string;
  status: MenuItemStatus;
  vendorId?: string;
  /** Vendor who owns this item (remote field is `vendor`). */
  vendor?: VendorInfo;
};

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ApiResponseBase = {
  success: boolean;
  message: string;
};

export type ApiResponse<T> = ApiResponseBase & {
  data: T;
};

export type ActionResponse = ApiResponseBase;

export type MenuItemsResponse = ApiResponse<MenuItem[]> & {
  pagination?: Pagination;
};

export type LocationsResponse = ApiResponse<string[]>;

export type MenuItemResponse = ApiResponse<MenuItem>;
