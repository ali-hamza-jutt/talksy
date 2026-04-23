import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  open:     boolean;
  onClose:  () => void;
  title?:   string;
  children: ReactNode;
  size?:    'sm' | 'md' | 'lg';
}

const SIZE = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' } as const;

export default function Modal({ open, onClose, title, children, size = 'md' }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${SIZE[size]} bg-light-card dark:bg-dark-card rounded-2xl shadow-2xl p-6 z-10`}>
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-light-text dark:text-dark-text">{title}</h3>
            <button onClick={onClose} className="text-light-muted dark:text-dark-muted hover:text-danger transition-colors">
              <X size={18} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
