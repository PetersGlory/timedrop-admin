"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, Wallet, Activity, ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const stats = [
  {
    title: "Total Users",
    value: "12,543",
    change: "+12.5%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Active Markets",
    value: "847",
    change: "+3.2%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Total Volume",
    value: "$2.4M",
    change: "-2.1%",
    trend: "down",
    icon: Wallet,
  },
  {
    title: "Platform Activity",
    value: "98.2%",
    change: "+0.8%",
    trend: "up",
    icon: Activity,
  },
]

const recentActivity = [
  {
    id: "1",
    type: "Market Created",
    user: "john.doe@email.com",
    market: "Tesla Q4 Earnings",
    status: "pending",
    time: "2 minutes ago",
  },
  {
    id: "2",
    type: "Withdrawal",
    user: "jane.smith@email.com",
    amount: "$1,250",
    status: "completed",
    time: "5 minutes ago",
  },
  {
    id: "3",
    type: "User Registration",
    user: "mike.wilson@email.com",
    status: "active",
    time: "12 minutes ago",
  },
  {
    id: "4",
    type: "Market Resolved",
    user: "admin",
    market: "Bitcoin Price Dec 2024",
    status: "resolved",
    time: "1 hour ago",
  },
]

export default function DashboardPage() {
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
              <div className="text-2xl font-bold">{stat.value}</div>
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
              {recentActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.type}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{activity.user}</div>
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
                  <TableCell className="text-muted-foreground">{activity.time}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  )
}
