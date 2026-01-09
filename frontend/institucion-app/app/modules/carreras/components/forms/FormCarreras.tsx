"use client";

import React, { useEffect, useState } from "react";
import FormContainer, { type FormField } from "@/shared/components/FormContainer";
import type { CreateCarreraDto } from "@/shared/types/carrera";
import type { Modalidad } from "@/shared/types/modalidad";
import { modalidadService } from "@/modules/modalidades/services/modalidad.service";
import { carreraService } from "@/modules/carreras/services/carrera.service";
import { formatApiErrors, isApiError } from "@/shared/core/api";
import Loading from "@/shared/components/ui/loading";
import { useToast } from "@/shared/components/toast";

interface FormCarrerasProps {
  carreraId?: number; // Si se proporciona, es edición
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Formulario para crear/editar carreras
 * Usa el FormContainer compartido y servicios de la API
 */
export default function FormCarreras({ carreraId, onSuccess, onCancel }: FormCarrerasProps) {
  const toast = useToast();
  const [modalidades, setModalidades] = useState<Modalidad[]>([]);
  const [initialData, setInitialData] = useState<Partial<CreateCarreraDto>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(!!carreraId);

  // Cargar modalidades activas al montar el componente
  useEffect(() => {
    loadModalidades();
  }, []);

  // Cargar datos de la carrera si es edición
  useEffect(() => {
    if (carreraId) {
      loadCarrera(carreraId);
    }
  }, [carreraId]);

  const loadModalidades = async () => {
    try {
      const response = await modalidadService.list();
      console.log("Modalidades cargadas:", response); // Debug
      setModalidades(response.data || []);
    } catch (error) {
      console.error("Error al cargar modalidades:", formatApiErrors(error));
      setModalidades([]);
    }
  };

  const loadCarrera = async (id: number) => {
    try {
      setIsLoadingData(true);
      const carrera = await carreraService.get(id);
      setInitialData({
        nombre: carrera.nombre,
        modalidad: carrera.modalidad.id,
      });
    } catch (error) {
      console.error("Error al cargar carrera:", formatApiErrors(error));
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (data: CreateCarreraDto) => {
    setIsLoading(true);
    try {
      if (carreraId) {
        await carreraService.update(carreraId, data);
        toast.success(`Carrera "${data.nombre}" actualizada exitosamente`);
      } else {
        await carreraService.create(data);
        toast.success(`Carrera "${data.nombre}" creada exitosamente`);
      }
      onSuccess?.();
    } catch (error) {
      if (isApiError(error)) {
        toast.error(formatApiErrors(error));
      } else {
        toast.error("Error al guardar la carrera");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Definición de campos del formulario
  const fields: FormField<CreateCarreraDto>[] = [
    {
      name: "nombre",
      label: "Nombre de la Carrera",
      type: "text",
      placeholder: "Ej: Ingeniería de Software",
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
    {
      name: "modalidad",
      label: "Modalidad",
      type: "select",
      required: true,
      options: (modalidades || []).map((m) => ({
        value: m.id,
        label: m.nombre,
      })),
      validation: (value: number) => {
        if (!value) {
          return "Debes seleccionar una modalidad";
        }
        return null;
      },
    },
  ];

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loading size="md" message="Cargando datos de la carrera..." />
      </div>
    );
  }

  return (
    <FormContainer
      fields={fields}
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel={carreraId ? "Actualizar" : "Crear"}
      isLoading={isLoading}
    />
  );
}
