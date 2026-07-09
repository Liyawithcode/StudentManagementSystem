import React from 'react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {
  const getBtnClass = () => {
    switch (variant) {
      case 'primary': return 'btn btn-primary';
      case 'secondary': return 'btn btn-secondary';
      case 'danger': return 'btn btn-danger';
      default: return 'btn';
    }
  };

  return (
    <button
      type={type}
      className={`${getBtnClass()} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="spinner-mini"></span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
