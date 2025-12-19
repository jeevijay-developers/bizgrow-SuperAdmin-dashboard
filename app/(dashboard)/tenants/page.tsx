"use client";

import * as React from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Users,
  Package,
  MessageSquare,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useTenants,
  useTenant,
  tenantService,
  getErrorMessage,
  type TenantData,
} from "@/service";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";

const ITEMS_PER_PAGE = 10;

export default function TenantsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [planFilter, setPlanFilter] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedTenantId, setSelectedTenantId] = React.useState<string | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Fetch full tenant details when selected
  const { tenant: selectedTenant, isLoading: tenantLoading } =
    useTenant(selectedTenantId);
  const [addTenantOpen, setAddTenantOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [newTenant, setNewTenant] = React.useState({
    name: "",
    email: "",
    phone: "",
    plan: "basic",
    status: "trial",
    business_type: "",
  });

  // Debounce search query
  const [debouncedSearch, setDebouncedSearch] = React.useState(searchQuery);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, planFilter]);

  // Fetch tenants with SWR
  const { tenants, pagination, isLoading, isError, mutate } = useTenants({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    status: statusFilter !== "all" ? statusFilter : undefined,
    plan: planFilter !== "all" ? planFilter : undefined,
    search: debouncedSearch || undefined,
  });

  const totalPages = pagination?.pages || 1;

  const handleRefresh = () => {
    mutate();
    toast.success("Data refreshed");
  };

  const openTenantDrawer = (tenant: TenantData) => {
    setSelectedTenantId(tenant._id || tenant.id);
    setDrawerOpen(true);
  };

  const handleStatusChange = async (
    tenantId: string,
    newStatus: "active" | "suspended"
  ) => {
    try {
      await tenantService.updateTenantStatus(tenantId, { status: newStatus });
      toast.success(
        `Tenant ${
          newStatus === "active" ? "activated" : "suspended"
        } successfully`
      );
      mutate();
    } catch (error) {
      toast.error("Failed to update status", {
        description: getErrorMessage(error),
      });
    }
  };

  const handleAddTenant = async () => {
    if (!newTenant.name || !newTenant.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await tenantService.createTenant({
        name: newTenant.name,
        email: newTenant.email,
        phone: newTenant.phone,
        ownerName: newTenant.name,
        ownerPhone: newTenant.phone,
        ownerEmail: newTenant.email,
        planId: newTenant.plan,
      });
      toast.success("Tenant created successfully");
      setAddTenantOpen(false);
      setNewTenant({
        name: "",
        email: "",
        phone: "",
        plan: "basic",
        status: "trial",
        business_type: "",
      });
      mutate();
    } catch (error) {
      toast.error("Failed to create tenant", {
        description: getErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      trial: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return <Badge className={styles[status] || ""}>{status}</Badge>;
  };

  const getPlanBadge = (planId?: string) => {
    const planNames: Record<string, string> = {
      free: "Free",
      basic: "Basic",
      pro: "Pro",
      enterprise: "Enterprise",
    };
    const styles: Record<string, string> = {
      free: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      basic: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      pro: "bg-primary/10 text-primary",
      enterprise:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    };
    const plan = planId || "free";
    return (
      <Badge variant="outline" className={styles[plan] || styles.free}>
        {planNames[plan] || plan}
      </Badge>
    );
  };

  // Table skeleton
  const TableSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex justify-between items-center py-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-8" />
        </div>
      ))}
    </div>
  );
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Tenant Management
          </h1>
          <p className="text-muted-foreground">
            Manage all registered tenants and their subscriptions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button className="gap-2" onClick={() => setAddTenantOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Tenant
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tenants by name or email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-35">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-35">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tenants Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">All Tenants</CardTitle>
          <CardDescription>
            {pagination?.total || 0} tenants found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : isError ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Failed to load tenants. Please try again.</p>
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          ) : tenants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No tenants found matching your criteria.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow
                    key={tenant._id || tenant.id}
                    className="cursor-pointer"
                    onClick={() => openTenantDrawer(tenant)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">
                          {tenant.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {tenant.email || tenant.business_email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPlanBadge(
                        tenant.plan || tenant.subscription?.plan_id
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {tenant.address?.city || tenant.business_type || "N/A"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {tenant.created_at
                        ? formatDistanceToNow(new Date(tenant.created_at), {
                            addSuffix: true,
                          })
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              openTenantDrawer(tenant);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Tenant
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {tenant.status === "active" ? (
                            <DropdownMenuItem
                              className="text-yellow-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(
                                  tenant._id || tenant.id,
                                  "suspended"
                                );
                              }}
                            >
                              Suspend Tenant
                            </DropdownMenuItem>
                          ) : tenant.status === "suspended" ? (
                            <DropdownMenuItem
                              className="text-green-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(
                                  tenant._id || tenant.id,
                                  "active"
                                );
                              }}
                            >
                              Activate Tenant
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} ({pagination?.total || 0}{" "}
                tenants)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="bg-transparent"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tenant Detail Drawer */}
      <Sheet
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open);
          if (!open) setSelectedTenantId(null);
        }}
      >
        <SheetContent
          className="w-full sm:max-w-lg overflow-y-auto"
          aria-describedby={undefined}
        >
          {tenantLoading ? (
            <>
              <SheetHeader>
                <SheetTitle>Loading tenant...</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 p-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                </div>
                <Skeleton className="h-32" />
              </div>
            </>
          ) : selectedTenant ? (
            <>
              <SheetHeader className="border-none">
                <div>
                  <SheetTitle className="text-xl">
                    {selectedTenant.name}
                  </SheetTitle>
                  <SheetDescription>
                    {selectedTenant.email || selectedTenant.business_email}
                  </SheetDescription>
                </div>
              </SheetHeader>

              <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">
                              {selectedTenant.address?.city ||
                                selectedTenant.business_type ||
                                "N/A"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Location
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <Package className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold capitalize">
                              {selectedTenant.plan ||
                                selectedTenant.subscription?.plan_id ||
                                "Free"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Current Plan
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Status</span>
                        {getStatusBadge(
                          selectedTenant?.is_active ? "active" : "suspended"
                        )}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-medium">
                          {selectedTenant.phone ||
                            selectedTenant.business_phone ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created</span>
                        <span className="font-medium">
                          {selectedTenant.created_at
                            ? format(new Date(selectedTenant.created_at), "PPP")
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Last Updated
                        </span>
                        <span className="font-medium">
                          {selectedTenant.updated_at
                            ? formatDistanceToNow(
                                new Date(selectedTenant.updated_at),
                                { addSuffix: true }
                              )
                            : "N/A"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Subscription Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Plan</span>
                        <span className="font-medium capitalize">
                          {selectedTenant.subscription?.plan_id || "Free"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium capitalize">
                          {selectedTenant.subscription?.status || "Inactive"}
                        </span>
                      </div>
                      {selectedTenant.subscription?.start_date && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Start Date
                          </span>
                          <span className="font-medium">
                            {format(
                              new Date(selectedTenant.subscription.start_date),
                              "PPP"
                            )}
                          </span>
                        </div>
                      )}
                      {selectedTenant.subscription?.end_date && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            End Date
                          </span>
                          <span className="font-medium">
                            {format(
                              new Date(selectedTenant.subscription.end_date),
                              "PPP"
                            )}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Business Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedTenant.address ? (
                        <div className="text-sm space-y-1">
                          {selectedTenant.address.street && (
                            <p>{selectedTenant.address.street}</p>
                          )}
                          <p>
                            {[
                              selectedTenant.address.city,
                              selectedTenant.address.state,
                              selectedTenant.address.pincode,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                          {selectedTenant.address.country && (
                            <p>{selectedTenant.address.country}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No address provided
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">Edit Tenant</Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => {
                        if (selectedTenant.status === "active") {
                          handleStatusChange(
                            selectedTenant._id || selectedTenant.id,
                            "suspended"
                          );
                        } else {
                          handleStatusChange(
                            selectedTenant._id || selectedTenant.id,
                            "active"
                          );
                        }
                        setDrawerOpen(false);
                      }}
                    >
                      {selectedTenant.status === "active"
                        ? "Suspend"
                        : "Activate"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      <Dialog open={addTenantOpen} onOpenChange={setAddTenantOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tenant</DialogTitle>
            <DialogDescription>
              Create a new tenant account for the platform.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tenant-name">Business Name</Label>
              <Input
                id="tenant-name"
                placeholder="Enter business name"
                value={newTenant.name}
                onChange={(e) =>
                  setNewTenant({ ...newTenant, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-email">Email Address</Label>
              <Input
                id="tenant-email"
                type="email"
                placeholder="admin@business.com"
                value={newTenant.email}
                onChange={(e) =>
                  setNewTenant({ ...newTenant, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-phone">Phone Number</Label>
              <Input
                id="tenant-phone"
                type="tel"
                placeholder="+91 9876543210"
                value={newTenant.phone}
                onChange={(e) =>
                  setNewTenant({ ...newTenant, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-type">Business Type</Label>
              <Input
                id="tenant-type"
                placeholder="e.g., Retail, Restaurant, etc."
                value={newTenant.business_type}
                onChange={(e) =>
                  setNewTenant({ ...newTenant, business_type: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-plan">Subscription Plan</Label>
              <Select
                value={newTenant.plan}
                onValueChange={(value) =>
                  setNewTenant({ ...newTenant, plan: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="basic">Basic - ₹8,217/mo</SelectItem>
                  <SelectItem value="pro">Pro - ₹24,817/mo</SelectItem>
                  <SelectItem value="enterprise">
                    Enterprise - ₹49,717/mo
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddTenantOpen(false)}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTenant}
              disabled={!newTenant.name || !newTenant.email || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Tenant"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
