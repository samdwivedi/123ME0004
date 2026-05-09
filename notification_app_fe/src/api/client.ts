/**
 * API Client - Axios Instance
 * 
 * Configures a pre-configured Axios instance with:
 * - Base URL from environment variables
 * - Bearer token authentication
 * - Request/response interceptors for logging
 * - Timeout configuration
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Log } from '../lib/logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN || '';

/**
 * Creates and configures the API client instance.
 * All requests include the Bearer token for authentication.
 */
function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`
    }
  });

  // Request interceptor - log outgoing requests
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      Log('frontend', 'info', 'api',
        `API Request: ${config.method?.toUpperCase()} ${config.url} | Params: ${JSON.stringify(config.params || {})}`
      );
      return config;
    },
    (error: AxiosError) => {
      Log('frontend', 'error', 'api', `Request setup failed: ${error.message}`);
      return Promise.reject(error);
    }
  );

  // Response interceptor - log responses
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      Log('frontend', 'info', 'api',
        `API Response: ${response.status} ${response.config.url}`
      );
      return response;
    },
    (error: AxiosError) => {
      const status = error.response?.status || 'N/A';
      const url = error.config?.url || 'unknown';
      Log('frontend', 'error', 'api',
        `API Error: ${status} ${url} - ${error.message}`
      );
      return Promise.reject(error);
    }
  );

  return client;
}

/** Singleton API client instance */
export const apiClient = createApiClient();
