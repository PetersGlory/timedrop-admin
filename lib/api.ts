const BASE_URL = 'https://backendapi.timedrop.live/api'; //'https://timedrop-backend.onrender.com/api';

// --- Types (adjust as needed based on backend models) ---
export interface User {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: 'male' | 'female';
  role: 'user' | 'admin' | 'super_admin' | 'manager';
  status: string;
  // Add more fields as needed
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: 'male' | 'female';
  role: 'user' | 'admin' | 'super_admin' | 'manager';
}

export interface UserResponse {
    users: User[]
}

export interface Market {
  id: string;
  name: string;
  status: string;
  isDaily: boolean;
  // Add more fields as needed
}

// --- Auth Types ---
export interface LoginResponse {
  token: string;
  user: User;
  // Add more fields if the backend returns them
}

// --- Order Types ---
export interface Order {
  id: string;
  // Add more fields as needed
}

// --- Portfolio Types ---
export interface Portfolio {
  id: string;
  // Add more fields as needed
}

// --- Settings Types ---
export interface Settings {
  // Define settings fields as needed
  [key: string]: any;
}

// --- Bookmark Types ---
export interface Bookmark {
  id: string;
  // Add more fields as needed
}

// --- Analytics Types ---
export interface Analytics {
  totalRevenue: number;
  totalVolume: number;
  todaysRevenue: number;
}

// --- Generic fetch wrapper with JWT support ---
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth = true
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (requireAuth) {
    const token = localStorage.getItem('jwt_token');
    if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || res.statusText);
  }
  return res.json();
}

//  ---- Getting Profile ----
export const getProfile = () => apiFetch<User>('/auth/me');

// --- User Endpoints ---
export const getAllUsers = () => apiFetch<UserResponse>('/admin/users');
export const createUser = (data: CreateUserData) =>
  apiFetch<User>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const getUserById = (id: string) =>
  apiFetch<User>(`/admin/users/${id}`);
export const updateUser = (id: string, data: Partial<User>) =>
  apiFetch<User>(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteUser = (id: string) =>
  apiFetch<void>(`/admin/users/${id}`, {
    method: 'DELETE',
  });

// --- Auth Endpoints ---
export const login = (email: string, password: string) =>
  apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }, false);

