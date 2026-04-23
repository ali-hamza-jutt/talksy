import { type ReactNode } from 'react';
import Logo from '@/components/common/Logo';

interface Props { children: ReactNode; title: string; subtitle: string; }

export default function AuthLayout({ children, title, subtitle }: Props) {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center p-4">
      <div className="auth-card">
        <div className="text-center mb-6">
          <Logo height={70} />
          <h2 className="text-xl font-bold text-light-text dark:text-dark-text mt-4">{title}</h2>
          <p className="text-sm text-light-muted dark:text-dark-muted mt-1">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
