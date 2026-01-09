"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

// Props del componente DeleteConfirm
export interface DeleteConfirmProps {
  // Control del diálogo
  open: boolean;
  onOpenChange: (open: boolean) => void;
  
  // Callback de confirmación
  onConfirm: () => void | Promise<void>;
  
  // Textos personalizables
  title?: string;
  description?: string;
  itemName?: string; // Nombre del elemento a eliminar
  
  // Botones personalizables
  confirmLabel?: string;
  cancelLabel?: string;
  
  // Configuración
  requireConfirmation?: boolean; // Requiere escribir "ELIMINAR" para confirmar
  confirmationText?: string; // Texto que debe escribir el usuario
  
  // Estados
  isDeleting?: boolean;
  
  // Variante visual
  variant?: "default" | "danger";
  
  // Icono personalizado
  icon?: React.ReactNode;
}

/**
 * DeleteConfirm - Componente genérico para confirmar eliminaciones
 * 
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 * 
 * <DeleteConfirm
 *   open={open}
 *   onOpenChange={setOpen}
 *   onConfirm={handleDelete}
 *   itemName="Usuario: Juan Pérez"
 *   title="¿Eliminar usuario?"
 * />
 * ```
 */
export function DeleteConfirm({
  open,
  onOpenChange,
  onConfirm,
  title = "¿Estás seguro?",
  description,
  itemName,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  requireConfirmation = false,
  confirmationText = "ELIMINAR",
  isDeleting = false,
  variant = "danger",
  icon,
}: DeleteConfirmProps) {
  const [confirmInput, setConfirmInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Resetear el estado cuando se cierra el diálogo
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setConfirmInput("");
      setIsProcessing(false);
    }
    onOpenChange(newOpen);
  };

  // Manejo de la confirmación
  const handleConfirm = async () => {
    if (requireConfirmation && confirmInput !== confirmationText) {
      return;
    }

    setIsProcessing(true);
    try {
      await onConfirm();
      handleOpenChange(false);
    } catch (error) {
      console.error("Error al eliminar:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Verificar si el botón de confirmar debe estar habilitado
  const isConfirmDisabled = () => {
    if (isDeleting || isProcessing) return true;
    if (requireConfirmation && confirmInput !== confirmationText) return true;
    return false;
  };

  // Descripción por defecto
  const defaultDescription = itemName
    ? `Esta acción no se puede deshacer. Esto eliminará permanentemente ${itemName}.`
    : "Esta acción no se puede deshacer. Esto eliminará permanentemente este elemento.";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {icon ? (
              icon
            ) : variant === "danger" ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <svg
                  className="h-6 w-6 text-destructive"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            ) : null}
            <div className="flex-1">
              <DialogTitle>{title}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <DialogDescription className="text-base">
            {description || defaultDescription}
          </DialogDescription>

          {requireConfirmation && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Para confirmar, escribe{" "}
                <span className="font-semibold text-foreground">
                  {confirmationText}
                </span>
              </p>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder={confirmationText}
                className="border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                autoComplete="off"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isDeleting || isProcessing}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isConfirmDisabled()}
          >
            {isDeleting || isProcessing ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Eliminando...
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Hook personalizado para usar DeleteConfirm fácilmente
export function useDeleteConfirm() {
  const [open, setOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const confirm = (item?: any) => {
    setItemToDelete(item);
    setOpen(true);
  };

  const cancel = () => {
    setOpen(false);
    setItemToDelete(null);
  };

  return {
    open,
    setOpen,
    itemToDelete,
    confirm,
    cancel,
  };
}

export default DeleteConfirm;
