"use client";

import React from "react";
import Link from "next/link";
import { getAllOrders, type Order } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type OrdersResponse = { orders: Order[] };

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState<string>("");
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [pageSize, setPageSize] = React.useState<number>(10);

  const loadOrders = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data: OrdersResponse = await getAllOrders();
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load orders";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return orders;
    const lower = query.toLowerCase();
    return orders.filter((o: any) => {
      return (
        String(o?.id ?? "").toLowerCase().includes(lower) ||
        String(o?.status ?? "").toLowerCase().includes(lower) ||
        String(o?.userId ?? o?.user?.id ?? "").toLowerCase().includes(lower) ||
        String(o?.marketId ?? o?.market?.id ?? "").toLowerCase().includes(lower)
      );
    });
  }, [orders, query]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [query, orders, pageSize]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pageItems = React.useMemo(() => filtered.slice(startIndex, endIndex), [filtered, startIndex, endIndex]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl font-semibold">Orders</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by id, status, user, market"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-64"
            />
            <Button onClick={() => void loadOrders()} variant="default">
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-sm text-muted-foreground">Loading orders…</div>
          ) : error ? (
            <div className="flex items-center justify-between rounded-md border p-4">
              <div className="text-sm text-red-600">{error}</div>
              <Button onClick={() => void loadOrders()} variant="outline" size="sm">
                Retry
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Market</TableHead>
                  <TableHead>Paird</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Date Placed</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  pageItems.map((order: any, index: number) => (
                    <TableRow key={order?.id}>
                      <TableCell className="font-mono text-xs">{startIndex + index + 1}</TableCell>
                      <TableCell>{order?.market?.name ?? order?.marketName ?? "-"}</TableCell>
                      <TableCell>{order?.orderPair?.length > 1 ? "Yes" : "No"}</TableCell>
                      <TableCell>{order?.status ?? "-"}</TableCell>
                      <TableCell className="text-right">₦{order?.amount ?? order?.price ?? order?.stake ?? "-"}</TableCell>
                      <TableCell>
                        {order?.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/orders/${order?.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {!isLoading && !error && filtered.length > 0 && (
          <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{endIndex} of {totalItems}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(v) => setPageSize(Number(v))}
                >
                  <SelectTrigger className="w-[90px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      aria-disabled={currentPage === 1}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <div className="px-2 text-sm">Page {currentPage} of {totalPages}</div>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      aria-disabled={currentPage === totalPages}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}


