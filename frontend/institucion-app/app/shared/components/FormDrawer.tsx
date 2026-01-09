"use client";

import React, { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Loader2, Save, X } from "lucide-react";

export interface FormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  /** Lado del drawer: "left" | "right" */
  side?: "left" | "right";
  /** Acción al hacer submit (opcional, para manejar botones externamente) */
  onSubmit?: () => void;
  /** Etiqueta del botón submit */
  submitLabel?: string;
  /** Etiqueta del botón cancelar */
  cancelLabel?: string;
  /** Estado de carga */
  isLoading?: boolean;
  /** Mostrar footer con botones (default: false, porque el FormContainer ya tiene sus botones) */
  showFooter?: boolean;
}

/**
 * FormDrawer - Componente para mostrar formularios en un panel lateral (drawer/sheet)
 * 
 * @example
 * ```tsx
 * <FormDrawer
 *   open={showForm}
 *   onOpenChange={setShowForm}
 *   title="Nueva Carrera"
 *   description="Complete los datos para crear una nueva carrera"
 * >
 *   <FormCarreras onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />
 * </FormDrawer>
 * ```
 */
export function FormDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  side = "right",
  onSubmit,
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
  isLoading = false,
  showFooter = false,
}: FormDrawerProps) {
  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side={side} className="flex flex-col">
        {/* Header */}
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">{title}</SheetTitle>
          {description && (
            <SheetDescription className="text-muted-foreground">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>

        {/* Body - Contenido del formulario */}
        <SheetBody>
          {children}
        </SheetBody>

        {/* Footer - Solo si showFooter es true */}
        {showFooter && (
          <SheetFooter className="border-t pt-4">
            <div className="flex w-full gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                {cancelLabel}
              </Button>
              {onSubmit && (
                <Button
                  type="button"
                  onClick={onSubmit}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Guardando..." : submitLabel}
                </Button>
              )}
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default FormDrawer;
