import { useState, useRef } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { getSocket } from '@/services/socket';
import { SOCKET_EVENTS as SE } from '@/constants/socket';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { uploadToCloudinary } from '@/services/cloudinary';
import type { Message, GroupMessage } from '@/types';
import toast from 'react-hot-toast';
import http from '@/services/api';
import { API } from '@/constants/api';

interface Props {
  editing: Message | GroupMessage | null;
  onCancelEdit: () => void;
}

export default function MessageInput({ editing, onCancelEdit }: Props) {
  const { user } = useAuthStore();
  const { chatType, activeContact, activeGroup, typingUsers } = useChatStore();
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const receiverId = chatType === 'group' ? activeGroup?._id : activeContact?.user_id;

  const isTyping = Object.values(typingUsers).some(Boolean);

  const emitTyping = (isTyping: boolean) => {
    if (!user || !receiverId) return;
    const socket = getSocket();
    if (chatType === 'group') {
      socket.emit(SE.GROUP_TYPING, { isTyping, senderId: user._id, groupId: receiverId });
    } else {
      socket.emit(SE.TYPING, { isTyping, senderId: user._id, receiverId });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    emitTyping(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => emitTyping(false), 1500);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) { toast.error('Max 2MB'); return; }
    setFile(f);
    if (f.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const send = async () => {
    if (!user || !receiverId) return;
    const msg = text.trim();
    if (!msg && !file && !editing) return;

    const socket = getSocket();
    emitTyping(false);

    if (editing) {
      const flag = '1';
      if (chatType === 'group') {
        socket.emit(SE.GROUP_MSG_UPDATE, { messageId: editing._id, message: msg, groupId: receiverId, flag });
      } else {
        socket.emit(SE.MESSAGE_UPDATE, { messageId: editing._id, message: msg, receiverId, userId: user._id, flag });
      }
      setText('');
      onCancelEdit();
      return;
    }

    setSending(true);
    try {
      let fileUrl = '';
      if (file) {
        fileUrl = await uploadToCloudinary(file, 'talksy/messages');
        await http.post(API.FILE_UPLOAD, { url: fileUrl });
      }

      if (chatType === 'group') {
        socket.emit(SE.GROUP_MESSAGE_EVT, {
          message: msg,
          sender_id: user._id,
          group_id: receiverId,
          file_upload: fileUrl,
          flag: '0',
        });
      } else {
        socket.emit(SE.CHAT_MESSAGE, {
          message: msg,
          sender_id: user._id,
          receiver_id: receiverId,
          file_upload: fileUrl,
          flag: '0',
        });
      }
    } catch {
      toast.error('Send failed');
    } finally {
      setSending(false);
      setText('');
      clearFile();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="border-t border-light-border dark:border-dark-border p-3">
      {editing && (
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-lg mb-2 text-sm">
          <span className="flex-1 text-light-text dark:text-dark-text truncate">Editing: {editing.message}</span>
          <button onClick={() => { onCancelEdit(); setText(''); }} className="text-light-muted dark:text-dark-muted hover:text-danger">
            <X size={14} />
          </button>
        </div>
      )}

      {preview && (
        <div className="relative inline-block mb-2">
          <img src={preview} alt="preview" className="h-20 rounded-lg object-cover" />
          <button onClick={clearFile} className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center">
            <X size={10} />
          </button>
        </div>
      )}
      {file && !preview && (
        <div className="flex items-center gap-2 mb-2 bg-light-input dark:bg-dark-input px-3 py-1.5 rounded-lg text-sm">
          <span className="text-light-text dark:text-dark-text truncate flex-1">{file.name}</span>
          <button onClick={clearFile}><X size={14} className="text-light-muted dark:text-dark-muted" /></button>
        </div>
      )}

      {isTyping && (
        <p className="text-xs text-light-muted dark:text-dark-muted mb-1 px-1">Typing…</p>
      )}

      <div className="flex items-center gap-2">
        <button onClick={() => fileRef.current?.click()} className="sidebar-icon shrink-0">
          <Paperclip size={18} />
        </button>
        <input ref={fileRef} type="file" accept="image/*,audio/*,video/*" className="hidden" onChange={onFile} />

        <input
          value={text}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          placeholder="Type a message…"
          className="input-field"
          disabled={sending}
        />

        <button
          onClick={send}
          disabled={sending || (!text.trim() && !file)}
          className="shrink-0 w-10 h-10 rounded-xl bg-primary hover:bg-primary-hover text-white flex items-center justify-center disabled:opacity-50 transition-colors"
        >
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}
