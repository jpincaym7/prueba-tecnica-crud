/**
 * Servicio para gestionar Carreras
 */

import { get, post, put, patch, del } from '@/shared/core/api';
import type { DatatableResponse, PaginationParams } from '@/shared/types/api';
import type { Carrera, CarreraDetalle, CreateCarreraDto, UpdateCarreraDto } from '@/shared/types/carrera';

/**
 * Parámetros específicos para listar carreras
 */
interface ListCarrerasParams extends PaginationParams {
  modalidad?: number; // Filtrar por modalidad
}

/**
 * Servicio de Carreras
 */
export const carreraService = {
  /**
   * Listar carreras con paginación
   * GET /api/academico/carreras
   */
  async list(params?: ListCarrerasParams): Promise<DatatableResponse<Carrera>> {
    return get<DatatableResponse<Carrera>>('/carreras', params);
  },

  /**
   * Listar carreras inactivas
   * GET /api/academico/carreras/inactivas
   */
  async listInactivas(params?: ListCarrerasParams): Promise<DatatableResponse<Carrera>> {
    return get<DatatableResponse<Carrera>>('/carreras/inactivas', params);
  },

  /**
   * Obtener una carrera por ID
   * GET /api/academico/carreras/{id}
   */
  async get(id: number): Promise<CarreraDetalle> {
    return get<CarreraDetalle>(`/carreras/${id}`);
  },

  /**
   * Crear nueva carrera
   * POST /api/academico/carreras
   */
  async create(data: CreateCarreraDto): Promise<CarreraDetalle> {
    return post<CarreraDetalle>('/carreras', data);
  },

  /**
   * Actualizar carrera existente
   * PUT /api/academico/carreras/{id}
   */
  async update(id: number, data: UpdateCarreraDto): Promise<CarreraDetalle> {
    return put<CarreraDetalle>(`/carreras/${id}`, data);
  },

  /**
   * Eliminar carrera (soft delete)
   * DELETE /api/academico/carreras/{id}
   */
  async delete(id: number): Promise<void> {
    return del<void>(`/carreras/${id}`);
  },

  /**
   * Restaurar carrera eliminada
   * PATCH /api/academico/carreras/{id}/restore
   */
  async restore(id: number): Promise<CarreraDetalle> {
    return patch<CarreraDetalle>(`/carreras/${id}/restore`);
  },

  /**
   * Eliminar permanentemente carrera
   * DELETE /api/academico/carreras/{id}/hard_delete
   */
  async hardDelete(id: number): Promise<void> {
    return del<void>(`/carreras/${id}/hard_delete`);
  },

  /**
   * Carreras por modalidad
   * GET /api/academico/carreras/por_modalidad?modalidad_id={id}
   */
  async getByModalidad(modalidadId: number): Promise<Carrera[]> {
    const response = await get<DatatableResponse<Carrera>>('/carreras/por_modalidad', {
      modalidad_id: modalidadId,
    });
    return response.data;
  },
};
