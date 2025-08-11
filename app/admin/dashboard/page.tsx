"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, Wallet, Activity, ArrowUpRight, ArrowDownRight, MoreHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { getAllUsers, getAllMarkets, getAllPortfolios, getAllOrders, getAllSettings, getAllActivities } from "@/lib/api"

export default function DashboardPage() {
  const [stats, setStats] = useState([
    { title: "Total Users", value: "-", change: "-", trend: "up", icon: Users },
    { title: "Active Markets", value: "-", change: "-", trend: "up", icon: TrendingUp },
    { title: "Total Portfolios", value: "-", change: "-", trend: "up", icon: Wallet },
    { title: "Total Orders", value: "-", change: "-", trend: "up", icon: Activity },
  ])
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState<any>()
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      try {
        const [users, markets, portfolios, orders, recentActivities] = await Promise.all([
          getAllUsers(),
          getAllMarkets(),
          getAllPortfolios(),
          getAllOrders(),
          getAllActivities()
        ])
        setStats([
          {
            title: "Total Users",
            value: users.users.length.toLocaleString(),
            change: "+0%", // Placeholder, update with real data if available
            trend: "up",
            icon: Users,
          },
          {
            title: "Active Markets",
            value: markets.markets.length.toLocaleString(),
            change: "+0%",
            trend: "up",
            icon: TrendingUp,
          },
          {
            title: "Total Portfolios",
            value: portfolios.portfolios.length.toLocaleString(),
            change: "+0%",
            trend: "up",
            icon: Wallet,
          },
          {
            title: "Total Orders",
            value: orders.orders.length.toLocaleString(),
            change: "+0%",
            trend: "up",
            icon: Activity,
          },
        ])
        setRecentActivity(recentActivities.activities)
        setCurrentPage(1) // Reset to first page when new data loads
      } catch (e) {
        // Optionally handle error
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  // Pagination logic
  const totalPages = recentActivity ? Math.ceil(recentActivity.length / itemsPerPage) : 0
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentActivities = recentActivity ? recentActivity.slice(startIndex, endIndex) : []

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const goToFirstPage = () => goToPage(1)
  const goToLastPage = () => goToPage(totalPages)
  const goToNextPage = () => goToPage(currentPage + 1)
  const goToPreviousPage = () => goToPage(currentPage - 1)

  // Keep recentActivity static for now, unless an endpoint is available
  // const recentActivity = [
  //   {
  //     id: "1",
  //     type: "Market Created",
  //     user: "john.doe@email.com",
  //     market: "Tesla Q4 Earnings",
  //     status: "pending",
  //     time: "2 minutes ago",
  //   },
  //   {
  //     id: "2",
  //     type: "Withdrawal",
  //     user: "jane.smith@email.com",
  //     amount: "$1,250",
  //     status: "completed",
  //     time: "5 minutes ago",
  //   },
  //   {
  //     id: "3",
  //     type: "User Registration",
  //     user: "mike.wilson@email.com",
  //     status: "active",
  //     time: "12 minutes ago",
  //   },
  //   {
  //     id: "4",
  //     type: "Market Resolved",
  //     user: "admin",
  //     market: "Bitcoin Price Dec 2024",
  //     status: "resolved",
  //     time: "1 hour ago",
  //   },
  // ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening on your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? <span className="animate-pulse">...</span> : stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions and events on your platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>User/Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentActivities.map((activity:any) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.type}</TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start">
                      <div className="font-medium">Name: {activity?.data?.firstName}</div>
                      <div className="font-medium">Desc: {activity?.description}</div>
                      {activity.market && <div className="text-sm text-muted-foreground">{activity.market}</div>}
                      {activity.amount && <div className="text-sm text-muted-foreground">{activity.amount}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        activity.status === "completed" ||
                        activity.status === "active" ||
                        activity.status === "resolved"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {activity.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{activity.timestamp}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Take Action</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          {recentActivity && recentActivity.length > itemsPerPage && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, recentActivity.length)} of {recentActivity.length} activities
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsLeft className="h-4 w-4 rotate-180" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
