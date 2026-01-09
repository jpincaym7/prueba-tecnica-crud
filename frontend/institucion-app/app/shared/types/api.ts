/**
 * Tipos base para la API
 */

// Modelo base heredado por todas las entidades
export interface BaseModel {
  id: number;
  created_at: string;
  updated_at: string; 
  estado: boolean; 
}

// Respuesta de endpoints con paginación (Datatable)
export interface DatatableResponse<T> {
  data: T[];
  count: number; 
  total: number; 
}

// Estructura de errores de la API
export interface ApiError {
  errors: Record<string, string[]>;
}

// Errores de detalle (404, etc.)
export interface ApiDetailError {
  detail: string;
}

// Parámetros de paginación estándar
export interface PaginationParams {
  limit?: number;
  offset?: number;
  search?: string;
  fields?: string;
  [key: string]: string | number | boolean | undefined;
}

// Configuración de peticiones
export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

// Respuesta genérica de la API
export type ApiResponse<T> = T | DatatableResponse<T>;
