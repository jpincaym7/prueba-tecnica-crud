/**
 * Cliente HTTP - Funciones principales para peticiones
 */

import type { AxiosRequestConfig } from 'axios';
import { apiConfig } from '../config';

/**
 * Función principal para realizar peticiones HTTP
 * 
 * @param endpoint - Ruta del endpoint (ej: '/modalidades' o '/modalidades/1')
 * @param config - Configuración de la petición axios
 * @returns Promise con los datos de la respuesta
 */
export async function request<T>(
  endpoint: string,
  config: AxiosRequestConfig = {}
): Promise<T> {
  const response = await apiConfig.getInstance().request<T>({
    url: endpoint,
    ...config,
  });

  return response.data;
}

/**
 * Función GET - Obtener datos
 */
export async function get<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  return request<T>(endpoint, { method: 'GET', params });
}

/**
 * Función POST - Crear recurso
 */
export async function post<T>(
  endpoint: string,
  data?: unknown,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  return request<T>(endpoint, {
    method: 'POST',
    data,
    params,
  });
}

/**
 * Función PUT - Actualizar recurso completo
 */
export async function put<T>(
  endpoint: string,
  data: unknown,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  return request<T>(endpoint, {
    method: 'PUT',
    data,
    params,
  });
}

/**
 * Función PATCH - Actualizar recurso parcial
 */
export async function patch<T>(
  endpoint: string,
  data?: unknown,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  return request<T>(endpoint, {
    method: 'PATCH',
    data,
    params,
  });
}

/**
 * Función DELETE - Eliminar recurso
 */
export async function del<T = void>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  return request<T>(endpoint, { method: 'DELETE', params });
}
