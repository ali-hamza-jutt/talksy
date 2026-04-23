import { useState } from 'react';
import { Search, Plus, Trash2, MessageSquare } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { getSocket } from '@/services/socket';
import { SOCKET_EVENTS as SE } from '@/constants/socket';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import type { Contact } from '@/types';
import AddContactModal from '@/components/modals/AddContactModal';

export default function ContactsPanel() {
  const { user } = useAuthStore();
  const { contacts, setActiveContact, setActiveGroup, setChatType, setMessages } = useChatStore();
  const { setActiveTab } = useUiStore();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const grouped = contacts
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .reduce<Record<string, Contact[]>>((acc, c) => {
      const letter = c.name[0].toUpperCase();
      acc[letter] = acc[letter] ? [...acc[letter], c] : [c];
      return acc;
    }, {});

  const openChat = (contact: Contact) => {
    if (!user) return;
    setActiveContact(contact);
    setActiveGroup(null);
    setChatType('single');
    setMessages([]);
    const socket = getSocket();
    socket.emit(SE.USER_CLICK, { userId: user._id, receiverId: contact.user_id });
    setActiveTab('chats');
  };

  const deleteContact = (contact: Contact) => {
    if (!user) return;
    const socket = getSocket();
    socket.emit(SE.CONTACT_DELETE, { contact_id: contact._id, receiverId: contact.user_id, userId: user._id });
    socket.emit(SE.ALL_MSG_DELETE, { receiverId: contact.user_id });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-light-border dark:border-dark-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="panel-heading">Contacts</h2>
          <button onClick={() => setShowAdd(true)} className="sidebar-icon" title="Add contact">
            <Plus size={18} />
          </button>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-light-muted dark:text-dark-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts…"
            className="input-field pl-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {Object.keys(grouped).sort().map((letter) => (
          <div key={letter} className="mb-3">
            <p className="text-xs font-semibold text-primary px-3 py-1">{letter}</p>
            {grouped[letter].map((contact) => (
              <div key={contact._id} className="chat-item group">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-light-text dark:text-dark-text truncate">{contact.name}</p>
                  <p className="text-xs text-light-muted dark:text-dark-muted truncate">{contact.email}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openChat(contact)}
                    className="sidebar-icon w-8 h-8"
                    title="Send message"
                  >
                    <MessageSquare size={15} />
                  </button>
                  <button
                    onClick={() => deleteContact(contact)}
                    className="sidebar-icon w-8 h-8 hover:text-danger hover:bg-danger/10"
                    title="Remove contact"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <p className="text-center text-sm text-light-muted dark:text-dark-muted mt-8">No contacts yet</p>
        )}
      </div>

      {showAdd && <AddContactModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
