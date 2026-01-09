/**
 * Configuración de Axios
 */

import axios, { type AxiosInstance } from 'axios';
import { setupInterceptors } from './api/interceptors';

/**
 * Clase de configuración de la API
 */
class ApiConfig {
  private axiosInstance: AxiosInstance;

  constructor() {
    // Validar que la URL base esté configurada
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    if (!baseURL) {
      throw new Error(
        'NEXT_PUBLIC_API_BASE_URL no está configurada. ' +
        'Por favor, define esta variable en tu archivo .env.local'
      );
    }

    // Crear instancia de axios con configuración base
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 30000, // 30 segundos
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Configurar interceptores
    setupInterceptors(this.axiosInstance);
  }

  /**
   * Obtener instancia de axios
   */
  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * Obtener URL base
   */
  getBaseURL(): string {
    return this.axiosInstance.defaults.baseURL || '';
  }
}

// Exportar instancia única (singleton)
export const apiConfig = new ApiConfig();
