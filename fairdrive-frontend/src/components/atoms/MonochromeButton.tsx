import React from 'react';

interface MonochromeButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const MonochromeButton: React.FC<MonochromeButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  icon,
  iconPosition = 'left',
}) => {
  const baseClasses = 'btn';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  };
  
  const sizeClasses = {
    sm: 'text-sm px-4 py-2 min-h-[40px]',
    md: 'text-base px-6 py-3 min-h-[44px]',
    lg: 'text-lg px-8 py-4 min-h-[48px]',
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'cursor-wait',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      aria-disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>読み込み中...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          {icon && iconPosition === 'left' && <span className="w-5 h-5">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="w-5 h-5">{icon}</span>}
        </div>
      )}
    </button>
  );
};