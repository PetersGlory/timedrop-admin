"use client"

import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MoreHorizontal, Plus, Minus, TrendingUp, TrendingDown, Wallet, CreditCard } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Import only getAllPortfolios, and do not import types or adjustment/transaction functions
import { getAllPortfolios } from "@/lib/api"

export default function PortfoliosPage() {
  const [portfolios, setPortfolios] = useState<any>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)

  // Fetch portfolios on mount
  useEffect(() => {
    setLoading(true)
    getAllPortfolios()
      .then((res) => {
        setPortfolios(res.portfolios || [])
        setLoading(false)
      })
      .catch((e) => {
        setError("Failed to fetch portfolios")
        setLoading(false)
      })
  }, [])

  // Filter portfolios by search
  const filteredPortfolios = portfolios.filter(
    (portfolio:any) =>
      portfolio.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portfolio.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate stats
  const totalBalance = portfolios.reduce((sum: any, p: { balance: any }) => sum + (p.balance || 0), 0)
  const totalDeposits = portfolios.reduce((sum: any, p: { totalDeposits: any }) => sum + (p.totalDeposits || 0), 0)
  const totalWithdrawals = portfolios.reduce((sum: any, p: { totalWithdrawals: any }) => sum + (p.totalWithdrawals || 0), 0)
  const totalPending = portfolios.reduce((sum: any, p: { pendingTransactions: any }) => sum + (p.pendingTransactions || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portfolios</h1>
        <p className="text-muted-foreground">Manage user portfolios, balances, and transaction history.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalDeposits.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalWithdrawals.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">+5.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPending}</div>
            <p className="text-xs text-muted-foreground">Transactions pending</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Portfolios Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>User Portfolios</CardTitle>
              <CardDescription>Manage user balances and portfolio status</CardDescription>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search portfolios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading portfolios...</div>
              ) : (
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
                    {filteredPortfolios.map((portfolio: { id: Key | null | undefined; user: { avatar: any; name: string; email: any }; balance: any; status: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; pendingTransactions: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; lastTransaction: any }) => (
                      <TableRow key={portfolio.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={portfolio.user?.avatar || "/placeholder.svg"} alt={portfolio.user?.name || "User"} />
                              <AvatarFallback>
                                {portfolio.user?.name
                                  ? portfolio.user.name
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")
                                  : "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{portfolio.user?.name || "Unknown"}</div>
                              <div className="text-sm text-muted-foreground">{portfolio.user?.email || ""}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          ₦{Number(portfolio.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={portfolio.status === "active" ? "default" : "destructive"}>
                            {portfolio.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {Number(portfolio.pendingTransactions) > 0 ? (
                            <Badge variant="secondary">{portfolio.pendingTransactions}</Badge>
                          ) : (
                            <span className="text-muted-foreground">None</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {portfolio.lastTransaction || "-"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem disabled>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Funds
                              </DropdownMenuItem>
                              <DropdownMenuItem disabled>
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
              )}
              {error && <div className="text-red-500 mt-2">{error}</div>}
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest portfolio activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">Transaction history is not available.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
