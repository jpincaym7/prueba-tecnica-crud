/**
 * Servicio para gestionar Modalidades
 * Ejemplo de implementación usando api-core
 */

import { get, post, put, patch, del } from '@/shared/core/api';
import type { DatatableResponse, PaginationParams } from '@/shared/types/api';
import type { Modalidad, CreateModalidadDto, UpdateModalidadDto } from '@/shared/types/modalidad';

/**
 * Servicio de Modalidades
 */
export const modalidadService = {
  /**
   * Listar modalidades con paginación
   * GET /api/academico/modalidades
   */
  async list(params?: PaginationParams): Promise<DatatableResponse<Modalidad>> {
    return get<DatatableResponse<Modalidad>>('/modalidades', params);
  },

  /**
   * Listar modalidades inactivas
   * GET /api/academico/modalidades/inactivas
   */
  async listInactivas(params?: PaginationParams): Promise<DatatableResponse<Modalidad>> {
    return get<DatatableResponse<Modalidad>>('/modalidades/inactivas', params);
  },

  /**
   * Obtener una modalidad por ID
   * GET /api/academico/modalidades/{id}
   */
  async get(id: number): Promise<Modalidad> {
    return get<Modalidad>(`/modalidades/${id}`);
  },

  /**
   * Crear nueva modalidad
   * POST /api/academico/modalidades
   */
  async create(data: CreateModalidadDto): Promise<Modalidad> {
    return post<Modalidad>('/modalidades', data);
  },

  /**
   * Actualizar modalidad existente
   * PUT /api/academico/modalidades/{id}
   */
  async update(id: number, data: UpdateModalidadDto): Promise<Modalidad> {
    return put<Modalidad>(`/modalidades/${id}`, data);
  },

  /**
   * Eliminar modalidad (soft delete)
   * DELETE /api/academico/modalidades/{id}
   */
  async delete(id: number): Promise<void> {
    return del<void>(`/modalidades/${id}`);
  },

  /**
   * Restaurar modalidad eliminada
   * PATCH /api/academico/modalidades/{id}/restore
   */
  async restore(id: number): Promise<Modalidad> {
    return patch<Modalidad>(`/modalidades/${id}/restore`);
  },

  /**
   * Eliminar permanentemente modalidad
   * DELETE /api/academico/modalidades/{id}/hard_delete
   */
  async hardDelete(id: number): Promise<void> {
    return del<void>(`/modalidades/${id}/hard_delete`);
  },

  /**
   * Obtener solo modalidades activas
   * GET /api/academico/modalidades/activas
   */
  async getActivas(): Promise<Modalidad[]> {
    const response = await get<DatatableResponse<Modalidad>>('/modalidades/activas');
    return response.data;
  },
};
