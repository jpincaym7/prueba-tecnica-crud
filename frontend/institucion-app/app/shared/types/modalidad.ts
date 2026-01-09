/**
 * Tipos específicos del módulo Modalidad
 */

import type { BaseModel } from './api';

export interface Modalidad extends BaseModel {
  nombre: string;
}

export interface CreateModalidadDto {
  nombre: string;
}

export interface UpdateModalidadDto {
  nombre: string;
}
