"use client"

import React, { useEffect, useState } from "react";
import { getAllWithdrawals, updateWithdrawal, getWithdrawalById } from "@/lib/api";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Eye, Check, X } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
  completed: "success",
};

const Withdrawals: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchWithdrawals();
    // eslint-disable-next-line
  }, []);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const data = await getAllWithdrawals();
      setWithdrawals(data.withdrawals || []);
    } catch (e) {
      toast.error("Failed to fetch withdrawals");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id: string) => {
    setActionLoading(id);
    try {
      const data = await getWithdrawalById(id);
      setSelectedWithdrawal(data);
      setDetailsOpen(true);
    } catch (e) {
      toast.error("Failed to fetch withdrawal details");
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setActionLoading(id + status);
    try {
      await updateWithdrawal(id, { status });
      setWithdrawals((prev) =>
        prev.map((w) => (w.id === id ? { ...w, status } : w))
      );
      toast.success(`Withdrawal ${status === "approved" ? "approved" : "rejected"} successfully`);
    } catch (e) {
      toast.error("Failed to update withdrawal status");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Withdrawals</h1>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg">Withdrawal Requests</span>
            {loading && <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No withdrawals found.
                  </TableCell>
                </TableRow>
              ) : (
                withdrawals && withdrawals.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell>
                      {w.user?.name || w.user?.email || w.userId || "Unknown"}
                    </TableCell>
                    <TableCell>
                      {w.amount ? (
                        <span>
                          {w.amount} {w.currency || ""}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[w.status] as "default" | "destructive" | "outline" | "secondary" || "secondary"}>
                        {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {w.createdAt
                        ? new Date(w.createdAt).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleViewDetails(w.id)}
                          disabled={actionLoading === w.id}
                          title="View Details"
                        >
                          {actionLoading === w.id ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        {w.status === "pending" && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleStatusChange(w.id, "approved")}
                              disabled={actionLoading === w.id + "approved"}
                              title="Approve"
                            >
                              {actionLoading === w.id + "approved" ? (
                                <Loader2 className="animate-spin h-4 w-4" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleStatusChange(w.id, "rejected")}
                              disabled={actionLoading === w.id + "rejected"}
                              title="Reject"
                            >
                              {actionLoading === w.id + "rejected" ? (
                                <Loader2 className="animate-spin h-4 w-4" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdrawal Details</DialogTitle>
            <DialogDescription>
              {selectedWithdrawal ? (
                <div className="space-y-2 mt-2">
                  <div>
                    <span className="font-semibold">User: </span>
                    {selectedWithdrawal.user?.name ||
                      selectedWithdrawal.user?.email ||
                      selectedWithdrawal.userId ||
                      "Unknown"}
                  </div>
                  <div>
                    <span className="font-semibold">Amount: </span>
                    {selectedWithdrawal.amount} {selectedWithdrawal.currency || ""}
                  </div>
                  <div>
                    <span className="font-semibold">Status: </span>
                    <Badge
                      variant={
                        (statusColors[selectedWithdrawal.status] as
                          | "secondary"
                          | "default"
                          | "destructive"
                          | "outline"
                          | null
                          | undefined) ?? "secondary"
                      }
                    >
                      {selectedWithdrawal.status.charAt(0).toUpperCase() +
                        selectedWithdrawal.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-semibold">Requested At: </span>
                    {selectedWithdrawal.createdAt
                      ? new Date(selectedWithdrawal.createdAt).toLocaleString()
                      : "-"}
                  </div>
                  {selectedWithdrawal.details && (
                    <div>
                      <span className="font-semibold">Details: </span>
                      <pre className="bg-muted rounded p-2 text-sm whitespace-pre-wrap">
                        {JSON.stringify(selectedWithdrawal.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <span>Loading...</span>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Withdrawals;