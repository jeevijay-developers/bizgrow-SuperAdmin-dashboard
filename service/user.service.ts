import api, { ApiResponse } from "./api";

// Types
export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  isActive: boolean;
  isPhoneVerified: boolean;
  tenantId?: string;
  tenant?: {
    id: string;
    name: string;
    slug: string;
  };
  // Activity stats
  lastLogin?: string;
  lastActive?: string;
  ordersProcessed?: number;
  invoicesCreated?: number;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "super_admin" | "owner" | "admin" | "manager" | "staff";
export type UserStatus = "active" | "inactive" | "pending" | "suspended";

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: UserRole | "all";
  status?: UserStatus | "all";
  isActive?: boolean;
  tenantId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UserStatusUpdate {
  isActive: boolean;
  reason?: string;
}

export interface UserCreateData {
  name: string;
  email?: string;
  phone: string;
  role: UserRole;
  tenantId?: string;
  password?: string;
}

export interface UserUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  avatar?: string;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  byRole: {
    owner: number;
    admin: number;
    manager: number;
    staff: number;
  };
  newThisMonth: number;
}

// User Service - Admin operations on users
const userService = {
  /**
   * Get all users across tenants (Admin)
   */
  async getUsers(filters?: UserFilters): Promise<ApiResponse<User[]>> {
    const params = { ...filters };
    if (params.role === "all") delete params.role;
    if (params.status === "all") delete params.status;
    const response = await api.get<ApiResponse<User[]>>("/admin/users", {
      params,
    });
    return response.data;
  },

  /**
   * Get single user by ID (Admin)
   */
  async getUser(userId: string): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>(`/admin/users/${userId}`);
    return response.data;
  },

  /**
   * Update user status - activate/deactivate (Admin)
   */
  async updateUserStatus(
    userId: string,
    data: UserStatusUpdate
  ): Promise<ApiResponse<User>> {
    const response = await api.put<ApiResponse<User>>(
      `/admin/users/${userId}/status`,
      data
    );
    return response.data;
  },

  /**
   * Create new user (Admin)
   */
  async createUser(data: UserCreateData): Promise<ApiResponse<User>> {
    const response = await api.post<ApiResponse<User>>("/admin/users", data);
    return response.data;
  },

  /**
   * Update user details (Admin)
   */
  async updateUser(
    userId: string,
    data: UserUpdateData
  ): Promise<ApiResponse<User>> {
    const response = await api.put<ApiResponse<User>>(
      `/admin/users/${userId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete user (Admin)
   */
  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(
      `/admin/users/${userId}`
    );
    return response.data;
  },

  /**
   * Get user statistics summary (Admin)
   */
  async getUserStats(): Promise<ApiResponse<UserStats>> {
    const response = await api.get<ApiResponse<UserStats>>(
      "/admin/users/stats"
    );
    return response.data;
  },

  /**
   * Reset user password (Admin)
   */
  async resetUserPassword(
    userId: string
  ): Promise<ApiResponse<{ temporaryPassword?: string }>> {
    const response = await api.post<
      ApiResponse<{ temporaryPassword?: string }>
    >(`/admin/users/${userId}/reset-password`);
    return response.data;
  },

  /**
   * Export users data (Admin)
   */
  async exportUsers(format: "csv" | "xlsx" = "csv"): Promise<Blob> {
    const response = await api.get("/admin/users/export", {
      params: { format },
      responseType: "blob",
    });
    return response.data;
  },
};

export default userService;
