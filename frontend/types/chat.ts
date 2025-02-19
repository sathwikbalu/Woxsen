export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  status: "sent" | "delivered" | "seen";
}

export interface ChatUser {
  _id: string;
  name: string;
  role: "professional" | "standard";
  avatar?: string;
  lastSeen?: Date;
  isOnline?: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}
