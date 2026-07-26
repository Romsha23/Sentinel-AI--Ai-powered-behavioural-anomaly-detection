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

export const API_ENDPOINTS = {
  dashboard: '/dashboard/',
  alerts: '/alerts/',
  entities: (id: string) => `/entities/${id}`,
  analytics: '/analytics/',
  generateData: '/generate-data',
  train: '/train',
  upload: '/upload',
  replay: '/replay/',
  reportPdf: '/report/pdf',
  login: '/auth/login',
};
