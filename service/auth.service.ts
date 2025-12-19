import api, { ApiResponse } from "./api";

// Types
export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: "super_admin" | "owner" | "admin" | "manager" | "staff";
  avatar?: string;
  isActive: boolean;
  isPhoneVerified: boolean;
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface AdminLoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  token: string;
  accessToken?: string; // For backward compatibility
  refreshToken: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  admin?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  user?: User;
}

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface OtpSendData {
  phone: string;
  purpose?: "login" | "signup" | "verification";
}

export interface OtpVerifyData {
  phone: string;
  otp: string;
}

export interface ChangePhoneData {
  newPhone: string;
  otp: string;
}

// Auth Service
const authService = {
  /**
   * Super admin login with email and password
   */
  async adminLogin(
    credentials: AdminLoginCredentials
  ): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post<ApiResponse<LoginResponse>>(
      "/auth/admin/login",
      credentials
    );

    // Store tokens and set auth flag
    if (response.data.success && response.data.data) {
      // Backend returns 'token' instead of 'accessToken'
      localStorage.setItem("accessToken", response.data.data.token);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      localStorage.setItem("bizgrow360_auth", "true");
    }

    return response.data;
  },

  /**
   * Tenant owner/user login with phone and password
   */
  async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      credentials
    );

    // Store tokens - backend returns 'token' instead of 'accessToken'
    if (response.data.success && response.data.data) {
      localStorage.setItem("accessToken", response.data.data.token);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      localStorage.setItem("bizgrow360_auth", "true");
    }

    return response.data;
  },

  /**
   * Send OTP to phone number
   */
  async sendOtp(data: OtpSendData): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      "/auth/otp/send",
      data
    );
    return response.data;
  },

  /**
   * Verify OTP and login/register
   */
  async verifyOtp(data: OtpVerifyData): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post<ApiResponse<LoginResponse>>(
      "/auth/otp/verify",
      data
    );

    // Store tokens - backend returns 'token' instead of 'accessToken'
    if (response.data.success && response.data.data) {
      localStorage.setItem("accessToken", response.data.data.token);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      localStorage.setItem("bizgrow360_auth", "true");
    }

    return response.data;
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<ApiResponse<AuthTokens>> {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await api.post<ApiResponse<AuthTokens>>("/auth/refresh", {
      refreshToken,
    });

    // Update stored tokens - handle both 'token' and 'accessToken' for compatibility
    if (response.data.success && response.data.data) {
      const newToken =
        response.data.data.token || response.data.data.accessToken;
      if (newToken) {
        localStorage.setItem("accessToken", newToken);
      }
      if (response.data.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
      }
    }

    return response.data;
  },

  /**
   * Logout user - clears tokens
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await api.post<ApiResponse<void>>("/auth/logout");
      return response.data;
    } finally {
      // Always clear tokens on logout
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("bizgrow360_auth");
    }
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>("/auth/profile");
    return response.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: ProfileUpdateData): Promise<ApiResponse<User>> {
    const response = await api.put<ApiResponse<User>>("/auth/profile", data);
    return response.data;
  },

  /**
   * Send OTP to new phone number for phone change
   */
  async sendPhoneChangeOtp(
    newPhone: string
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      "/auth/change-phone/send",
      { newPhone }
    );
    return response.data;
  },

  /**
   * Verify OTP and update phone number
   */
  async verifyPhoneChange(data: ChangePhoneData): Promise<ApiResponse<User>> {
    const response = await api.post<ApiResponse<User>>(
      "/auth/change-phone/verify",
      data
    );
    return response.data;
  },

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("accessToken");
  },

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  },
};

export default authService;
