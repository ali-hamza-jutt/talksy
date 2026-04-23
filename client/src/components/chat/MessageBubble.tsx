import { useState } from 'react';
import { MoreVertical, Edit2, Trash2, Share2 } from 'lucide-react';
import type { Message, GroupMessage } from '@/types';
import { resolveUrl } from '@/services/cloudinary';

interface Props {
  message: Message | GroupMessage;
  isOwn: boolean;
  onEdit?: (msg: Message | GroupMessage) => void;
  onDelete?: (id: string) => void;
  onForward?: (msg: Message) => void;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
}

const FLAG_LABEL: Record<string, string> = { '1': '(edited)', '3': '(forwarded)' };

export default function MessageBubble({ message, isOwn, onEdit, onDelete, onForward }: Props) {
  const [showMenu, setShowMenu] = useState(false);

  if (message.flag === '2') {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
        <span className="text-xs italic text-light-muted dark:text-dark-muted px-4 py-2">
          This message was deleted
        </span>
      </div>
    );
  }

  const senderName = (message as GroupMessage).receiverName ?? message.name?.[0];
  const senderImg = (message as GroupMessage).receiverImage ?? message.image?.[0];
  const fileUrl = message.file_upload ? resolveUrl(message.file_upload, 'message') : null;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2 group`}>
      {!isOwn && senderImg && (
        <img
          src={resolveUrl(senderImg, 'user')}
          alt={senderName}
          className="w-7 h-7 rounded-full object-cover mr-2 mt-auto mb-1 shrink-0"
        />
      )}

      <div className={`relative flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-xs lg:max-w-sm`}>
        {!isOwn && senderName && (
          <span className="text-xs text-primary font-medium mb-1 px-1">{senderName}</span>
        )}

        <div className={`relative ${isOwn ? 'msg-bubble-out' : 'msg-bubble-in'}`}>
          {fileUrl && (
            <div className="mb-1">
              {/\.(mp4|webm)$/i.test(fileUrl) ? (
                <video src={fileUrl} controls className="max-w-full rounded-lg" />
              ) : /\.(mp3|ogg|wav)$/i.test(fileUrl) ? (
                <audio src={fileUrl} controls className="max-w-full" />
              ) : (
                <img src={fileUrl} alt="attachment" className="max-w-full rounded-lg" />
              )}
            </div>
          )}
          {message.message && <p className="break-words">{message.message}</p>}
          {FLAG_LABEL[message.flag ?? ''] && (
            <span className="text-xs opacity-60 ml-1">{FLAG_LABEL[message.flag!]}</span>
          )}

          <div className={`absolute top-1 ${isOwn ? '-left-8' : '-right-8'} hidden group-hover:flex`}>
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-light-border dark:hover:bg-dark-border text-light-muted dark:text-dark-muted"
            >
              <MoreVertical size={14} />
            </button>
          </div>
        </div>

        <span className="text-xs text-light-muted dark:text-dark-muted px-1 mt-0.5">
          {formatTime(message.createdAt)}
        </span>

        {showMenu && (
          <div
            className={`absolute z-10 top-6 ${isOwn ? 'right-0' : 'left-0'} bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-lg py-1 min-w-[130px]`}
            onMouseLeave={() => setShowMenu(false)}
          >
            {isOwn && onEdit && (
              <MenuBtn icon={<Edit2 size={14} />} label="Edit" onClick={() => { onEdit(message); setShowMenu(false); }} />
            )}
            {isOwn && onDelete && (
              <MenuBtn icon={<Trash2 size={14} />} label="Delete" onClick={() => { onDelete(message._id); setShowMenu(false); }} danger />
            )}
            {onForward && (
              <MenuBtn icon={<Share2 size={14} />} label="Forward" onClick={() => { onForward(message as Message); setShowMenu(false); }} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MenuBtn({ icon, label, onClick, danger }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors ${danger ? 'text-danger' : 'text-light-text dark:text-dark-text'}`}
    >
      {icon} {label}
    </button>
  );
}
