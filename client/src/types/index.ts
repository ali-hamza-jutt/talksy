export interface User {
  _id: string;
  name: string;
  email: string;
  location?: string;
  image?: string;
  notification?: boolean;
  is_muted?: boolean;
  createdAt?: string;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  user_id: string;
  created_by: string;
  contact_id: string;
  userImg?: string[];
  unread?: number;
  lastMsg?: string;
  createdAt?: string;
}

export interface Message {
  _id: string;
  message: string;
  sender_id: string;
  receiver_id: string;
  file_upload?: string;
  flag: '0' | '1' | '2' | '3'; // normal | edited | deleted | forwarded
  createdAt: string;
  name?: string[];
  image?: string[];
}

export interface Group {
  _id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt?: string;
  unread?: number;
  lastMsg?: string;
  image?: string[];
}

export interface GroupMember {
  _id: string;
  contact_id: string;
  group_id: string;
  is_admin: boolean;
  unread?: number;
  name?: string;
  image?: string;
}

export interface GroupMessage {
  _id: string;
  message: string;
  sender_id: string;
  group_id: string;
  file_upload?: string;
  flag?: '0' | '1' | '2' | '3';
  createdAt: string;
  name?: string[];
  image?: string[];
  receiverName?: string;
  receiverImage?: string;
}

export interface CallInfo {
  uid: string;
  scid: string;
  name: string;
  image: string;
  ctype: 'audio' | 'video';
}

export type MessageFlag = '0' | '1' | '2' | '3';
export type ChatType = 'single' | 'group';
export type ActiveTab = 'profile' | 'chats' | 'groups' | 'contacts' | 'settings';
