import { useState } from 'react';
import Modal from '@/components/common/Modal';
import { getSocket } from '@/services/socket';
import { SOCKET_EVENTS as SE } from '@/constants/socket';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import type { Message } from '@/types';

interface Props { message: Message; onClose: () => void; }

export default function ForwardMessageModal({ message, onClose }: Props) {
  const { user } = useAuthStore();
  const { contacts } = useChatStore();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const forward = () => {
    if (!user || selected.length === 0) return;
    const socket = getSocket();
    selected.forEach((receiverId) => {
      socket.emit(SE.CHAT_MESSAGE, {
        message: message.message,
        sender_id: user._id,
        receiver_id: receiverId,
        file_upload: message.file_upload || '',
        flag: '3',
      });
    });
    onClose();
  };

  return (
    <Modal open title="Forward Message" onClose={onClose}>
      <p className="text-sm text-light-muted dark:text-dark-muted mb-3">Select contacts to forward to:</p>
      <div className="max-h-52 overflow-y-auto space-y-1 mb-4">
        {contacts.map((c) => (
          <label key={c._id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-light-border/40 dark:hover:bg-dark-border/40 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(c.user_id)}
              onChange={() => toggle(c.user_id)}
              className="accent-primary"
            />
            <span className="text-sm text-light-text dark:text-dark-text">{c.name}</span>
          </label>
        ))}
      </div>
      <button onClick={forward} disabled={selected.length === 0} className="btn-primary">
        Forward
      </button>
    </Modal>
  );
}
