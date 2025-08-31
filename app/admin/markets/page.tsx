"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, MoreHorizontal, Check, X, Edit, Eye, Delete, DoorClosed, Archive, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
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
  resolveMarket,
} from "@/lib/api";
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"

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

// Remove unused mock markets

export default function MarketsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMarket, setSelectedMarket] = useState<any>(null);
  const [marketCreate, setMarketCreate] = useState({
    question: "",
    category: "",
    endDate: "",
    image: null as File | null,
    imageHint: "",
    isDaily: false,
  });
  const [marketsData, setMarketsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Fetch markets from API
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
  useEffect(() => {
    fetchMarkets();
  }, []);

  // Add status filter state
  const [statusFilter, setStatusFilter] = useState<"all" | "Open" | "closed" | "archieve">("all");

  const filteredMarkets = marketsData.filter((market: any) => {
    const matchesSearch =
      (market.question || market.title || market.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (market.category || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (market.status || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : (market.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredMarkets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMarkets = filteredMarkets.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const goToFirstPage = () => goToPage(1)
  const goToLastPage = () => goToPage(totalPages)
  const goToNextPage = () => goToPage(currentPage + 1)
  const goToPreviousPage = () => goToPage(currentPage - 1)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  const handleApprove = async (marketId: string) => {
    setLoading(true)
    try {
      await updateMarket(marketId, { status: "Open" });
      setMarketsData((prev) =>
        prev.map((m) =>
          m.id === marketId ? { ...m, status: "Open" } : m
        )
      );
      toast.success("Market Opened successfully");
    } catch (e) {
      console.error("Failed to approve market:", e);
      toast.error("Failed to approve market");
    }finally{
      setLoading(false)
      fetchMarkets();
    }
  };

  const handleReject = async (marketId: string) => {
    setLoading(true)
    try {
      await updateMarket(marketId, { status: "closed" });
      setMarketsData((prev) =>
        prev.map((m) =>
          m.id === marketId ? { ...m, status: "closed" } : m
        )
      );
      toast.success("Market closed successfully");
    } catch (e) {
      console.error("Failed to reject market:", e);
      toast.error("Failed to close market");
    }finally{
      setLoading(false)
      fetchMarkets();
    }
  };

const handleArchive = async (marketId: string) => {
  setLoading(true);
  try {
    await updateMarket(marketId, { status: "archieve" });
    setMarketsData((prev) =>
      prev.map((m) =>
        m.id === marketId ? { ...m, status: "archieve" } : m
      )
    );
    toast.success("Market archived successfully");
  } catch (e) {
    console.error("Failed to archive market:", e);
    toast.error("Failed to archive market");
  } finally {
    setLoading(false);
    fetchMarkets();
  }
};

  const handleCreateMarket = async () => {
    setLoading(true)
    try {
      const { image, imageHint, question, category, endDate, isDaily } = marketCreate;
      let newMarket;
      // Compose the payload according to backend model
      // Required: question, category, startDate, endDate
      // Optional: image (JSON: {url, hint})
      // status: default 'Open'
      // history: leave empty

      // Use current date as startDate
      const startDate = new Date().toISOString();
      const endDateISO = endDate ? new Date(endDate).toISOString() : "";

      let imagePayload = null;
      if (image) {
        // Upload image to Cloudinary if provided
        if (image) {
          const formData = new FormData();
          formData.append("file", image);
          // Replace with your Cloudinary upload preset and cloud name
          formData.append("upload_preset", "timedrop");
          const cloudName = "dzoo20xzq";
          const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

          const res = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            throw new Error("Image upload failed");
          }

          const data = await res.json();
          imagePayload = { url: data.secure_url, hint: imageHint };
        }
      }

      const payload: any = {
        question,
        category,
        startDate,
        endDate: endDateISO,
        isDaily,
        status: "Open",
      };
      if (imagePayload) {
        payload.image = imagePayload;
      }

      newMarket = await createMarket(payload);

      if (newMarket) {
        setMarketsData((prev) => [newMarket, ...prev]);
        setMarketCreate({
          question: "",
          category: "",
          endDate: "",
          image: null,
          imageHint: "",
          isDaily: false,
        });
      }
    } catch (e) {
      console.error("Failed to create market:", e);
    }finally{
      setLoading(false)
      fetchMarkets();
    }
  };

  const handleResolveMarket = async (marketId: string, outcome: string) => {
    setLoading(true);
    try {
      await resolveMarket(marketId, { outcome });
    } catch (e) {
      console.error("Failed to resolve market:", e);
    } finally {
      setLoading(false);
      fetchMarkets();
    }
  };

  // Handler to close the details dialog
  const handleCloseDetails = () => setSelectedMarket(null);

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
                <Label htmlFor="question">Market Question</Label>
                <Input
                  id="question"
                  placeholder="Enter market question..."
                  value={marketCreate.question}
                  onChange={e => setMarketCreate(mc => ({ ...mc, question: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={marketCreate.category}
                    onValueChange={val => setMarketCreate(mc => ({ ...mc, category: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {orderedCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={marketCreate.endDate}
                    onChange={e => setMarketCreate(mc => ({ ...mc, endDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Market Image</Label>
                <div className="space-y-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0] || null;
                      setMarketCreate(mc => ({ ...mc, image: file }));
                    }}
                  />
                  <Input
                    id="imageHint"
                    placeholder="Image hint (optional)"
                    value={marketCreate.imageHint}
                    onChange={e => setMarketCreate(mc => ({ ...mc, imageHint: e.target.value }))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload an image for the market (JPG, PNG, GIF - Max 5MB)
                  </p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="isDaily">Is Daily</Label>
                <Switch id="isDaily" checked={marketCreate.isDaily} onCheckedChange={e => setMarketCreate(mc => ({ ...mc, isDaily: e }))} />
              </div>
              <Button disabled={loading} onClick={handleCreateMarket}>
                {loading ? "Creating..." : "Create Market"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Market Details Dialog */}
      <Dialog open={!!selectedMarket} onOpenChange={open => { if (!open) handleCloseDetails(); }}>
        <DialogContent className="sm:max-w-[500px] w-full max-w-[95vw] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Market Details</DialogTitle>
            <DialogDescription>
              View detailed information about this market.
            </DialogDescription>
          </DialogHeader>
          {selectedMarket && (
            <div
              className="
                space-y-4
                px-6
                pb-6
                pt-2
                max-h-[70vh]
                overflow-y-auto
                sm:max-h-[60vh]
                w-full
                min-w-0
              "
            >
              <div>
                <Label className="font-semibold">Question</Label>
                <div className="mt-1 break-words">{selectedMarket.question || selectedMarket.title || selectedMarket.name}</div>
              </div>
              <div>
                <Label className="font-semibold">Category</Label>
                <div className="mt-1 break-words">{selectedMarket.category}</div>
              </div>
              <div>
                <Label className="font-semibold">Status</Label>
                <div className="mt-1">
                  <Badge
                    variant={
                      selectedMarket.status === "Open"
                        ? "default"
                        : selectedMarket.status === "closed"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {selectedMarket.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="font-semibold">isDaily</Label>
                <div className="mt-1">
                  <Badge
                    variant={
                      selectedMarket.isDaily
                        ? "default"
                        : selectedMarket.isDaily === false
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {selectedMarket.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="font-semibold">Start Date</Label>
                <div className="mt-1">
                  {selectedMarket.startDate
                    ? new Date(selectedMarket.startDate).toLocaleString()
                    : ""}
                </div>
              </div>
              <div>
                <Label className="font-semibold">End Date</Label>
                <div className="mt-1">
                  {selectedMarket.endDate
                    ? new Date(selectedMarket.endDate).toLocaleString()
                    : ""}
                </div>
              </div>

              {selectedMarket.image && selectedMarket.image.url && (
                <div>
                  <Label className="font-semibold">Image</Label>
                  <div className="mt-2 flex flex-col gap-2 items-center">
                    <img
                      src={selectedMarket.image.url}
                      alt={selectedMarket.image.hint || "Market image"}
                      className="rounded border max-h-48 object-contain w-full max-w-xs"
                    />
                    {selectedMarket.image.hint && (
                      <span className="text-sm text-muted-foreground text-center">{selectedMarket.image.hint}</span>
                    )}
                  </div>
                </div>
              )}
              <div>
                <Label className="font-semibold">Created At</Label>
                <div className="mt-1">
                  {selectedMarket.createdAt
                    ? new Date(selectedMarket.createdAt).toLocaleString()
                    : ""}
                </div>
              </div>
              {/* You can add more fields here as needed */}
              <div className="flex justify-end">
                <Button variant="outline" onClick={handleCloseDetails}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="px-4"
              // You may want to add logic to highlight the active filter
              // e.g. variant={marketStatus === 'open' ? 'default' : 'outline'}
              onClick={() => setSearchTerm('Open')}
            >
              Open
            </Button>
            <Button
              variant="outline"
              className="px-4"
              onClick={() => setSearchTerm('closed')}
            >
              Closed
            </Button>
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
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Is Daily</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="w-auto">Resolve / Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex flex-col items-center justify-center py-12">
                    <svg
                      className="animate-spin h-8 w-8 text-muted-foreground mb-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    <span className="text-lg font-medium text-muted-foreground">Loading markets...</span>
                  </div>
                </TableCell>
              </TableRow>
              ) :(
                <>
                  {filteredMarkets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}>
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
                    currentMarkets.map((market) => (
                      <TableRow key={market.id}>
                        <TableCell>
                          <div className="max-w-[300px]">
                            <div className="font-medium truncate">{market.question || market.title || market.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {market.createdAt ? `Created ${new Date(market.createdAt).toLocaleDateString()}` : ""}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{market.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              market.status === "Open"
                                ? "default"
                                : market.status === "closed"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {market.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{market.isDaily ? "Yes" : "No"}</Badge>
                        </TableCell>
                        <TableCell>
                          {market.startDate ? new Date(market.startDate).toLocaleDateString() : ""}
                        </TableCell>
                        <TableCell>
                          {market.endDate ? new Date(market.endDate).toLocaleDateString() : ""}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {market.status === "pending" || market.status === "Open" ? (
                              <>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleResolveMarket(market.id, "yes")}
                                  className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleResolveMarket(market.id, "no")}
                                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                              {/* <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleApprove(market.id)}
                                  className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <Check className="h-4 w-4" />
                                </Button> */}
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
                                <DropdownMenuItem onClick={()=> handleArchive(market.id)}>
                                  <Archive className="mr-2 h-4 w-4" />
                                  Archieve Market
                                </DropdownMenuItem>
                                {market.status === "Open" && (
                                  <DropdownMenuItem onClick={() => handleReject(market.id)}>
                                    <DoorClosed className="mr-2 h-4 w-4" />
                                    Close Market
                                  </DropdownMenuItem>
                                )}
                                {market.status === "archieve" && (
                                  <DropdownMenuItem onClick={() => handleApprove(market.id)}>
                                    <Archive className="mr-2 h-4 w-4" />
                                    Unarchieve Market
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <Delete className="mr-2 h-4 w-4" />
                                  Delete Market
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          {filteredMarkets.length > itemsPerPage && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredMarkets.length)} of {filteredMarkets.length} markets
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
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
