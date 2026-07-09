import React from 'react';

export const Dropdown = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={name}>
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        className={`form-input ${error ? 'border-danger' : ''}`}
        required={required}
        {...props}
      >
        <option value="">Select option</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default Dropdown;
