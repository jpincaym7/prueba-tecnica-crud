import React from 'react';

interface LoadingProps {
  /**
   * Tamaño del spinner
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Mensaje opcional a mostrar debajo del spinner
   */
  message?: string;
  /**
   * Si es true, ocupa toda la pantalla con overlay
   * @default false
   */
  fullScreen?: boolean;
  /**
   * Color del spinner
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'white';
  /**
   * Clase CSS adicional
   */
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  message,
  fullScreen = false,
  variant = 'primary',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-4',
  };

  const variantClasses = {
    primary: 'border-blue-600 border-t-transparent',
    secondary: 'border-gray-600 border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  const spinner = (
    <div
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-full
        animate-spin
      `}
      role="status"
      aria-label="Cargando"
    />
  );

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {spinner}
      {message && (
        <p className={`text-sm font-medium ${variant === 'white' ? 'text-white' : 'text-gray-700'}`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 shadow-xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default Loading;

/**
 * Componente de loading para usar inline en cualquier parte
 */
export const LoadingInline: React.FC<Omit<LoadingProps, 'fullScreen'>> = (props) => {
  return <Loading {...props} fullScreen={false} />;
};

/**
 * Componente de loading de pantalla completa
 */
export const LoadingOverlay: React.FC<Omit<LoadingProps, 'fullScreen'>> = (props) => {
  return <Loading {...props} fullScreen={true} />;
};

/**
 * Componente simple de spinner sin contenedor
 */
export const Spinner: React.FC<Pick<LoadingProps, 'size' | 'variant' | 'className'>> = ({
  size = 'md',
  variant = 'primary',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-3',
  };

  const variantClasses = {
    primary: 'border-blue-600 border-t-transparent',
    secondary: 'border-gray-600 border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-full
        animate-spin
        ${className}
      `}
      role="status"
      aria-label="Cargando"
    />
  );
};
