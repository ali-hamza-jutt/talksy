import { forwardRef, type InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?:   string;
  error?:   string;
  icon?:    React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, Props>(({ label, error, icon, className = '', ...rest }, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-1">{label}</label>}
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light-muted dark:text-dark-muted">{icon}</span>}
      <input
        ref={ref}
        className={`input-field ${icon ? 'pl-10' : ''} ${error ? 'border-danger focus:ring-danger' : ''} ${className}`}
        {...rest}
      />
    </div>
    {error && <p className="mt-1 text-xs text-danger">{error}</p>}
  </div>
));

Input.displayName = 'Input';
export default Input;
