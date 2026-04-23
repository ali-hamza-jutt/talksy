import { useState } from 'react';
import { Search } from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import { useChatStore } from '@/store/chatStore';
import type { Contact } from '@/types';
import { getSocket } from '@/services/socket';
import { SOCKET_EVENTS as SE } from '@/constants/socket';
import { useAuthStore } from '@/store/authStore';

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}

export default function ChatsPanel() {
  const { user } = useAuthStore();
  const { contacts, activeContact, setActiveContact, setActiveGroup, setChatType, setMessages, onlineUsers } = useChatStore();
  const [search, setSearch] = useState('');

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openChat = (contact: Contact) => {
    if (!user) return;
    setActiveContact(contact);
    setActiveGroup(null);
    setChatType('single');
    setMessages([]);
    const socket = getSocket();
    socket.emit(SE.USER_CLICK, { userId: user._id, receiverId: contact.user_id });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-light-border dark:border-dark-border">
        <h2 className="panel-heading mb-3">Chats</h2>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-light-muted dark:text-dark-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats…"
            className="input-field pl-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-light-muted dark:text-dark-muted mt-8">No chats yet</p>
        )}
        {filtered.map((contact) => {
          const isOnline = onlineUsers.includes(contact.user_id);
          const isActive = activeContact?.user_id === contact.user_id;
          return (
            <div
              key={contact._id}
              onClick={() => openChat(contact)}
              className={`chat-item ${isActive ? 'chat-item-active' : ''}`}
            >
              <Avatar
                src={contact.userImg?.[0]}
                name={contact.name}
                size="sm"
                online={isOnline}
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-sm text-light-text dark:text-dark-text truncate">{contact.name}</span>
                  {contact.createdAt && (
                    <span className="text-xs text-light-muted dark:text-dark-muted shrink-0 ml-1">
                      {formatTime(contact.createdAt)}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-light-muted dark:text-dark-muted truncate">
                    {contact.lastMsg || ''}
                  </p>
                  {contact.unread && contact.unread > 0 ? (
                    <span className="ml-1 shrink-0 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {contact.unread}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
