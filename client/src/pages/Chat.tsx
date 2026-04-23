import NavBar from '@/components/sidebar/NavBar';
import ChatsPanel from '@/components/sidebar/ChatsPanel';
import GroupsPanel from '@/components/sidebar/GroupsPanel';
import ContactsPanel from '@/components/sidebar/ContactsPanel';
import SettingsPanel from '@/components/sidebar/SettingsPanel';
import ProfilePanel from '@/components/sidebar/ProfilePanel';
import ChatWindow from '@/components/chat/ChatWindow';
import IncomingCallModal from '@/components/modals/IncomingCallModal';
import { useUiStore } from '@/store/uiStore';
import { useSocketSetup } from '@/hooks/useSocket';
import { useTheme } from '@/hooks/useTheme';
import type { ActiveTab } from '@/types';

const PANELS: Record<ActiveTab, React.ReactNode> = {
  chats:    <ChatsPanel />,
  groups:   <GroupsPanel />,
  contacts: <ContactsPanel />,
  settings: <SettingsPanel />,
  profile:  <ProfilePanel />,
};

export default function Chat() {
  useTheme();
  useSocketSetup();
  const { activeTab } = useUiStore();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-light-bg dark:bg-dark-bg">
      <NavBar />

      {/* Side panel */}
      <div className="w-72 flex flex-col border-r border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card shrink-0 overflow-hidden">
        {PANELS[activeTab]}
      </div>

      {/* Chat area */}
      <div className="flex flex-1 min-w-0 overflow-hidden">
        <ChatWindow />
      </div>

      <IncomingCallModal />
    </div>
  );
}
