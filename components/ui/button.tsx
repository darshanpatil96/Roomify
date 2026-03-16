import React, { type ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | string;
  size?: 'sm' | 'md' | 'lg' | string;
  fullWidth?: boolean;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...rest
}: ButtonProps) => {
  const baseClass = 'btn';
  
  const classes = [
    baseClass,
    variant && `${baseClass}--${variant}`,
    size && `${baseClass}--${size}`,
    fullWidth && `${baseClass}--full-width`,
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
};

export default Button;
