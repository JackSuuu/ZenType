import React from 'react'
import clsx from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'active' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'zen-btn',
        variant === 'active' && 'active',
        variant === 'ghost' && 'zen-btn-ghost',
        size === 'sm' && 'text-xs px-3 py-1.5',
        size === 'lg' && 'text-base px-6 py-3',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
