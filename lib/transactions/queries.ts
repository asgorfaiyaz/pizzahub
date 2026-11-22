import "server-only";

import { serverApiFetch } from "@/lib/server-api";
import type {
  TransactionsPagination,
  TransactionsResponse,
  Transaction,
} from "./types";

export type TransactionsQuery = {
  page?: number;
  limit?: number;
};

export type TransactionsPage = {
  transactions: Transaction[];
  pagination: TransactionsPagination;
};

export async function getTransactions(
  query: TransactionsQuery = {},
): Promise<TransactionsPage> {
  const params = new URLSearchParams();

  if (query.page && query.page > 1) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  const queryString = params.toString();

  const response = await serverApiFetch<TransactionsResponse>(
    `/admin/transactions${queryString ? `?${queryString}` : ""}`,
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

  return { transactions: response.data, pagination };
}
