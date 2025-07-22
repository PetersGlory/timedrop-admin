"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MoreHorizontal, Plus, Minus, TrendingUp, TrendingDown, Wallet, CreditCard } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const wallets = [
  {
    id: "1",
    user: {
      name: "John Doe",
      email: "john.doe@email.com",
      avatar: "/placeholder-user.jpg",
    },
    balance: 1234.56,
    totalDeposits: 2500.0,
    totalWithdrawals: 1265.44,
    pendingTransactions: 2,
    lastTransaction: "2 hours ago",
    status: "active",
  },
  {
    id: "2",
    user: {
      name: "Jane Smith",
      email: "jane.smith@email.com",
      avatar: "/placeholder-user.jpg",
    },
    balance: 5678.9,
    totalDeposits: 8000.0,
    totalWithdrawals: 2321.1,
    pendingTransactions: 0,
    lastTransaction: "1 day ago",
    status: "active",
  },
  {
    id: "3",
    user: {
      name: "Mike Wilson",
      email: "mike.wilson@email.com",
      avatar: "/placeholder-user.jpg",
    },
    balance: 234.12,
    totalDeposits: 500.0,
    totalWithdrawals: 265.88,
    pendingTransactions: 1,
    lastTransaction: "1 week ago",
    status: "frozen",
  },
]

const recentTransactions = [
  {
    id: "1",
    user: "John Doe",
    type: "deposit",
    amount: 500.0,
    method: "Credit Card",
    status: "completed",
    time: "2 hours ago",
  },
  {
    id: "2",
    user: "Jane Smith",
    type: "withdrawal",
    amount: 1250.0,
    method: "Bank Transfer",
    status: "pending",
    time: "5 hours ago",
  },
  {
    id: "3",
    user: "Mike Wilson",
    type: "deposit",
    amount: 100.0,
    method: "PayPal",
    status: "completed",
    time: "1 day ago",
  },
]

export default function WalletsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedWallet, setSelectedWallet] = useState<any>(null)
  const [adjustmentAmount, setAdjustmentAmount] = useState("")
  const [adjustmentReason, setAdjustmentReason] = useState("")

  const filteredWallets = wallets.filter(
    (wallet) =>
      wallet.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAdjustBalance = (walletId: string, type: "add" | "deduct") => {
    console.log(`${type} balance for wallet:`, walletId, adjustmentAmount, adjustmentReason)
    // API call to adjust balance
    setSelectedWallet(null)
    setAdjustmentAmount("")
    setAdjustmentReason("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallets</h1>
        <p className="text-muted-foreground">Manage user wallets, balances, and transaction history.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4M</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3.2M</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$800K</div>
            <p className="text-xs text-muted-foreground">+5.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Transactions pending</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Wallets Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>User Wallets</CardTitle>
              <CardDescription>Manage user balances and wallet status</CardDescription>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search wallets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pending</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWallets.map((wallet) => (
                    <TableRow key={wallet.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={wallet.user.avatar || "/placeholder.svg"} alt={wallet.user.name} />
                            <AvatarFallback>
                              {wallet.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{wallet.user.name}</div>
                            <div className="text-sm text-muted-foreground">{wallet.user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${wallet.balance.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={wallet.status === "active" ? "default" : "destructive"}>{wallet.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {wallet.pendingTransactions > 0 ? (
                          <Badge variant="secondary">{wallet.pendingTransactions}</Badge>
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{wallet.lastTransaction}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedWallet(wallet)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Funds
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSelectedWallet(wallet)}>
                              <Minus className="mr-2 h-4 w-4" />
                              Deduct Funds
                            </DropdownMenuItem>
                            <DropdownMenuItem>View History</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest wallet activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <div
                  className={`p-2 rounded-full ${
                    transaction.type === "deposit"
                      ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                      : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                  }`}
                >
                  {transaction.type === "deposit" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{transaction.user}</div>
                  <div className="text-sm text-muted-foreground">
                    {transaction.method} • {transaction.time}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${transaction.type === "deposit" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.type === "deposit" ? "+" : "-"}${transaction.amount.toLocaleString()}
                  </div>
                  <Badge variant={transaction.status === "completed" ? "default" : "secondary"} className="text-xs">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Balance Adjustment Dialog */}
      <Dialog open={!!selectedWallet} onOpenChange={() => setSelectedWallet(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Wallet Balance</DialogTitle>
            <DialogDescription>Add or deduct funds from {selectedWallet?.user.name}'s wallet</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Explain the reason for this adjustment..."
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleAdjustBalance(selectedWallet?.id, "add")} className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Add Funds
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAdjustBalance(selectedWallet?.id, "deduct")}
                className="flex-1"
              >
                <Minus className="mr-2 h-4 w-4" />
                Deduct Funds
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
