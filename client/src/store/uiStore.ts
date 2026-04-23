import { create } from 'zustand';
import type { ActiveTab } from '@/types';

interface UiState {
  theme: 'light' | 'dark';
  activeTab: ActiveTab;
  toggleTheme: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  theme:     (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  activeTab: 'chats',
  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    set({ theme: next });
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
