"use client";

import React, { useEffect, useState } from "react";
import FormContainer, { type FormField } from "@/shared/components/FormContainer";
import type { CreateModalidadDto, UpdateModalidadDto, Modalidad } from "@/shared/types/modalidad";
import { modalidadService } from "@/modules/modalidades/services/modalidad.service";
import { formatApiErrors, isApiError } from "@/shared/core/api";
import Loading from "@/shared/components/ui/loading";
import { useToast } from "@/shared/components/toast";

interface FormModalidadesProps {
  modalidadId?: number; // Si se proporciona, es edición
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Formulario para crear/editar modalidades
 * Usa el FormContainer compartido y servicios de la API
 */
export default function FormModalidades({ modalidadId, onSuccess, onCancel }: FormModalidadesProps) {
  const toast = useToast();
  const [initialData, setInitialData] = useState<Partial<CreateModalidadDto>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(!!modalidadId);

  // Cargar datos de la modalidad si es edición
  useEffect(() => {
    if (modalidadId) {
      loadModalidad(modalidadId);
    }
  }, [modalidadId]);

  const loadModalidad = async (id: number) => {
    try {
      setIsLoadingData(true);
      const modalidad = await modalidadService.get(id);
      setInitialData({
        nombre: modalidad.nombre,
      });
    } catch (error) {
      console.error("Error al cargar modalidad:", formatApiErrors(error));
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (data: CreateModalidadDto) => {
    setIsLoading(true);
    try {
      if (modalidadId) {
        await modalidadService.update(modalidadId, data);
        toast.success(`Modalidad "${data.nombre}" actualizada exitosamente`);
      } else {
        await modalidadService.create(data);
        toast.success(`Modalidad "${data.nombre}" creada exitosamente`);
      }
      onSuccess?.();
    } catch (error) {
      if (isApiError(error)) {
        toast.error(formatApiErrors(error));
      } else {
        toast.error("Error al guardar la modalidad");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Definición de campos del formulario
  const fields: FormField<CreateModalidadDto>[] = [
    {
      name: "nombre",
      label: "Nombre de la Modalidad",
      type: "text",
      placeholder: "Ej: Presencial, Virtual, Semipresencial",
      required: true,
      validation: (value: string) => {
        if (!value || value.trim().length === 0) {
          return "El nombre no puede estar vacío";
        }
        if (value.trim().length < 3) {
          return "El nombre debe tener al menos 3 caracteres";
        }
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
        if (!regex.test(value)) {
          return "El nombre solo puede contener letras y espacios";
        }
        return null;
      },
    },
  ];

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loading size="md" message="Cargando datos de la modalidad..." />
      </div>
    );
  }

  return (
    <FormContainer
      fields={fields}
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel={modalidadId ? "Actualizar" : "Crear"}
      isLoading={isLoading}
    />
  );
}
