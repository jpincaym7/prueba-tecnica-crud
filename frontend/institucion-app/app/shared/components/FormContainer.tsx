"use client";

import React, { useState, FormEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

// Tipos de campos soportados
export type FieldType = "text" | "email" | "password" | "number" | "date" | "tel" | "url" | "textarea" | "select";

// Definición de un campo del formulario
export interface FormField<T = any> {
  name: keyof T;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  min?: number | string;
  max?: number | string;
  pattern?: string;
  options?: Array<{ value: string | number; label: string }>; // Para campos select
  validation?: (value: any) => string | null; // Validación personalizada
  rows?: number; // Para textarea
}

// Props del FormContainer
export interface FormContainerProps<T = any> {
  title?: string;
  description?: string;
  fields: FormField<T>[];
  initialData?: Partial<T>;
  onSubmit: (data: T) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  className?: string;
  showCard?: boolean;
}

/**
 * FormContainer - Componente genérico reutilizable para formularios
 * 
 * @example
 * ```tsx
 * const fields: FormField<User>[] = [
 *   { name: 'name', label: 'Nombre', type: 'text', required: true },
 *   { name: 'email', label: 'Email', type: 'email', required: true },
 * ];
 * 
 * <FormContainer
 *   title="Crear Usuario"
 *   fields={fields}
 *   onSubmit={handleSubmit}
 * />
 * ```
 */
export function FormContainer<T extends Record<string, any>>({
  title,
  description,
  fields,
  initialData = {} as Partial<T>,
  onSubmit,
  onCancel,
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
  isLoading = false,
  className = "",
  showCard = true,
}: FormContainerProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  // Manejo de cambios en los campos
  const handleChange = (name: keyof T, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Manejo de blur (cuando el usuario sale del campo)
  const handleBlur = (name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name);
  };

  // Validar un campo específico
  const validateField = (name: keyof T): boolean => {
    const field = fields.find((f) => f.name === name);
    if (!field) return true;

    const value = formData[name];

    // Validación de campo requerido
    if (field.required && (!value || value === "")) {
      setErrors((prev) => ({ ...prev, [name]: `${field.label} es requerido` }));
      return false;
    }

    // Validación personalizada
    if (field.validation && value) {
      const error = field.validation(value);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
        return false;
      }
    }

    return true;
  };

  // Validar todos los campos
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Partial<Record<keyof T, string>> = {};

    fields.forEach((field) => {
      const value = formData[field.name];

      // Validación de campo requerido
      if (field.required && (!value || value === "")) {
        newErrors[field.name] = `${field.label} es requerido`;
        isValid = false;
      }

      // Validación personalizada
      if (field.validation && value) {
        const error = field.validation(value);
        if (error) {
          newErrors[field.name] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    const allTouched = fields.reduce((acc, field) => {
      acc[field.name] = true;
      return acc;
    }, {} as Record<keyof T, boolean>);
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData as T);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  // Renderizar un campo según su tipo
  const renderField = (field: FormField<T>) => {
    const value = formData[field.name] ?? "";
    const error = touched[field.name] ? errors[field.name] : undefined;

    const commonProps = {
      id: String(field.name),
      name: String(field.name),
      value: value as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        handleChange(field.name, e.target.value),
      onBlur: () => handleBlur(field.name),
      placeholder: field.placeholder,
      required: field.required,
      disabled: field.disabled || isLoading,
      min: field.min,
      max: field.max,
      pattern: field.pattern,
      "aria-invalid": !!error,
    };

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            {...commonProps}
            rows={field.rows || 4}
            className="border-input h-auto w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
          />
        );

      case "select":
        return (
          <select
            {...commonProps}
            className="border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
          >
            <option value="">Seleccione una opción</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return <Input {...commonProps} type={field.type} />;
    }
  };

  // Contenido del formulario
  const formContent = (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={String(field.name)} className="space-y-2">
            <Label htmlFor={String(field.name)}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {renderField(field)}
            {touched[field.name] && errors[field.name] && (
              <p className="text-destructive text-sm">{errors[field.name]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Guardando..." : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
        )}
      </div>
    </form>
  );

  // Si showCard es false, retornar solo el formulario
  if (!showCard) {
    return formContent;
  }

  // Envolver en Card si showCard es true
  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}

export default FormContainer;
