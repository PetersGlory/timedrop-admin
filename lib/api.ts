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


export const getAnalytics = () =>
  apiFetch<Analytics>(`/admin/revenue-stats`);

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