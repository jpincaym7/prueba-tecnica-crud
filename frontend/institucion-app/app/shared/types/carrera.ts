/**
 * Tipos específicos del módulo Carrera
 */

import type { BaseModel } from './api';
import type { Modalidad } from './modalidad';

export interface Carrera extends BaseModel {
  nombre: string;
  modalidad: number; // ID de la modalidad
  modalidad_nombre?: string; // Campo adicional en respuesta de lista
}

export interface CarreraDetalle extends Omit<Carrera, 'modalidad'> {
  modalidad: Modalidad; // Objeto completo de modalidad
}

export interface CreateCarreraDto {
  nombre: string;
  modalidad: number;
}

export interface UpdateCarreraDto {
  nombre: string;
  modalidad: number;
}
