"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
  errors?: Record<string, string[]>; // Para errores estructurados de Django
}

interface ToastContextValue {
  success: (message: string, duration?: number) => number;
  error: (message: string | Record<string, string[]>, duration?: number) => number;
  warning: (message: string, duration?: number) => number;
  info: (message: string, duration?: number) => number;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Hook para usar toasts desde cualquier componente
 */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe usarse dentro de ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Provider de toasts - Debe envolver la aplicación
 */
export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info", duration: number = 3000, errors?: Record<string, string[]>): number => {
    const id = Date.now() + Math.random();
    const newToast: Toast = { id, message, type, duration, errors };
    
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    return addToast(message, "success", duration);
  }, [addToast]);

  const error = useCallback((message: string | Record<string, string[]>, duration: number = 5000) => {
    // Si el mensaje es un objeto de errores de Django
    if (typeof message === 'object') {
      const errorMessages: string[] = [];
      
      for (const [field, errors] of Object.entries(message)) {
        if (field === '__all__' || field === 'non_field_errors') {
          errorMessages.push(...errors);
        } else {
          errors.forEach(error => {
            errorMessages.push(`${field}: ${error}`);
          });
        }
      }
      
      const mainMessage = errorMessages.length > 0 
        ? errorMessages[0] 
        : "Error en el formulario";
      
      return addToast(mainMessage, "error", duration, message);
    }
    
    // Si es un string simple
    return addToast(message, "error", duration);
  }, [addToast]);

  const warning = useCallback((message: string, duration?: number) => {
    return addToast(message, "warning", duration);
  }, [addToast]);

  const info = useCallback((message: string, duration?: number) => {
    return addToast(message, "info", duration);
  }, [addToast]);

  const value: ToastContextValue = {
    success,
    error,
    warning,
    info,
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: number) => void;
}

/**
 * Contenedor de toasts
 */
const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onClose={() => onRemove(toast.id)} />
      ))}
    </div>
  );
};

interface ToastComponentProps {
  toast: Toast;
  onClose: () => void;
}

/**
 * Componente individual de Toast
 */
const ToastComponent = ({ toast, onClose }: ToastComponentProps) => {
  const { message, type, errors } = toast;

  const config: Record<ToastType, { icon: React.ElementType; className: string; iconClassName: string }> = {
    success: {
      icon: CheckCircle,
      className: "bg-green-50 text-green-800 border-green-200",
      iconClassName: "text-green-500",
    },
    error: {
      icon: AlertCircle,
      className: "bg-red-50 text-red-800 border-red-200",
      iconClassName: "text-red-500",
    },
    warning: {
      icon: AlertTriangle,
      className: "bg-yellow-50 text-yellow-800 border-yellow-200",
      iconClassName: "text-yellow-500",
    },
    info: {
      icon: Info,
      className: "bg-blue-50 text-blue-800 border-blue-200",
      iconClassName: "text-blue-500",
    },
  };

  const { icon: Icon, className, iconClassName } = config[type] || config.info;

  const renderErrors = () => {
    if (!errors) return null;

    const errorItems: JSX.Element[] = [];
    
    for (const [field, errorList] of Object.entries(errors)) {
      if (field === '__all__' || field === 'non_field_errors') {
        errorList.forEach((error, index) => {
          errorItems.push(
            <li key={`${field}-${index}`} className="text-xs">
              {error}
            </li>
          );
        });
      } else {
        errorList.forEach((error, index) => {
          errorItems.push(
            <li key={`${field}-${index}`} className="text-xs">
              <span className="font-semibold">{field}:</span> {error}
            </li>
          );
        });
      }
    }

    if (errorItems.length <= 1) return null;

    return (
      <ul className="mt-2 pl-4 space-y-1 border-t pt-2 border-red-300">
        {errorItems.slice(1)}
      </ul>
    );
  };

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg pointer-events-auto min-w-[300px] max-w-md transition-all duration-300 ease-in-out ${className}`}
      style={{ animation: 'slideInFromRight 0.3s ease-out' }}
      role="alert"
    >
      <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${iconClassName}`} />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
        {renderErrors()}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Cerrar notificación"
      >
        <X className="h-4 w-4" />
      </button>
      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ToastProvider;
