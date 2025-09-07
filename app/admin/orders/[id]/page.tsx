"use client";

import React from "react";
import { useParams } from "next/navigation";
import { getOrderById, type Order } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const orderId = params?.id as string | undefined;
  const [order, setOrder] = React.useState<Order | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    if (!orderId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getOrderById(orderId);
      setOrder(data as any);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load order";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  React.useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl font-semibold">Order Details</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => window.history.back()}>Back</Button>
            <Button onClick={() => void load()}>Refresh</Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-sm text-muted-foreground">Loading…</div>
          ) : error ? (
            <div className="flex items-center justify-between rounded-md border p-4">
              <div className="text-sm text-red-600">{error}</div>
              <Button onClick={() => void load()} variant="outline" size="sm">Retry</Button>
            </div>
          ) : !order ? (
            <div className="py-10 text-sm text-muted-foreground">Order not found</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs uppercase text-muted-foreground">Order ID</div>
                <div className="font-mono text-sm">{(order as any)?.id ?? "-"}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Status</div>
                <div className="text-sm">{(order as any)?.status ?? "-"}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Market</div>
                <div className="text-sm">{(order as any)?.market?.name ?? (order as any)?.marketName ?? (order as any)?.marketId ?? "-"}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Paired</div>
                <div className="text-sm">{(Array.isArray((order as any)?.orderPair) ? (order as any).orderPair.length : Number((order as any)?.orderPair ?? 0)) > 1 ? "Yes" : "No"}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Amount</div>
                <div className="text-sm">₦{(order as any)?.amount ?? (order as any)?.price ?? (order as any)?.stake ?? "-"}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Date Placed</div>
                <div className="text-sm">{(order as any)?.createdAt ? new Date((order as any).createdAt).toLocaleString() : "-"}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


