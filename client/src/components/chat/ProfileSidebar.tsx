import { X, Phone, Video } from 'lucide-react';
import Avatar from '@/components/common/Avatar';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { getSocket } from '@/services/socket';
import { SOCKET_EVENTS as SE } from '@/constants/socket';
import { resolveUrl } from '@/services/cloudinary';

interface Props { onClose: () => void; }

export default function ProfileSidebar({ onClose }: Props) {
  const { user } = useAuthStore();
  const { activeContact, activeGroup, chatType, onlineUsers } = useChatStore();

  const startCall = (ctype: 'audio' | 'video') => {
    if (!user || !activeContact) return;
    const socket = getSocket();
    const scid = `${user._id}-${activeContact.user_id}`;
    socket.emit(SE.RING_CALL, {
      uid: activeContact.user_id,
      scid,
      name: user.name,
      image: resolveUrl(user.image, 'user'),
      ctype,
    });
    const params = new URLSearchParams({
      uid: activeContact.user_id,
      scid,
      ctype,
      name: activeContact.name,
      image: resolveUrl(activeContact.userImg?.[0], 'user'),
    });
    window.open(`/call?${params}`, '_blank');
  };

  const name = chatType === 'group' ? activeGroup?.name : activeContact?.name;
  const imgSrc = chatType === 'group' ? activeGroup?.image?.[0] : activeContact?.userImg?.[0];
  const isOnline = chatType === 'single' && activeContact ? onlineUsers.includes(activeContact.user_id) : false;

  return (
    <div className="w-72 flex flex-col border-l border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card">
      <div className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
        <h3 className="font-semibold text-light-text dark:text-dark-text">
          {chatType === 'group' ? 'Group Info' : 'Profile'}
        </h3>
        <button onClick={onClose} className="sidebar-icon w-8 h-8"><X size={16} /></button>
      </div>

      <div className="flex flex-col items-center gap-3 p-6 border-b border-light-border dark:border-dark-border">
        <Avatar src={imgSrc} name={name ?? '?'} size="lg" online={isOnline} />
        <div className="text-center">
          <p className="font-semibold text-light-text dark:text-dark-text">{name}</p>
          {chatType === 'single' && (
            <p className={`text-xs mt-1 ${isOnline ? 'text-success' : 'text-light-muted dark:text-dark-muted'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </p>
          )}
          {chatType === 'group' && activeGroup?.description && (
            <p className="text-xs text-light-muted dark:text-dark-muted mt-1">{activeGroup.description}</p>
          )}
        </div>

        {chatType === 'single' && (
          <div className="flex gap-3">
            <CallBtn icon={<Phone size={17} />} label="Voice" onClick={() => startCall('audio')} />
            <CallBtn icon={<Video size={17} />} label="Video" onClick={() => startCall('video')} />
          </div>
        )}
      </div>
    </div>
  );
}

function CallBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 text-primary"
    >
      <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
        {icon}
      </span>
      <span className="text-xs">{label}</span>
    </button>
  );
}
