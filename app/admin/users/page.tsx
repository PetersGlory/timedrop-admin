"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MoreHorizontal, UserCheck, UserX, Shield, Mail, Ban, Plus, X } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  getAllUsers,
  deleteUser,
  updateUser,
  createUser,
  type User,
  type UserResponse,
  type CreateUserData,
} from "@/lib/api"
import { toast } from "sonner"

// interface ExtendedUser extends User {
//   avatar?: string
//   balance?: string | number
//   marketsCreated?: number
//   totalVolume?: string | number
//   joinDate?: string
//   lastActive?: string
//   name?: string
//   status?: string
// }

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewingUser, setViewingUser] = useState<any>()
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  
  // Create user form state
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createFormData, setCreateFormData] = useState<CreateUserData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    gender: 'male',
    role: 'user'
  })
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    premium: 0,
  })

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError(null)
    getAllUsers()
      .then((res: UserResponse) => {
        if (ignore) return
        // Map/extend users based on the provided API response structure
        const usersWithDefaults: any[] = (res.users || []).map((u:any) => {
          const name = [u.firstName, u.lastName].filter(Boolean).join(" ")
          // For demo, status is "active" if isVerified, else "pending"
          // You can adjust this logic as needed
          let status: string = u.isVerified ? "active" : "pending"
          // Optionally, you could add logic for "suspended" or "banned" if your backend supports it
          return {
            ...u,
            name,
            avatar: "/placeholder-user.jpg",
            balance: "-",
            marketsCreated: 0,
            totalVolume: "-",
            joinDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-",
            lastActive: u.updatedAt ? new Date(u.updatedAt).toLocaleDateString() : "-",
            status,
          }
        })
        setUsers(usersWithDefaults)

        // Calculate stats
        let total = usersWithDefaults.length
        let active = usersWithDefaults.filter((u) => u.status === "active").length
        let suspended = usersWithDefaults.filter((u) => u.status === "suspended").length
        let premium = usersWithDefaults.filter((u) => u.role === "premium").length
        setStats({ total, active, suspended, premium })
      })
      .catch((err) => {
        setError("Failed to load users")
      })
      .finally(() => setLoading(false))
    return () => {
      ignore = true
    }
  }, [])

  const refreshUsers = () => {
    getAllUsers()
      .then((res: UserResponse) => {
        // Map/extend users based on the provided API response structure
        const usersWithDefaults: any[] = (res.users || []).map((u:any) => {
          const name = [u.firstName, u.lastName].filter(Boolean).join(" ")
          // For demo, status is "active" if isVerified, else "pending"
          // You can adjust this logic as needed
          let status: string = u.isVerified ? "active" : "pending"
          // Optionally, you could add logic for "suspended" or "banned" if your backend supports it
          return {
            ...u,
            name,
            avatar: "/placeholder-user.jpg",
            balance: "-",
            marketsCreated: 0,
            totalVolume: "-",
            joinDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-",
            lastActive: u.updatedAt ? new Date(u.updatedAt).toLocaleDateString() : "-",
            status,
          }
        })
        setUsers(usersWithDefaults)

        // Calculate stats
        let total = usersWithDefaults.length
        let active = usersWithDefaults.filter((u) => u.status === "active").length
        let suspended = usersWithDefaults.filter((u) => u.status === "suspended").length
        let premium = usersWithDefaults.filter((u) => u.role === "premium").length
        setStats({ total, active, suspended, premium })
      })
      .catch((err) => {
        setError("Failed to load users")
      })
      .finally(() => setLoading(false))
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesStatus && matchesRole
  })

  const handleUserAction = async (userId: string, action: string) => {
    // You can implement actual API calls here
    if (action === "ban") {
      try {
        await deleteUser(userId)
        setUsers((prev) => prev.filter((u) => u.id !== userId))
      } catch (e) {
        setError("Failed to ban user")
      }
    } else if (action === "suspend") {
      try {
        await updateUser(userId, { status: "suspended" })
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: "suspended" } : u))
        )
      } catch (e) {
        setError("Failed to suspend user")
      }
    } else if (action === "activate") {
      try {
        await updateUser(userId, { status: "active" })
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: "active" } : u))
        )
      } catch (e) {
        setError("Failed to activate user")
      }
    } else {
      // For "view" and "message", just log for now
      console.log(`${action} user:`, userId)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateLoading(true)
    setCreateError(null)

    try {
      const newUser = await createUser(createFormData)
      
      // Add the new user to the list with default values
      toast.success("User created successfully");

      await refreshUsers();
      
      // Reset form and close modal
      setCreateFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        gender: 'male',
        role: 'user'
      })
      setShowCreateForm(false)
      
      // Update stats
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        active: prev.active + 1
      }))
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create user')
    } finally {
      setCreateLoading(false)
    }
  }

  const resetCreateForm = () => {
    setCreateFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      gender: 'male',
      role: 'user'
    })
    setCreateError(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage user accounts, roles, and permissions.</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {/* Placeholder: you can add real stats if available */}
              {stats.total > 0 ? "+12% from last month" : ""}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? `${((stats.active / stats.total) * 100).toFixed(1)}% of total` : ""}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.suspended}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? `${((stats.suspended / stats.total) * 100).toFixed(1)}% of total` : ""}
            </p>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.premium}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? `${((stats.premium / stats.total) * 100).toFixed(1)}% of total` : ""}
            </p>
          </CardContent>
        </Card> */}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  {/* <SelectItem value="premium">Premium</SelectItem> */}
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading users...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Markets</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <span className="text-4xl mb-2">😕</span>
                        <div className="font-semibold text-lg">No users found</div>
                        <div className="text-sm">Try adjusting your filters or search term.</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {/* Profile Modal */}
                    {viewingUser && (
                      <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                        onClick={() => setViewingUser(null)}
                      >
                        <div
                          className="bg-card rounded-lg shadow-lg p-8 w-full max-w-md relative"
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                            onClick={() => setViewingUser(null)}
                            aria-label="Close"
                          >
                            <span className="text-2xl">&times;</span>
                          </button>
                          <div className="flex flex-col items-center gap-4">
                            <Avatar className="h-20 w-20">
                              <AvatarImage src={viewingUser.avatar || "/placeholder.svg"} alt={viewingUser.name || "User"} />
                              <AvatarFallback>
                                {(viewingUser.name || "U")
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                              <div className="font-bold text-xl">{viewingUser.name}</div>
                              <div className="text-muted-foreground">{viewingUser.email}</div>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center mt-2">
                              <Badge
                                variant={
                                  viewingUser.role === "moderator"
                                    ? "default"
                                    : viewingUser.role === "premium"
                                    ? "secondary"
                                    : viewingUser.role === "admin"
                                    ? "default"
                                    : "outline"
                                }
                              >
                                {viewingUser.role}
                              </Badge>
                              <Badge
                                variant={
                                  viewingUser.status === "active"
                                    ? "default"
                                    : viewingUser.status === "suspended"
                                    ? "secondary"
                                    : viewingUser.status === "pending"
                                    ? "outline"
                                    : "destructive"
                                }
                              >
                                {viewingUser.status}
                              </Badge>
                            </div>
                            <div className="w-full mt-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Balance:</span>
                                <span>{viewingUser.balance ?? "-"}</span>
                              </div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Markets Created:</span>
                                <span>{viewingUser.marketsCreated ?? "-"}</span>
                              </div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Total Volume:</span>
                                <span>{viewingUser.totalVolume ?? "-"}</span>
                              </div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Join Date:</span>
                                <span>{viewingUser.joinDate ?? "-"}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Last Active:</span>
                                <span>{viewingUser.lastActive ?? "-"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Create User Modal */}
                    {showCreateForm && (
                      <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                        onClick={() => setShowCreateForm(false)}
                      >
                        <div
                          className="bg-card rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowCreateForm(false)}
                            aria-label="Close"
                          >
                            <X className="h-5 w-5" />
                          </button>
                          
                          <div className="mb-6">
                            <h2 className="text-2xl font-bold">Create New User</h2>
                            <p className="text-muted-foreground">Fill in the details to create a new user account.</p>
                          </div>

                          <form onSubmit={handleCreateUser} className="space-y-4">
                            {createError && (
                              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                                {createError}
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="firstName">First Name *</Label>
                                <Input
                                  id="firstName"
                                  value={createFormData.firstName}
                                  onChange={(e) => setCreateFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                  required
                                  placeholder="Enter first name"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name *</Label>
                                <Input
                                  id="lastName"
                                  value={createFormData.lastName}
                                  onChange={(e) => setCreateFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                  required
                                  placeholder="Enter last name"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={createFormData.email}
                                  onChange={(e) => setCreateFormData(prev => ({ ...prev, email: e.target.value }))}
                                  required
                                  placeholder="Enter email address"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="password">Password *</Label>
                                <Input
                                  id="password"
                                  type="password"
                                  value={createFormData.password}
                                  onChange={(e) => setCreateFormData(prev => ({ ...prev, password: e.target.value }))}
                                  required
                                  placeholder="Enter password"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                  id="phone"
                                  type="tel"
                                  value={createFormData.phone}
                                  onChange={(e) => setCreateFormData(prev => ({ ...prev, phone: e.target.value }))}
                                  placeholder="Enter phone number"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select 
                                  value={createFormData.gender} 
                                  onValueChange={(value: 'male' | 'female') => 
                                    setCreateFormData(prev => ({ ...prev, gender: value }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="role">Role *</Label>
                              <Select 
                                value={createFormData.role} 
                                onValueChange={(value: 'user' | 'admin' | 'super_admin' | 'manager') => 
                                  setCreateFormData(prev => ({ ...prev, role: value }))
                                }
                                required
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">User</SelectItem>
                                  <SelectItem value="manager">Manager</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="super_admin">Super Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex gap-3 pt-4">
                              <Button 
                                type="submit" 
                                disabled={createLoading}
                                className="flex-1"
                              >
                                {createLoading ? "Creating..." : "Create User"}
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => {
                                  resetCreateForm()
                                  setShowCreateForm(false)
                                }}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name || "User"} />
                              <AvatarFallback>
                                {(user.name || "U")
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "moderator"
                                ? "default"
                                : user.role === "premium"
                                ? "secondary"
                                : user.role === "admin"
                                ? "default"
                                : "outline"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "active"
                                ? "default"
                                : user.status === "suspended"
                                ? "secondary"
                                : user.status === "pending"
                                ? "outline"
                                : "destructive"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{user.balance ?? "-"}</TableCell>
                        <TableCell>{user.marketsCreated ?? "-"}</TableCell>
                        <TableCell>{user.totalVolume ?? "-"}</TableCell>
                        <TableCell className="text-muted-foreground">{user.lastActive ?? "-"}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setViewingUser(user)}>
                                <UserCheck className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUserAction(user.id, "message")}>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Message
                              </DropdownMenuItem>
                              {user.status === "active" ? (
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, "suspend")}>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Suspend User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleUserAction(user.id, "activate")}>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Activate User
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleUserAction(user.id, "ban")}
                                className="text-red-600"
                              >
                                <Ban className="mr-2 h-4 w-4" />
                                Ban User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