// --- Market Endpoints ---
export const getAllMarkets = () => apiFetch<{markets:Market[]}>('/admin/markets');
export const createMarket = (data: Partial<Market>) =>
  apiFetch<Market>('/admin/markets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const getMarketById = (id: string) =>
  apiFetch<Market>(`/admin/markets/${id}`);
export const updateMarket = (id: string, data: Partial<Market>) =>
  apiFetch<Market>(`/admin/markets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteMarket = (id: string) =>
  apiFetch<void>(`/admin/markets/${id}`, {
    method: 'DELETE',
  });

// --- Order Endpoints ---
export const getAllOrders = () => apiFetch<{orders:Order[]}>('/admin/orders');
export const createOrder = (data: Partial<Order>) =>
  apiFetch<Order>('/admin/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const getOrderById = (id: string) =>
  apiFetch<Order>(`/admin/orders/${id}`);
export const updateOrder = (id: string, data: Partial<Order>) =>
  apiFetch<Order>(`/admin/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteOrder = (id: string) =>
  apiFetch<void>(`/admin/orders/${id}`, {
    method: 'DELETE',
  });

// --- Portfolio Endpoints ---
export const getAllPortfolios = () => apiFetch<{portfolios:Portfolio[]}>('/admin/portfolios');
export const createPortfolio = (data: Partial<Portfolio>) =>
  apiFetch<Portfolio>('/admin/portfolios', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const getPortfolioById = (id: string) =>
  apiFetch<Portfolio>(`/admin/portfolios/${id}`);
export const updatePortfolio = (id: string, data: Partial<Portfolio>) =>
  apiFetch<Portfolio>(`/admin/portfolios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deletePortfolio = (id: string) =>
  apiFetch<void>(`/admin/portfolios/${id}`, {
    method: 'DELETE',
  });

// --- Settings Endpoint ---
export const getAllSettings = () => apiFetch<Settings>('/admin/settings');
export const getAllActivities = () => apiFetch<any>('/admin/recent-activities');

// --- Settings CRUD Endpoints ---
export const createSettings = (data: Partial<Settings>) =>
  apiFetch<Settings>('/admin/settings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const getSettingsById = (id: string) =>
  apiFetch<Settings>(`/admin/settings/${id}`);
export const updateSettings = (id: string, data: Partial<Settings>) =>
  apiFetch<Settings>(`/admin/settings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteSettings = (id: string) =>
  apiFetch<void>(`/admin/settings/${id}`, {
    method: 'DELETE',
  });

// --- Bookmark Endpoints ---
export const getAllBookmarks = () => apiFetch<Bookmark[]>('/admin/bookmarks');
export const createBookmark = (data: Partial<Bookmark>) =>
  apiFetch<Bookmark>('/admin/bookmarks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const getBookmarkById = (id: string) =>
  apiFetch<Bookmark>(`/admin/bookmarks/${id}`);
export const updateBookmark = (id: string, data: Partial<Bookmark>) =>
  apiFetch<Bookmark>(`/admin/bookmarks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteBookmark = (id: string) =>
  apiFetch<void>(`/admin/bookmarks/${id}`, {
    method: 'DELETE',
  });

export const getAllWithdrawals = () =>
  apiFetch<any>('/admin/withdrawals');

export const getWithdrawalById = (id: string) =>
  apiFetch<any>(`/admin/withdrawals/${id}`);


/**
 * Get platform revenue and trading volume statistics.
 * - Revenue: sum of transaction_fee for all 'trade' transactions.
 * - Volume: sum of amount for all 'trade' transactions.
 * - Todays revenue/date revenue: sum of transaction_fee for 'trade' transactions created on a specific date (if provided) or today.
 *
 * Optional query parameters:
 *   - date (string, optional): ISO string or yyyy-mm-dd. If supplied, returns revenue for that day under `todaysRevenue`. Otherwise, uses the current day.
 *
 * @param date (optional) - string (ISO string or yyyy-mm-dd)
 */
export const getAnalytics = (date?: string) => {
  const params = date ? `?date=${encodeURIComponent(date)}` : '';
  return apiFetch<Analytics>(`/admin/revenue-stats${params}`);
};

export const updateWithdrawal = (id: string, data: Partial<any>) =>
  apiFetch<any>(`/admin/withdrawals/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const resolveMarket = (id: string, resolutionData: { outcome: string }) =>
  apiFetch<any>(`/markets/resolve`, {
    method: 'POST',
    body: JSON.stringify({
      marketId: id,
      result: resolutionData.outcome,
    }),
  });
  
// --- Agent Types ---
export interface Agent {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  totalReferrals: number;
  totalReferralVolume: string | number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAgentData {
  name: string;
  email: string;
}

export interface AgentsResponse {
  success: boolean;
  agents: Agent[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AgentResponse {
  success: boolean;
  message: string;
  agent: Agent;
}

// --- Referral Tracking Types ---
export interface ReferralTracking {
  id: string;
  userId: string;
  userName: string;
  marketId: string;
  orderAmount: number;
  orderType: 'BUY' | 'SELL';
  createdAt: string;
}

export interface ReferralStats {
  success: boolean;
  agent: {
    name: string;
    email: string;
    referralCode: string;
    memberSince: string;
  };
  stats: {
    totalReferrals: number;
    totalVolume: number;
    last30Days: {
      referrals: number;
      volume: number;
    };
  };
  recentReferrals: ReferralTracking[];
}

export interface ValidateReferralResponse {
  success: boolean;
  valid: boolean;
  agent?: {
    name: string;
    referralCode: string;
  };
}

export interface TrackReferralData {
  referralCode: string;
  marketId: string;
  orderAmount: number;
  orderId?: string;
  orderType?: 'BUY' | 'SELL';
}

export interface TrackReferralResponse {
  success: boolean;
  message: string;
  tracking?: {
    id: string;
    referralCode: string;
    marketId: string;
    orderAmount: number;
    createdAt: string;
  };
}

export interface UserReferralHistoryResponse {
  success: boolean;
  referrals: ReferralTracking[];
}

// --- Agent Endpoints ---

/**
 * Get all agents (admin only)
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 50)
 */
export const getAllAgents = (page = 1, limit = 50) =>
  apiFetch<AgentsResponse>(`/agents/all?page=${page}&limit=${limit}`);

/**
 * Get single agent by referral code or email
 * @param referralCode - Agent's referral code (optional)
 * @param email - Agent's email (optional)
 */
export const getAgent = (referralCode?: string, email?: string) => {
  const params = new URLSearchParams();
  if (referralCode) params.append('referralCode', referralCode);
  if (email) params.append('email', email);
  return apiFetch<{ success: boolean; agent: Agent }>(
    `/agents?${params.toString()}`,
    {},
    false // Public endpoint
  );
};

/**
 * Create a new agent
 * @param data - Agent data (name and email)
 */
export const createAgent = (data: CreateAgentData) =>
  apiFetch<AgentResponse>('/agents/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }, false); // Public endpoint - anyone can register as agent

/**
 * Update agent status (admin only)
 * @param id - Agent ID
 * @param data - Status update data
 */
export const updateAgentStatus = (id: string, data: { isActive: boolean }) =>
  apiFetch<{ success: boolean; message: string; agent: Agent }>(
    `/agents/${id}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  );

// --- Referral Tracking Endpoints ---

/**
 * Get referral statistics for an agent
 * @param referralCode - Agent's referral code
 */
export const getReferralStats = (referralCode: string) =>
  apiFetch<ReferralStats>(
    `/referrals/stats?referralCode=${encodeURIComponent(referralCode)}`,
    {},
    false // Public endpoint
  );

/**
 * Validate a referral code
 * @param referralCode - Referral code to validate
 */
export const validateReferralCode = (referralCode: string) =>
  apiFetch<ValidateReferralResponse>(
    `/referrals/validate?referralCode=${encodeURIComponent(referralCode)}`,
    {},
    false // Public endpoint
  );

/**
 * Track a referral usage (called when placing orders)
 * @param data - Referral tracking data
 */
export const trackReferral = (data: TrackReferralData) =>
  apiFetch<TrackReferralResponse>('/referrals/track', {
    method: 'POST',
    body: JSON.stringify(data),
  });

/**
 * Get user's referral usage history
 */
export const getUserReferralHistory = () =>
  apiFetch<UserReferralHistoryResponse>('/referrals/my-history');