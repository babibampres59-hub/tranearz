
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  onIconClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, id, name, className, icon, onIconClick, ...props }, ref) => {
  const inputId = id || name;
  return (
    <div>
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <div className="relative">
        <input
          id={inputId}
          name={name}
          ref={ref}
          className={`bg-white focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-300 rounded-xl py-2.5 px-3.5 border transition-colors duration-150 ${icon ? 'pr-10' : ''} ${className || ''}`}
          {...props}
        />
        {icon && (
          <button
            type="button"
            aria-label="Toggle password visibility"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700 focus:outline-none focus:text-slate-700"
            onClick={onIconClick}
            tabIndex={-1} 
          >
            {icon}
          </button>
        )}
      </div>
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
