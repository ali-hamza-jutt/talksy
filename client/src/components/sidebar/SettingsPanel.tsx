import { Moon, Sun, Bell, BellOff, LogOut } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { getSocket, disconnectSocket } from '@/services/socket';
import { SOCKET_EVENTS as SE } from '@/constants/socket';
import http from '@/services/api';
import { API } from '@/constants/api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useState } from 'react';

export default function SettingsPanel() {
  const { theme, toggleTheme } = useUiStore();
  const { user, setUser, clearUser } = useAuthStore();
  const navigate = useNavigate();
  const [notif, setNotif] = useState(user?.notification ?? true);
  const [muted, setMuted] = useState(user?.is_muted ?? false);

  const logout = async () => {
    try {
      await http.get(API.LOGOUT);
    } catch {}
    disconnectSocket();
    clearUser();
    navigate(ROUTES.LOGIN);
  };

  const toggleNotif = () => {
    if (!user) return;
    const next = !notif;
    setNotif(next);
    getSocket().emit(SE.USER_NOTIFICATION, { userId: user._id, notification: next });
    setUser({ ...user, notification: next });
  };

  const toggleMuted = () => {
    if (!user) return;
    const next = !muted;
    setMuted(next);
    getSocket().emit(SE.USER_MUTED, { userId: user._id, is_muted: next });
    setUser({ ...user, is_muted: next });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-light-border dark:border-dark-border">
        <h2 className="panel-heading">Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <SettingRow
          icon={theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          onClick={toggleTheme}
        />
        <SettingRow
          icon={notif ? <Bell size={18} /> : <BellOff size={18} />}
          label={notif ? 'Notifications on' : 'Notifications off'}
          onClick={toggleNotif}
        />
        <SettingRow
          icon={muted ? <BellOff size={18} /> : <Bell size={18} />}
          label={muted ? 'Sound off' : 'Sound on'}
          onClick={toggleMuted}
        />
      </div>

      <div className="p-4 border-t border-light-border dark:border-dark-border">
        <button
          onClick={logout}
          className="flex items-center gap-2 text-danger text-sm font-medium hover:bg-danger/10 px-3 py-2 rounded-lg w-full transition-colors"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </div>
  );
}

function SettingRow({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-light-border/60 dark:hover:bg-dark-border/60 transition-colors"
    >
      <span className="text-primary">{icon}</span>
      <span className="text-sm text-light-text dark:text-dark-text">{label}</span>
    </button>
  );
}
