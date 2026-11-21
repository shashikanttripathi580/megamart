import { Capacitor } from '@capacitor/core';

export interface HealthResponse {
  success: boolean;
  message: string;
  data: {
    status: string;
    service: string;
    version: string;
    environment: string;
    uptimeSeconds: number;
    uptimeFormatted: string;
    timestamp: string;
    database: {
      status: string;
      isConnected: boolean;
    };
    system: {
      nodeVersion: string;
      platform: string;
      memory: {
        rssMB: number;
        heapUsedMB: number;
      };
    };
  };
}

export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('megamart_api_url');
    if (custom) return custom;
  }

  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (Capacitor.isNativePlatform()) {
    // In Android emulator, 10.0.2.2 accesses host machine port 5000
    return 'http://10.0.2.2:5000/api/v1';
  }

  return '/api/v1';
};

export const setApiBaseUrl = (url: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('megamart_api_url', url.replace(/\/+$/, ''));
  }
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `API request failed with status ${response.status}`);
  }

  return data as T;
}

export const fetchHealthStatus = (): Promise<HealthResponse> => {
  return apiRequest<HealthResponse>('/health');
};
