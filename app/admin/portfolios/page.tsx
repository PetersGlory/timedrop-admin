"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MoreHorizontal, TrendingUp, Briefcase, Target, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

const portfolios = [
  {
    id: "1",
    user: {
      name: "John Doe",
      email: "john.doe@email.com",
      avatar: "/placeholder-user.jpg",
    },
    totalValue: 2450.75,
    totalInvested: 2000.0,
    pnl: 450.75,
    pnlPercentage: 22.54,
    activePositions: 8,
    totalTrades: 45,
    winRate: 68.9,
    lastActivity: "2 hours ago",
  },
  {
    id: "2",
    user: {
      name: "Jane Smith",
      email: "jane.smith@email.com",
      avatar: "/placeholder-user.jpg",
    },
    totalValue: 8750.2,
    totalInvested: 7500.0,
    pnl: 1250.2,
    pnlPercentage: 16.67,
    activePositions: 15,
    totalTrades: 123,
    winRate: 72.4,
    lastActivity: "1 day ago",
  },
  {
    id: "3",
    user: {
      name: "Mike Wilson",
      email: "mike.wilson@email.com",
      avatar: "/placeholder-user.jpg",
    },
    totalValue: 890.5,
    totalInvested: 1200.0,
    pnl: -309.5,
    pnlPercentage: -25.79,
    activePositions: 3,
    totalTrades: 28,
    winRate: 42.9,
    lastActivity: "1 week ago",
  },
]

const topHoldings = [
  {
    market: "Tesla Q4 Earnings Beat",
    category: "Stocks",
    totalValue: "$45,230",
    holders: 234,
    avgPosition: "$193.46",
  },
  {
    market: "Bitcoin Above $50k",
    category: "Crypto",
    totalValue: "$32,150",
    holders: 189,
    avgPosition: "$170.11",
  },
  {
    market: "Apple VR Announcement",
    category: "Technology",
    totalValue: "$28,900",
    holders: 156,
    avgPosition: "$185.26",
  },
]

export default function PortfoliosPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPortfolios = portfolios.filter(
    (portfolio) =>
      portfolio.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      portfolio.user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portfolios</h1>
        <p className="text-muted-foreground">Monitor user portfolios, holdings, and trading performance.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12.1M</div>
            <p className="text-xs text-muted-foreground">+15.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,247</div>
            <p className="text-xs text-muted-foreground">Across all users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Win Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">64.8%</div>
            <p className="text-xs text-muted-foreground">Platform average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+$1.4M</div>
            <p className="text-xs text-muted-foreground">Net profit/loss</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Portfolios */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>User Portfolios</CardTitle>
              <CardDescription>Overview of user trading performance</CardDescription>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Portfolio Value</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead>Win Rate</TableHead>
                    <TableHead>Positions</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPortfolios.map((portfolio) => (
                    <TableRow key={portfolio.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={portfolio.user.avatar || "/placeholder.svg"} alt={portfolio.user.name} />
                            <AvatarFallback>
                              {portfolio.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{portfolio.user.name}</div>
                            <div className="text-sm text-muted-foreground">{portfolio.user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${portfolio.totalValue.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className={`font-medium ${portfolio.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {portfolio.pnl >= 0 ? "+" : ""}${portfolio.pnl.toLocaleString()}
                        </div>
                        <div className={`text-sm ${portfolio.pnlPercentage >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {portfolio.pnlPercentage >= 0 ? "+" : ""}
                          {portfolio.pnlPercentage.toFixed(2)}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{portfolio.winRate}%</div>
                          <Progress value={portfolio.winRate} className="h-1" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{portfolio.activePositions}</div>
                          <div className="text-sm text-muted-foreground">{portfolio.totalTrades} total trades</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{portfolio.lastActivity}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>View Holdings</DropdownMenuItem>
                            <DropdownMenuItem>Trade History</DropdownMenuItem>
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

        {/* Top Holdings */}
        <Card>
          <CardHeader>
            <CardTitle>Top Holdings</CardTitle>
            <CardDescription>Most popular markets by total value</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topHoldings.map((holding, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{holding.market}</div>
                  <div className="text-sm text-muted-foreground">
                    <Badge variant="outline" className="mr-2">
                      {holding.category}
                    </Badge>
                    {holding.holders} holders
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{holding.totalValue}</div>
                  <div className="text-sm text-muted-foreground">Avg: {holding.avgPosition}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
