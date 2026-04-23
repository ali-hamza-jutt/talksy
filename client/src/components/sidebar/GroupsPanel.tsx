import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import { useChatStore } from '@/store/chatStore';
import type { Group } from '@/types';
import { getSocket } from '@/services/socket';
import { SOCKET_EVENTS as SE } from '@/constants/socket';
import { useAuthStore } from '@/store/authStore';
import CreateGroupModal from '@/components/modals/CreateGroupModal';

export default function GroupsPanel() {
  const { user } = useAuthStore();
  const { groups, activeGroup, setActiveGroup, setActiveContact, setChatType, setGroupMessages } = useChatStore();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const openGroup = (group: Group) => {
    if (!user) return;
    setActiveGroup(group);
    setActiveContact(null);
    setChatType('group');
    setGroupMessages([]);
    const socket = getSocket();
    socket.emit(SE.GROUP_CLICK, { userId: user._id, groupId: group._id });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-light-border dark:border-dark-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="panel-heading">Groups</h2>
          <button
            onClick={() => setShowCreate(true)}
            className="sidebar-icon"
            title="Create group"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-light-muted dark:text-dark-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search groups…"
            className="input-field pl-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-light-muted dark:text-dark-muted mt-8">No groups yet</p>
        )}
        {filtered.map((group) => {
          const isActive = activeGroup?._id === group._id;
          return (
            <div
              key={group._id}
              onClick={() => openGroup(group)}
              className={`chat-item ${isActive ? 'chat-item-active' : ''}`}
            >
              <Avatar src={group.image?.[0]} name={group.name} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-sm text-light-text dark:text-dark-text truncate">{group.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-light-muted dark:text-dark-muted truncate">
                    {group.lastMsg || group.description || ''}
                  </p>
                  {group.unread && group.unread > 0 ? (
                    <span className="ml-1 shrink-0 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {group.unread}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showCreate && <CreateGroupModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
