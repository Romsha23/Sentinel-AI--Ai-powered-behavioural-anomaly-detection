import axios from 'axios';

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '');

const apiUrl = new URL(API_BASE_URL);
apiUrl.protocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:';
apiUrl.pathname = '/ws/stream';
apiUrl.search = '';
apiUrl.hash = '';

export const WEBSOCKET_URL = apiUrl.toString();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('sentinel_token');
  if (stored) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${stored}`;
  }
}

export const API_ENDPOINTS = {
  dashboard: '/dashboard/',
  alerts: '/alerts/',
  alert: (id: string) => `/alerts/${id}`,
  entities: (id: string) => `/entities/${id}`,
  analytics: '/analytics/',
  generateData: '/generate-data',
  train: '/train',
  upload: '/upload',
  replay: '/replay/',
  reportPdf: '/report/pdf',
  login: '/auth/login',
  register: '/auth/register',
  profile: '/auth/me',
  updateProfile: '/auth/me',
  updatePassword: '/auth/me/password',
};

export interface AlertQueryParams {
  search?: string;
  priority?: string;
  attack_type?: string;
  status?: string;
  sort_by?: string;
  sort_order?: string;
  limit?: number;
  offset?: number;
}

export function buildAlertQuery(params: AlertQueryParams): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== '' && val !== 'ALL') {
      q.set(key, String(val));
    }
  });
  const qs = q.toString();
  return qs ? `?${qs}` : '';
}
