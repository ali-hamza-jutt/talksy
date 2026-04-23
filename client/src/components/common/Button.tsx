import { type ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?:    'sm' | 'md';
  loading?: boolean;
}

const BASE    = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed';
const VARIANT = {
  primary: 'bg-primary hover:bg-primary-hover text-white',
  ghost:   'bg-transparent hover:bg-light-border dark:hover:bg-dark-border text-light-text dark:text-dark-text',
  danger:  'bg-danger/10 hover:bg-danger/20 text-danger',
} as const;
const SIZE    = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm' } as const;

export default function Button({ variant = 'primary', size = 'md', loading, children, className = '', ...rest }: Props) {
  return (
    <button className={`${BASE} ${VARIANT[variant]} ${SIZE[size]} ${className}`} disabled={loading || rest.disabled} {...rest}>
      {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  );
}
