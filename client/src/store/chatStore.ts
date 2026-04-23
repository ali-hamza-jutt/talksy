import { create } from 'zustand';
import type { Contact, Message, Group, GroupMessage, CallInfo } from '@/types';

interface ChatState {
  contacts:       Contact[];
  messages:       Message[];
  groups:         Group[];
  groupMessages:  GroupMessage[];
  activeContact:  Contact | null;
  activeGroup:    Group | null;
  chatType:       'single' | 'group' | null;
  onlineUsers:    string[];
  incomingCall:   CallInfo | null;
  typingUsers:    Record<string, boolean>;

  setContacts:      (c: Contact[]) => void;
  setMessages:      (m: Message[]) => void;
  addMessage:       (m: Message) => void;
  updateMessage:    (id: string, patch: Partial<Message>) => void;
  deleteMessage:    (id: string) => void;
  setGroups:        (g: Group[]) => void;
  setGroupMessages: (m: GroupMessage[]) => void;
  addGroupMessage:  (m: GroupMessage) => void;
  updateGroupMessage:(id: string, patch: Partial<GroupMessage>) => void;
  deleteGroupMessage:(id: string) => void;
  setActiveContact: (c: Contact | null) => void;
  setActiveGroup:   (g: Group | null) => void;
  setChatType:      (t: 'single' | 'group' | null) => void;
  setOnlineUsers:   (u: string[]) => void;
  setIncomingCall:  (c: CallInfo | null) => void;
  setTyping:        (userId: string, isTyping: boolean) => void;
  clearMessages:    () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  contacts:      [],
  messages:      [],
  groups:        [],
  groupMessages: [],
  activeContact: null,
  activeGroup:   null,
  chatType:      null,
  onlineUsers:   [],
  incomingCall:  null,
  typingUsers:   {},

  setContacts:      (contacts)      => set({ contacts }),
  setMessages:      (messages)      => set({ messages }),
  addMessage:       (m)             => set((s) => ({ messages: [...s.messages, m] })),
  updateMessage:    (id, patch)     => set((s) => ({
    messages: s.messages.map((m) => m._id === id ? { ...m, ...patch } : m),
  })),
  deleteMessage:    (id)            => set((s) => ({
    messages: s.messages.map((m) => m._id === id ? { ...m, flag: '2' } : m),
  })),
  setGroups:        (groups)        => set({ groups }),
  setGroupMessages: (groupMessages) => set({ groupMessages }),
  addGroupMessage:  (m)             => set((s) => ({ groupMessages: [...s.groupMessages, m] })),
  updateGroupMessage:(id, patch)    => set((s) => ({
    groupMessages: s.groupMessages.map((m) => m._id === id ? { ...m, ...patch } : m),
  })),
  deleteGroupMessage:(id)           => set((s) => ({
    groupMessages: s.groupMessages.map((m) => m._id === id ? { ...m, flag: '2' } : m),
  })),
  setActiveContact: (activeContact) => set({ activeContact }),
  setActiveGroup:   (activeGroup)   => set({ activeGroup }),
  setChatType:      (chatType)      => set({ chatType }),
  setOnlineUsers:   (onlineUsers)   => set({ onlineUsers }),
  setIncomingCall:  (incomingCall)  => set({ incomingCall }),
  setTyping:        (userId, isTyping) => set((s) => ({
    typingUsers: { ...s.typingUsers, [userId]: isTyping },
  })),
  clearMessages:    ()              => set({ messages: [], groupMessages: [] }),
}));
