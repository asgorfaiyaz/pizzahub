import "server-only";

import { serverApiFetch } from "@/lib/server-api";
import type {
  User,
  UsersResponse,
  UserResponse,
  UsersPagination,
} from "./types";

export type UsersQuery = {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
};

export type UsersPage = {
  users: User[];
  pagination: UsersPagination;
};

export async function getUsers(query: UsersQuery = {}): Promise<UsersPage> {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.role) params.set("role", query.role);
  if (query.page && query.page > 1) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  const queryString = params.toString();

  const response = await serverApiFetch<UsersResponse>(
    `/admin/users${queryString ? `?${queryString}` : ""}`,
    {
      auth: "required",
      method: "GET",
    },
  );

  const pagination = response.pagination ?? {
    total: response.data.length,
    page: query.page ?? 1,
    limit: query.limit ?? response.data.length,
    totalPages: 1,
  };

  return { users: response.data, pagination };
}

export async function getUserById(id: string): Promise<User> {
  const response = await serverApiFetch<UserResponse>(
    `/admin/users/${encodeURIComponent(id)}`,
    {
      auth: "required",
      method: "GET",
    },
  );

  return response.data;
}
