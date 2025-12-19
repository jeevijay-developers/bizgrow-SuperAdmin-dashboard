import api, { ApiResponse } from "./api";

// Types
export interface RevenueOverview {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  avgMonthlyRevenue: number;
  revenueGrowth: number;
  expenseGrowth: number;
  profitGrowth: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface RevenueByPlan {
  name: string;
  value: number;
  subscribers: number;
  color?: string;
  percentage?: number;
}

export interface TopTenant {
  id: string;
  name: string;
  plan: string;
  revenue: number;
  growth: number;
}

export interface RevenueBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface RevenueAnalytics {
  overview: RevenueOverview;
  monthlyRevenue: MonthlyRevenue[];
  revenueByPlan: RevenueByPlan[];
  topTenants: TopTenant[];
  breakdown: RevenueBreakdown[];
}

export interface RevenueFilters {
  startDate?: string;
  endDate?: string;
  timeRange?: "30days" | "3months" | "6months" | "1year" | "custom";
}

export interface MRRMetrics {
  currentMRR: number;
  previousMRR: number;
  growth: number;
  newMRR: number;
  churnedMRR: number;
  expansionMRR: number;
  arr: number;
}

// Revenue Service - Admin analytics and reporting
const revenueService = {
  /**
   * Get revenue analytics overview (Admin)
   */
  async getRevenueAnalytics(
    filters?: RevenueFilters
  ): Promise<ApiResponse<RevenueAnalytics>> {
    const response = await api.get<ApiResponse<RevenueAnalytics>>(
      "/admin/analytics/revenue",
      { params: filters }
    );
    return response.data;
  },

  /**
   * Get monthly revenue data (Admin)
   */
  async getMonthlyRevenue(
    filters?: RevenueFilters
  ): Promise<ApiResponse<MonthlyRevenue[]>> {
    const response = await api.get<ApiResponse<MonthlyRevenue[]>>(
      "/admin/analytics/revenue/monthly",
      { params: filters }
    );
    return response.data;
  },

  /**
   * Get revenue breakdown by plan (Admin)
   */
  async getRevenueByPlan(
    filters?: RevenueFilters
  ): Promise<ApiResponse<RevenueByPlan[]>> {
    const response = await api.get<ApiResponse<RevenueByPlan[]>>(
      "/admin/analytics/revenue/by-plan",
      { params: filters }
    );
    return response.data;
  },

  /**
   * Get top revenue generating tenants (Admin)
   */
  async getTopTenants(
    limit: number = 5,
    filters?: RevenueFilters
  ): Promise<ApiResponse<TopTenant[]>> {
    const response = await api.get<ApiResponse<TopTenant[]>>(
      "/admin/analytics/revenue/top-tenants",
      {
        params: { limit, ...filters },
      }
    );
    return response.data;
  },

  /**
   * Get revenue breakdown by category (Admin)
   */
  async getRevenueBreakdown(
    filters?: RevenueFilters
  ): Promise<ApiResponse<RevenueBreakdown[]>> {
    const response = await api.get<ApiResponse<RevenueBreakdown[]>>(
      "/admin/analytics/revenue/breakdown",
      { params: filters }
    );
    return response.data;
  },

  /**
   * Get MRR (Monthly Recurring Revenue) metrics (Admin)
   */
  async getMRRMetrics(): Promise<ApiResponse<MRRMetrics>> {
    const response = await api.get<ApiResponse<MRRMetrics>>(
      "/admin/analytics/revenue/mrr"
    );
    return response.data;
  },

  /**
   * Export revenue report (Admin)
   */
  async exportRevenueReport(
    format: "csv" | "xlsx" | "pdf" = "csv",
    filters?: RevenueFilters
  ): Promise<Blob> {
    const response = await api.get("/admin/analytics/revenue/export", {
      params: { format, ...filters },
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Get platform overview analytics (Admin) - for dashboard
   */
  async getOverviewAnalytics(): Promise<
    ApiResponse<{
      totalRevenue: number;
      activeTenants: number;
      totalUsers: number;
      whatsappMessages: number;
      revenueGrowth: number;
      tenantsGrowth: number;
      usersGrowth: number;
      deliveryRate: number;
    }>
  > {
    const response = await api.get<
      ApiResponse<{
        totalRevenue: number;
        activeTenants: number;
        totalUsers: number;
        whatsappMessages: number;
        revenueGrowth: number;
        tenantsGrowth: number;
        usersGrowth: number;
        deliveryRate: number;
      }>
    >("/admin/analytics/overview");
    return response.data;
  },
};

export default revenueService;
