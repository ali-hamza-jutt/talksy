import { useEffect } from 'react';
import { getSocket } from '@/services/socket';
import { SOCKET_EVENTS as SE } from '@/constants/socket';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import type { Contact, Message, Group, GroupMessage } from '@/types';

export function useSocketSetup() {
  const { user } = useAuthStore();
  const {
    setContacts, addMessage, updateMessage, deleteMessage,
    setGroups, addGroupMessage, updateGroupMessage, deleteGroupMessage,
    setOnlineUsers, setIncomingCall, setTyping,
  } = useChatStore();

  useEffect(() => {
    if (!user) return;
    const socket = getSocket();

    socket.emit(SE.NEW_USER_JOINED, user._id, user.name);

    socket.on(SE.CONTACTS_LISTS, ({ contacts }: { contacts: Contact[] }) => setContacts(contacts));

    socket.on(SE.CHAT_MESSAGE, (msg: Message) => addMessage(msg));
    socket.on(SE.MESSAGE_UPDATE, ({ messageId, message, flag }: any) =>
      updateMessage(messageId, { message, flag })
    );
    socket.on(SE.MESSAGE_DELETE, ({ message_id }: any) => deleteMessage(message_id));

    socket.on(SE.GROUP_LISTS, ({ groups }: { groups: Group[] }) => setGroups(groups));
    socket.on(SE.GROUP_MESSAGE, (msg: GroupMessage) => addGroupMessage(msg));
    socket.on(SE.GROUP_MSG_UPDATE, ({ messageId, message }: any) =>
      updateGroupMessage(messageId, { message })
    );
    socket.on(SE.GROUP_MSG_DELETE, ({ message_id }: any) => deleteGroupMessage(message_id));

    socket.on(SE.ONLINE_USER, ({ online }: { online: string[] }) => setOnlineUsers(online));
    socket.on(SE.ONLINE_CONTACT, ({ online }: { online: string[] }) => setOnlineUsers(online));

    socket.on(SE.RING_CALLING, (uid, scid, name, image, ctype) =>
      setIncomingCall({ uid, scid, name, image, ctype })
    );
    socket.on(SE.CUT_PHONES, () => setIncomingCall(null));
    socket.on(SE.IT_BUSY,    () => setIncomingCall(null));

    socket.on(SE.TYPING, ({ isTyping, senderId }: any) => setTyping(senderId, isTyping));
    socket.on(SE.GROUP_TYPING, ({ isTyping, senderId }: any) => setTyping(senderId, isTyping));

    // request contact + group lists
    socket.emit(SE.EDIT_AND_UPDATE, user._id);

    return () => {
      socket.off(SE.CONTACTS_LISTS);
      socket.off(SE.CHAT_MESSAGE);
      socket.off(SE.MESSAGE_UPDATE);
      socket.off(SE.MESSAGE_DELETE);
      socket.off(SE.GROUP_LISTS);
      socket.off(SE.GROUP_MESSAGE);
      socket.off(SE.GROUP_MSG_UPDATE);
      socket.off(SE.GROUP_MSG_DELETE);
      socket.off(SE.ONLINE_USER);
      socket.off(SE.ONLINE_CONTACT);
      socket.off(SE.RING_CALLING);
      socket.off(SE.CUT_PHONES);
      socket.off(SE.IT_BUSY);
      socket.off(SE.TYPING);
      socket.off(SE.GROUP_TYPING);
    };
  }, [user]);
}
