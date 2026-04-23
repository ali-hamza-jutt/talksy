import { MessageSquare, Users, UserPlus, Settings, User } from 'lucide-react';
import Logo from '@/components/common/Logo';
import { useUiStore } from '@/store/uiStore';
import type { ActiveTab } from '@/types';

const TABS: { id: ActiveTab; icon: React.ReactNode; label: string }[] = [
  { id: 'chats',    icon: <MessageSquare size={20} />, label: 'Chats' },
  { id: 'groups',   icon: <Users size={20} />,         label: 'Groups' },
  { id: 'contacts', icon: <UserPlus size={20} />,      label: 'Contacts' },
  { id: 'settings', icon: <Settings size={20} />,      label: 'Settings' },
];

export default function NavBar() {
  const { activeTab, setActiveTab } = useUiStore();

  return (
    <div className="flex flex-col items-center py-4 gap-2 w-16 bg-light-sidebar dark:bg-dark-sidebar border-r border-light-border dark:border-dark-border shrink-0">
      <div className="mb-4">
        <Logo height={32} />
      </div>

      {TABS.map(({ id, icon, label }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          title={label}
          className={`sidebar-icon ${activeTab === id ? 'sidebar-icon-active' : ''}`}
        >
          {icon}
        </button>
      ))}

      <div className="mt-auto">
        <button
          onClick={() => setActiveTab('profile')}
          title="Profile"
          className={`sidebar-icon ${activeTab === 'profile' ? 'sidebar-icon-active' : ''}`}
        >
          <User size={20} />
        </button>
      </div>
    </div>
  );
}
