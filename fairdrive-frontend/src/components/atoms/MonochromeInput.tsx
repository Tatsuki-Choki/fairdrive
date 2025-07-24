import React from 'react';

interface MonochromeInputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  icon?: React.ReactNode;
  helperText?: string;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const MonochromeInput: React.FC<MonochromeInputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  icon,
  helperText,
  onKeyPress,
}) => {
  const inputId = React.useId();
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-gray-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 w-5 h-5">{icon}</span>
          </div>
        )}
        
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onKeyPress={onKeyPress}
          className={`
            input
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-gray-500 focus:border-gray-600' : ''}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        />
      </div>
      
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-gray-600" role="alert">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};