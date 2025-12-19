import useSWR from "swr";
import api from "./api";

// Generic fetcher for SWR
const fetcher = async (url: string) => {
  const response = await api.get(url);
  return response.data;
};

// SWR configuration defaults
export const swrConfig = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 5000,
  errorRetryCount: 3,
};

// ============ Overview / Analytics Hooks ============

export interface OverviewData {
  totalTenants: number;
  activeTenants: number;
  suspendedTenants: number;
  pendingTenants: number;
  trialTenants: number;
  newTenantsThisMonth: number;
  tenantsGrowth: number;
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  whatsappMessages: number;
  whatsappDelivered: number;
  whatsappRead: number;
  whatsappFailed: number;
  deliveryRate: number;
}

export function useOverviewAnalytics() {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: OverviewData;
  }>(
    "/admin/analytics/overview",
    fetcher,
    { refreshInterval: 60000, ...swrConfig } // Refresh every minute
  );

  return {
    data: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}

// ============ Tenant Hooks ============

export interface TenantData {
  id: string;
  _id?: string;
  name: string;
  slug?: string;
  email?: string;
  phone?: string;
  plan?: string;
  business_email?: string;
  business_phone?: string;
  business_type?: string;
  business_address?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  status: "active" | "suspended" | "pending" | "trial" | "cancelled";
  subscription?: {
    plan_id: string;
    status: string;
    valid_until?: string;
    start_date?: string;
    end_date?: string;
  };
  is_active?: boolean;
  is_verified?: boolean;
  gst_number?: string;
  created_at: string;
  updated_at?: string;
  // Frontend computed fields
  users?: number;
  products?: number;
  messagesUsed?: number;
  messagesLimit?: number;
  revenue?: number;
  lastActive?: string;
  integrations?: string[];
}

export interface TenantsResponse {
  success: boolean;
  data: {
    tenants: TenantData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface TenantFilters {
  page?: number;
  limit?: number;
  status?: string;
  plan?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useTenants(filters?: TenantFilters) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== "all") {
        params.append(key, String(value));
      }
    });
  }

  const queryString = params.toString();
  const url = `/admin/tenants${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<TenantsResponse>(
    url,
    fetcher,
    swrConfig
  );

  return {
    tenants: data?.data?.tenants || [],
    pagination: data?.data?.pagination,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useTenant(tenantId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: { tenant: TenantData; stats: { usersCount: number } };
  }>(tenantId ? `/admin/tenants/${tenantId}` : null, fetcher, swrConfig);

  return {
    tenant: data?.data?.tenant as TenantData | undefined,
    stats: data?.data?.stats,
    isLoading,
    isError: error,
    mutate,
  };
}

// ============ User Hooks ============

export interface UserData {
  id: string;
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: "super_admin" | "owner" | "admin" | "manager" | "staff";
  is_active: boolean;
  tenant_id?:
    | {
        _id: string;
        name: string;
      }
    | string;
  last_login?: string;
  created_at: string;
  // Frontend computed fields
  tenant?: string;
  status?: "active" | "inactive" | "pending";
  avatar?: string;
  ordersProcessed?: number;
  invoicesCreated?: number;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: UserData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  isActive?: boolean | string;
  tenantId?: string;
  search?: string;
}

export function useUsers(filters?: UserFilters) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== "all") {
        params.append(key, String(value));
      }
    });
  }

  const queryString = params.toString();
  const url = `/admin/users${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<UsersResponse>(
    url,
    fetcher,
    swrConfig
  );

  return {
    users: data?.data?.users || [],
    pagination: data?.data?.pagination,
    isLoading,
    isError: error,
    mutate,
  };
}

// ============ Subscription / Plans Hooks ============

export interface PlanData {
  id: string;
  name: string;
  price: number;
  features: {
    products: number;
    invoices: number;
    whatsapp: number;
  };
}

export function usePlans() {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: { plans: PlanData[] };
  }>("/admin/plans", fetcher, swrConfig);

  return {
    plans: data?.data?.plans || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// ============ Revenue / Analytics Hooks ============

export interface MonthlyRevenueData {
  month: string;
  year: number;
  revenue: number;
  tenants: number;
}

export interface RevenueAnalyticsResponse {
  success: boolean;
  data: {
    revenueData: MonthlyRevenueData[];
    summary: {
      totalRevenue: number;
      averageMonthly: number;
      currentTenants: number;
    };
  };
}

export interface TenantGrowthData {
  month: string;
  year: number;
  new: number;
  churned: number;
}

export interface TenantGrowthResponse {
  success: boolean;
  data: {
    growthData: TenantGrowthData[];
    summary: {
      totalNew: number;
      totalChurned: number;
      netGrowth: number;
      averageNewPerMonth: number;
      churnRate: number;
    };
  };
}

export function useRevenueAnalytics(months: number = 6) {
  const { data, error, isLoading, mutate } = useSWR<RevenueAnalyticsResponse>(
    `/admin/analytics/revenue?months=${months}`,
    fetcher,
    { refreshInterval: 60000, ...swrConfig }
  );

  return {
    revenueData: data?.data?.revenueData || [],
    summary: data?.data?.summary,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useTenantGrowthAnalytics(months: number = 6) {
  const { data, error, isLoading, mutate } = useSWR<TenantGrowthResponse>(
    `/admin/analytics/tenant-growth?months=${months}`,
    fetcher,
    { refreshInterval: 60000, ...swrConfig }
  );

  return {
    growthData: data?.data?.growthData || [],
    summary: data?.data?.summary,
    isLoading,
    isError: error,
    mutate,
  };
}

// ============ Recent Data Hooks (for Dashboard) ============

export function useRecentTenants(limit: number = 5) {
  const { data, error, isLoading, mutate } = useSWR<TenantsResponse>(
    `/admin/tenants?sortBy=created_at&sortOrder=desc&limit=${limit}`,
    fetcher,
    { refreshInterval: 30000, ...swrConfig }
  );

  return {
    tenants: data?.data?.tenants || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// ============ WhatsApp Hooks ============

export function useWhatsAppProviders() {
  const { data, error, isLoading, mutate } = useSWR(
    "/admin/whatsapp/providers",
    fetcher,
    swrConfig
  );

  return {
    providers: data?.data?.providers || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// ============ System Health Hooks ============

export function useSystemHealth() {
  const { data, error, isLoading, mutate } = useSWR("/admin/health", fetcher, {
    refreshInterval: 30000,
    ...swrConfig,
  });

  return {
    health: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}

export default {
  useOverviewAnalytics,
  useTenants,
  useTenant,
  useUsers,
  usePlans,
  useRevenueAnalytics,
  useTenantGrowthAnalytics,
  useRecentTenants,
  useWhatsAppProviders,
  useSystemHealth,
};
