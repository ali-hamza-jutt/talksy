import { useState } from 'react';
import { Info } from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ProfileSidebar from './ProfileSidebar';
import ForwardMessageModal from '@/components/modals/ForwardMessageModal';
import { useChatStore } from '@/store/chatStore';
import type { Message, GroupMessage } from '@/types';

export default function ChatWindow() {
  const { activeContact, activeGroup, chatType, onlineUsers } = useChatStore();
  const [showProfile, setShowProfile] = useState(false);
  const [editing, setEditing] = useState<Message | GroupMessage | null>(null);
  const [forwarding, setForwarding] = useState<Message | null>(null);

  const isActive = chatType === 'group' ? !!activeGroup : !!activeContact;

  if (!isActive) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-light-bg dark:bg-dark-bg gap-3">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </div>
        <p className="text-light-muted dark:text-dark-muted text-sm">Select a conversation to start chatting</p>
      </div>
    );
  }

  const name = chatType === 'group' ? activeGroup!.name : activeContact!.name;
  const imgSrc = chatType === 'group' ? activeGroup!.image?.[0] : activeContact!.userImg?.[0];
  const isOnline = chatType === 'single' && activeContact ? onlineUsers.includes(activeContact.user_id) : false;

  return (
    <div className="flex flex-1 min-w-0 overflow-hidden">
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card shrink-0">
          <Avatar src={imgSrc} name={name} size="sm" online={isOnline} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-light-text dark:text-dark-text truncate">{name}</p>
            <p className={`text-xs ${isOnline ? 'text-success' : 'text-light-muted dark:text-dark-muted'}`}>
              {chatType === 'group' ? 'Group' : isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
          <button
            onClick={() => setShowProfile((v) => !v)}
            className="sidebar-icon shrink-0"
            title="View profile"
          >
            <Info size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col overflow-hidden bg-light-bg dark:bg-dark-bg">
          <MessageList
            onEdit={(msg) => { setEditing(msg); }}
            onForward={(msg) => setForwarding(msg)}
          />
          <MessageInput
            editing={editing}
            onCancelEdit={() => setEditing(null)}
          />
        </div>
      </div>

      {showProfile && <ProfileSidebar onClose={() => setShowProfile(false)} />}
      {forwarding && <ForwardMessageModal message={forwarding} onClose={() => setForwarding(null)} />}
    </div>
  );
}
