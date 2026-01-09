/**
 * API Core - Punto de entrada principal
 * Exporta todas las funciones y configuraciones de la API
 */

// Configuración
export { apiConfig } from '../config';

// Cliente HTTP
export { request, get, post, put, patch, del } from './client';

// Manejo de errores
export { formatApiErrors, isApiError } from './errors';
