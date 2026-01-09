/**
 * Manejo de errores de la API
 */

import type { AxiosError } from 'axios';
import type { ApiError, ApiDetailError } from '@/shared/types/api';

/**
 * Maneja errores de axios y los convierte al formato esperado
 */
export function handleApiError(error: AxiosError): Error | ApiError {
  // Error de timeout
  if (error.code === 'ECONNABORTED') {
    return new Error('La petición ha excedido el tiempo de espera');
  }

  // Error de red
  if (!error.response) {
    return new Error('Error de conexión. Verifica tu conexión a internet.');
  }

  const { status, data } = error.response;

  // Error 404 - Not Found
  if (status === 404) {
    const errorData = data as ApiDetailError;
    return new Error(errorData.detail || 'Recurso no encontrado');
  }

  // Error 400 - Validación
  if (status === 400) {
    const errorData = data as ApiError;
    if (errorData.errors) {
      return errorData;
    }
    return new Error('Error de validación');
  }

  // Error 401 - No autorizado
  if (status === 401) {
    return new Error('No autorizado. Por favor, inicia sesión.');
  }

  // Error 403 - Prohibido
  if (status === 403) {
    return new Error('No tienes permisos para realizar esta acción.');
  }

  // Error 405 - Método no permitido
  if (status === 405) {
    return new Error('Método HTTP no permitido');
  }

  // Error 500 - Error del servidor
  if (status >= 500) {
    return new Error('Error del servidor. Por favor, intenta más tarde.');
  }

  // Error genérico
  return new Error(`Error HTTP ${status}`);
}

/**
 * Formatea errores de la API para mostrar al usuario
 * 
 * @param error - Error de la API
 * @returns String con los errores formateados
 */
export function formatApiErrors(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'errors' in error) {
    const apiError = error as ApiError;
    return Object.entries(apiError.errors)
      .flatMap(([field, messages]) =>
        field === '__all__'
          ? messages
          : messages.map((msg) => `${field}: ${msg}`)
      )
      .join('\n');
  }

  return 'Error desconocido';
}

/**
 * Type guard para verificar si un error es un ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'errors' in error &&
    typeof (error as ApiError).errors === 'object'
  );
}
