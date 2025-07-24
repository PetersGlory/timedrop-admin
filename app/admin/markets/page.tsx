"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, MoreHorizontal, Check, X, Edit, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useEffect } from "react";
import {
  getAllMarkets,
  createMarket,
  updateMarket,
  deleteMarket,
} from "@/lib/api";


const orderedCategories = [
  "News",
  "Climate",
  "Economics",
  "Social",
  "Companies",
  "Sports",
  "Finance",
  "Crypto",
  "Technology",
  "Science",
  "Health",
  "Misc",
]

const markets = [
  {
    id: "1",
    title: "Tesla Q4 2024 Earnings Beat Expectations",
    creator: "john.doe@email.com",
    category: "Stocks",
    status: "pending",
    volume: "$12,450",
    participants: 234,
    endDate: "2024-01-31",
    created: "2024-01-15",
  },
  {
    id: "2",
    title: "Bitcoin Price Above $50k by March 2024",
    creator: "crypto.trader@email.com",
    category: "Crypto",
    status: "approved",
    volume: "$45,230",
    participants: 1,
    endDate: "2024-03-31",
    created: "2024-01-10",
  },
  {
    id: "3",
    title: "Apple to Announce New VR Headset",
    creator: "tech.enthusiast@email.com",
    category: "Technology",
    status: "rejected",
    volume: "$8,900",
    participants: 156,
    endDate: "2024-06-30",
    created: "2024-01-12",
  },
  {
    id: "4",
    title: "US Presidential Election 2024 Winner",
    creator: "political.analyst@email.com",
    category: "Politics",
    status: "approved",
    volume: "$234,567",
    participants: 2,
    endDate: "2024-11-05",
    created: "2024-01-01",
  },
]

export default function MarketsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMarket, setSelectedMarket] = useState<any>(null);
  const [marketCreate, setMarketCreate] = useState({
    title: "",
    description: "",
    category: "",
    endDate: "",
    image: null as File | null,
  });
  const [marketsData, setMarketsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch markets from API
  useEffect(() => {
    const fetchMarkets = async () => {
      setLoading(true);
      try {
        const res = await getAllMarkets();
        setMarketsData(res.markets || []);
      } catch (e) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchMarkets();
  }, []);

  const filteredMarkets = marketsData.filter(
    (market: any) =>
      (market.title || market.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (market.category || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (marketId: string) => {
    try {
      await updateMarket(marketId, { status: "approved" });
      setMarketsData((prev) =>
        prev.map((m) =>
          m.id === marketId ? { ...m, status: "approved" } : m
        )
      );
    } catch (e) {
      // Optionally handle error
    }
  };

  const handleReject = async (marketId: string) => {
    try {
      await updateMarket(marketId, { status: "rejected" });
      setMarketsData((prev) =>
        prev.map((m) =>
          m.id === marketId ? { ...m, status: "rejected" } : m
        )
      );
    } catch (e) {
      // Optionally handle error
    }
  };

  const handleCreateMarket = async () => {
    try {
      const { image, ...rest } = marketCreate;
      let newMarket;
      if (image) {
        // If image upload is needed, use FormData
        const formData = new FormData();
        Object.entries(rest).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
        formData.append("image", image);
        // You'd need a custom endpoint for multipart/form-data
        // For now, fallback to JSON if not supported
        // newMarket = await createMarket(formData);
      } else {
        // Fix type: map rest fields to correct Market property names
        newMarket = await createMarket({
          name: rest.title,
          // description: rest.description,
          // category: rest.category,
          // closeTime: rest.endDate,
        });
      }
      if (newMarket) {
        setMarketsData((prev) => [newMarket, ...prev]);
        setMarketCreate({
          title: "",
          description: "",
          category: "",
          endDate: "",
          image: null,
        });
      }
    } catch (e) {
      // Optionally handle error
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Markets</h1>
          <p className="text-muted-foreground">Manage and review prediction markets on your platform.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Market
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Market</DialogTitle>
              <DialogDescription>Add a new prediction market to the platform.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Market Title</Label>
                <Input id="title" placeholder="Enter market title..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the market..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {orderedCategories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Market Image</Label>
                <div className="space-y-2">
                  <Input id="image" type="file" accept="image/*" />
                  <p className="text-sm text-muted-foreground">
                    Upload an image for the market (JPG, PNG, GIF - Max 5MB)
                  </p>
                </div>
              </div>
              <Button onClick={handleCreateMarket}>Create Market</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Market</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMarkets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="flex flex-col items-center justify-center py-12">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mb-4 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                        />
                      </svg>
                      <span className="text-lg font-medium text-muted-foreground">No markets found</span>
                      <span className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredMarkets.map((market) => (
                  <TableRow key={market.id}>
                    <TableCell>
                      <div className="max-w-[300px]">
                        <div className="font-medium truncate">{market.title}</div>
                        <div className="text-sm text-muted-foreground">Created {market.created}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{market.creator}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{market.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          market.status === "approved"
                            ? "default"
                            : market.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {market.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{market.volume}</TableCell>
                    <TableCell>{market.participants.toLocaleString()}</TableCell>
                    <TableCell>{market.endDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {market.status === "pending" && (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleApprove(market.id)}
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleReject(market.id)}
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedMarket(market)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Market
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
