import React from 'react';

interface MonochromeCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
}

export const MonochromeCard: React.FC<MonochromeCardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  hover = false,
  onClick,
  role,
  tabIndex,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };
  
  const baseClasses = 'card';
  const interactiveClasses = hover || onClick ? 'cursor-pointer transition-all duration-150 hover:shadow-md hover:-translate-y-0.5' : '';
  
  const classes = [
    baseClasses,
    paddingClasses[padding],
    shadowClasses[shadow],
    interactiveClasses,
    className,
  ].filter(Boolean).join(' ');

  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      className={classes}
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      {...(onClick && { 'aria-pressed': 'false' })}
    >
      {children}
    </Component>
  );
};