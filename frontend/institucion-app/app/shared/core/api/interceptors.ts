/**
 * Interceptores de Axios
 */

import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { handleApiError } from './errors';

/**
 * Configurar interceptores de request
 */
function setupRequestInterceptor(instance: AxiosInstance): void {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Logging en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

/**
 * Configurar interceptores de response
 */
function setupResponseInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      return Promise.reject(handleApiError(error));
    }
  );
}

/**
 * Configurar todos los interceptores
 */
export function setupInterceptors(instance: AxiosInstance): void {
  setupRequestInterceptor(instance);
  setupResponseInterceptor(instance);
}
