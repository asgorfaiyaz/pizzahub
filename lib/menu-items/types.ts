export type MenuItemStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "inactive";

export type CreateMenuItemInput = {
  itemName: string;
  category: string;
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
