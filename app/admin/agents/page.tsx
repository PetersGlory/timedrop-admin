"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MoreHorizontal, UserCheck, UserX, TrendingUp, Mail, Ban, Plus, X, Copy, ExternalLink } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  getAllAgents,
  createAgent,
  updateAgentStatus,
  getReferralStats,
  type Agent,
  type CreateAgentData,
  type ReferralStats,
} from "@/lib/api"

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [viewingAgent, setViewingAgent] = useState<Agent | null>(null)
  const [agentStats, setAgentStats] = useState<ReferralStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  
  // Create agent form state
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createFormData, setCreateFormData] = useState<CreateAgentData>({
    name: '',
    email: ''
  })
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [createdAgent, setCreatedAgent] = useState<Agent | null>(null)

  // Get token from localStorage or your auth context
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || ''
    }
    return ''
  }

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalVolume: 0,
    totalReferrals: 0
  })

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = getToken()
      const response = await getAllAgents()
      setAgents(response.agents || [])

      // Calculate stats
      const total = response.agents.length
      const active = response.agents.filter((a: Agent) => a.isActive).length
      const inactive = response.agents.filter((a: Agent) => !a.isActive).length
      const totalVolume = response.agents.reduce((sum: number, a: Agent) => 
        sum + parseFloat(String(a.totalReferralVolume || 0)), 0
      )
      const totalReferrals = response.agents.reduce((sum: number, a: Agent) => 
        sum + (a.totalReferrals || 0), 0
      )
      
      setStats({ total, active, inactive, totalVolume, totalReferrals })
    } catch (err) {
      setError("Failed to load agents")
      toast.error("Failed to load agents")
    } finally {
      setLoading(false)
    }
  }

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.referralCode?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "active" && agent.isActive) ||
      (statusFilter === "inactive" && !agent.isActive)

    return matchesSearch && matchesStatus
  })

  const handleAgentAction = async (agentId: string, action: string) => {
    const token = getToken()
    
    if (action === "activate") {
      try {
        await updateAgentStatus(agentId, {isActive: true})
        setAgents((prev) =>
          prev.map((a) => (a.id === agentId ? { ...a, isActive: true } : a))
        )
        toast.success("Agent activated successfully")
      } catch (e) {
        toast.error("Failed to activate agent")
      }
    } else if (action === "deactivate") {
      try {
        await updateAgentStatus(agentId, {isActive:false})
        setAgents((prev) =>
          prev.map((a) => (a.id === agentId ? { ...a, isActive: false } : a))
        )
        toast.success("Agent deactivated successfully")
      } catch (e) {
        toast.error("Failed to deactivate agent")
      }
    }
  }

  const handleViewStats = async (agent: Agent) => {
    setViewingAgent(agent)
    setLoadingStats(true)
    setAgentStats(null)
    
    try {
      const stats = await getReferralStats(agent.referralCode)
      setAgentStats(stats)
    } catch (err) {
      toast.error("Failed to load agent statistics")
    } finally {
      setLoadingStats(false)
    }
  }

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateLoading(true)
    setCreateError(null)

    try {
      const response = await createAgent(createFormData)
      
      // Show success and the generated referral code
      setCreatedAgent(response.agent)
      toast.success("Agent created successfully")
      
      // Refresh agents list
      await fetchAgents()
      
      // Don't close form immediately - show the referral code first
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create agent')
      toast.error(err instanceof Error ? err.message : 'Failed to create agent')
    } finally {
      setCreateLoading(false)
    }
  }

  const resetCreateForm = () => {
    setCreateFormData({
      name: '',
      email: ''
    })
    setCreateError(null)
    setCreatedAgent(null)
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success("Referral code copied to clipboard")
  }

  const handleCopyLink = (code: string) => {
    const link = `${window.location.origin}?ref=${code}`
    navigator.clipboard.writeText(link)
    toast.success("Referral link copied to clipboard")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
          <p className="text-muted-foreground">Manage referral agents and track their performance.</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Agent
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} active, {stats.inactive} inactive
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all agents
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{stats.totalVolume.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From referral orders
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? `${((stats.active / stats.total) * 100).toFixed(1)}% of total` : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search agents by name, email, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading agents...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Referral Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Referrals</TableHead>
                  <TableHead>Total Volume</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <span className="text-4xl mb-2">😕</span>
                        <div className="font-semibold text-lg">No agents found</div>
                        <div className="text-sm">Try adjusting your filters or search term.</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAgents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" alt={agent.name} />
                            <AvatarFallback>
                              {agent.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-sm text-muted-foreground">{agent.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                            {agent.referralCode}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleCopyCode(agent.referralCode)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={agent.isActive ? "default" : "secondary"}>
                          {agent.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {agent.totalReferrals.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        ₦{parseFloat(String(agent.totalReferralVolume || 0)).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(agent.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewStats(agent)}>
                              <TrendingUp className="mr-2 h-4 w-4" />
                              View Statistics
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyLink(agent.referralCode)}>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Copy Referral Link
                            </DropdownMenuItem>
                            {agent.isActive ? (
                              <DropdownMenuItem onClick={() => handleAgentAction(agent.id, "deactivate")}>
                                <UserX className="mr-2 h-4 w-4" />
                                Deactivate Agent
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleAgentAction(agent.id, "activate")}>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate Agent
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Agent Stats Modal */}
      {viewingAgent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => {
            setViewingAgent(null)
            setAgentStats(null)
          }}
        >
          <div
            className="bg-card rounded-lg shadow-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setViewingAgent(null)
                setAgentStats(null)
              }}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg" alt={viewingAgent.name} />
                  <AvatarFallback className="text-xl">
                    {viewingAgent.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{viewingAgent.name}</h2>
                  <p className="text-muted-foreground">{viewingAgent.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                      {viewingAgent.referralCode}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyCode(viewingAgent.referralCode)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {loadingStats ? (
              <div className="text-center py-8 text-muted-foreground">Loading statistics...</div>
            ) : agentStats ? (
              <div className="space-y-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Referrals
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {agentStats.stats.totalReferrals}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Volume
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ₦{agentStats.stats.totalVolume.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Last 30 Days
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {agentStats.stats.last30Days.referrals}
                      </div>
                      <p className="text-xs text-muted-foreground">referrals</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        30-Day Volume
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ₦{agentStats.stats.last30Days.volume.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Referrals */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Referrals</h3>
                  {agentStats.recentReferrals.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No referrals yet
                    </div>
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Market ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {agentStats.recentReferrals.map((referral) => (
                            <TableRow key={referral.id}>
                              <TableCell>{referral.userName}</TableCell>
                              <TableCell className="font-mono text-sm">
                                {referral.marketId.substring(0, 8)}...
                              </TableCell>
                              <TableCell>
                                <Badge variant={referral.orderType === 'BUY' ? 'default' : 'secondary'}>
                                  {referral.orderType}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">
                                ₦{referral.orderAmount.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {new Date(referral.createdAt).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Failed to load statistics
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Agent Modal */}
      {showCreateForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => {
            if (!createdAgent) {
              setShowCreateForm(false)
              resetCreateForm()
            }
          }}
        >
          <div
            className="bg-card rounded-lg shadow-lg p-8 w-full max-w-md relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setShowCreateForm(false)
                resetCreateForm()
              }}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            
            {!createdAgent ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Create New Agent</h2>
                  <p className="text-muted-foreground">Register a new referral agent.</p>
                </div>

                <form onSubmit={handleCreateAgent} className="space-y-4">
                  {createError && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                      {createError}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={createFormData.name}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="Enter agent's full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={createFormData.email}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="submit" 
                      disabled={createLoading}
                      className="flex-1"
                    >
                      {createLoading ? "Creating..." : "Create Agent"}
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
              </>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Agent Created Successfully!</h2>
                  <p className="text-muted-foreground">
                    The agent has been registered with the following details:
                  </p>
                </div>

                <div className="space-y-4 p-4 bg-muted rounded-lg">
                  <div>
                    <Label className="text-xs text-muted-foreground">Name</Label>
                    <div className="font-medium">{createdAgent.name}</div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <div className="font-medium">{createdAgent.email}</div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">Referral Code</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 px-3 py-2 bg-background rounded font-mono text-lg font-bold">
                        {createdAgent.referralCode}
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopyCode(createdAgent.referralCode)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">Referral Link</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        readOnly
                        value={`${window.location.origin}?ref=${createdAgent.referralCode}`}
                        className="font-mono text-xs"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopyLink(createdAgent.referralCode)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    setShowCreateForm(false)
                    resetCreateForm()
                  }}
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}