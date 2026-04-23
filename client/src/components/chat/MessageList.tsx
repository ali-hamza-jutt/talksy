import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import type { Message, GroupMessage } from '@/types';
import { getSocket } from '@/services/socket';
import { SOCKET_EVENTS as SE } from '@/constants/socket';

interface Props {
  onEdit: (msg: Message | GroupMessage) => void;
  onForward: (msg: Message) => void;
}

export default function MessageList({ onEdit, onForward }: Props) {
  const { user } = useAuthStore();
  const { messages, groupMessages, chatType, deleteMessage, deleteGroupMessage } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  const list = chatType === 'group' ? groupMessages : messages;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [list.length]);

  const handleDelete = (id: string) => {
    const socket = getSocket();
    if (chatType === 'group') {
      socket.emit(SE.SINGLE_GROUP_MSG_DELETE, { message_id: id });
      deleteGroupMessage(id);
    } else {
      const msg = messages.find((m) => m._id === id);
      if (msg) {
        socket.emit(SE.MESSAGE_DELETE, { message_id: id, receiver_id: msg.receiver_id });
        deleteMessage(id);
      }
    }
  };

  if (list.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-light-muted dark:text-dark-muted">No messages yet. Say hello!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {list.map((msg) => (
        <MessageBubble
          key={msg._id}
          message={msg}
          isOwn={msg.sender_id === user?._id}
          onEdit={onEdit}
          onDelete={handleDelete}
          onForward={chatType === 'single' ? onForward : undefined}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
