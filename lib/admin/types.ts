export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt: string;
  isBlocked?: boolean;
};

export type UsersPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type UsersResponse = {
  success: boolean;
  message: string;
  data: User[];
  pagination?: UsersPagination;
};

export type UserResponse = {
  success: boolean;
  message: string;
  data: User;
};
