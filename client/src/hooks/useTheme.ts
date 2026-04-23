import { useEffect } from 'react';
import { useUiStore } from '@/store/uiStore';

export function useTheme() {
  const { theme } = useUiStore();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
}
