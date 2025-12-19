import api, { ApiResponse } from "./api";

// Types
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  status: TenantStatus;
  plan: string;
  planId: string;
  businessType?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstNumber?: string;
  logo?: string;
  settings?: TenantSettings;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  // Usage stats
  users: number;
  products: number;
  messagesUsed: number;
  messagesLimit: number;
  revenue: number;
  integrations: string[];
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
}

export type TenantStatus =
  | "active"
  | "suspended"
  | "pending"
  | "trial"
  | "cancelled";

export interface TenantSettings {
  currency?: string;
  timezone?: string;
  language?: string;
  taxEnabled?: boolean;
  defaultTaxRate?: number;
  lowStockThreshold?: number;
  orderPrefix?: string;
  invoicePrefix?: string;
}

export interface TenantFilters {
  page?: number;
  limit?: number;
  status?: TenantStatus | "all";
  plan?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface TenantStatusUpdate {
  status: "active" | "suspended";
  reason?: string;
}

export interface TenantPlanUpdate {
  planId: string;
  effectiveDate?: string;
}

export interface TenantCreateData {
  name: string;
  email: string;
  phone?: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  planId: string;
  businessType?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstNumber?: string;
}

export interface TenantUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  businessType?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstNumber?: string;
  settings?: Partial<TenantSettings>;
}

export interface TenantStats {
  total: number;
  active: number;
  suspended: number;
  pending: number;
  trial: number;
  newThisMonth: number;
  churnedThisMonth: number;
}

// Tenant Service - Admin operations on tenants
const tenantService = {
  /**
   * Get all tenants with optional filters (Admin)
   */
  async getTenants(filters?: TenantFilters): Promise<ApiResponse<Tenant[]>> {
    const params = { ...filters };
    if (params.status === "all") delete params.status;
    const response = await api.get<ApiResponse<Tenant[]>>("/admin/tenants", {
      params,
    });
    return response.data;
  },

  /**
   * Get single tenant by ID (Admin)
   */
  async getTenant(tenantId: string): Promise<ApiResponse<Tenant>> {
    const response = await api.get<ApiResponse<Tenant>>(
      `/admin/tenants/${tenantId}`
    );
    return response.data;
  },

  /**
   * Update tenant status - activate/suspend (Admin)
   */
  async updateTenantStatus(
    tenantId: string,
    data: TenantStatusUpdate
  ): Promise<ApiResponse<Tenant>> {
    const response = await api.put<ApiResponse<Tenant>>(
      `/admin/tenants/${tenantId}/status`,
      data
    );
    return response.data;
  },

  /**
   * Update tenant subscription plan (Admin)
   */
  async updateTenantPlan(
    tenantId: string,
    data: TenantPlanUpdate
  ): Promise<ApiResponse<Tenant>> {
    const response = await api.put<ApiResponse<Tenant>>(
      `/admin/tenants/${tenantId}/plan`,
      data
    );
    return response.data;
  },

  /**
   * Create new tenant (Admin)
   */
  async createTenant(data: TenantCreateData): Promise<ApiResponse<Tenant>> {
    const response = await api.post<ApiResponse<Tenant>>(
      "/admin/tenants",
      data
    );
    return response.data;
  },

  /**
   * Update tenant details (Admin)
   */
  async updateTenant(
    tenantId: string,
    data: TenantUpdateData
  ): Promise<ApiResponse<Tenant>> {
    const response = await api.put<ApiResponse<Tenant>>(
      `/admin/tenants/${tenantId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete tenant (Admin) - Usually soft delete
   */
  async deleteTenant(tenantId: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(
      `/admin/tenants/${tenantId}`
    );
    return response.data;
  },

  /**
   * Get tenant statistics summary (Admin)
   */
  async getTenantStats(): Promise<ApiResponse<TenantStats>> {
    const response = await api.get<ApiResponse<TenantStats>>(
      "/admin/tenants/stats"
    );
    return response.data;
  },

  /**
   * Get recent tenant signups (Admin)
   */
  async getRecentSignups(limit: number = 5): Promise<ApiResponse<Tenant[]>> {
    const response = await api.get<ApiResponse<Tenant[]>>("/admin/tenants", {
      params: { sortBy: "createdAt", sortOrder: "desc", limit },
    });
    return response.data;
  },

  /**
   * Export tenants data (Admin)
   */
  async exportTenants(format: "csv" | "xlsx" = "csv"): Promise<Blob> {
    const response = await api.get("/admin/tenants/export", {
      params: { format },
      responseType: "blob",
    });
    return response.data;
  },
};

export default tenantService;
