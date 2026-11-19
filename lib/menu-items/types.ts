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

export type UpdateMenuItemInput = Partial<CreateMenuItemInput>;

export type MenuItem = CreateMenuItemInput & {
  id: string;
  status: MenuItemStatus;
};

export type ApiResponseBase = {
  success: boolean;
  message: string;
};

export type ApiResponse<T> = ApiResponseBase & {
  data: T;
};

export type ActionResponse = ApiResponseBase;

export type MenuItemsResponse = ApiResponse<MenuItem[]>;

export type MenuItemResponse = ApiResponse<MenuItem>;
