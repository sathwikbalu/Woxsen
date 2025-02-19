import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { ChatList } from "./ChatList";
import { ChatMessages } from "./ChatMessages";
import { useAuth } from "../../contexts/AuthContext";
import type { ChatMessage, ChatUser } from "../../types/chat";

export const ProfessionalChat = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://LOCALHOST:5000");
    setSocket(newSocket);

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://LOCALHOST:5000/api/chat/users${
            currentUser?.role === "professional" ? "" : "?role=professional"
          }`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();

    return () => {
      newSocket.close();
    };
  }, [currentUser]);

  useEffect(() => {
    if (!socket || !selectedUser) return;

    socket.emit("join", {
      userId: currentUser?._id,
      targetId: selectedUser._id,
    });

    socket.on("message", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);

      // Emit message seen event if the message is from the selected user
      if (message.senderId === selectedUser._id) {
        socket.emit("message_seen", {
          messageId: message.id,
          senderId: message.senderId,
          receiverId: currentUser?._id,
        });
      }
    });

    socket.on("message_delivered", (messageId: string) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: "delivered" as const } : msg
        )
      );
    });

    socket.on("message_seen", (messageId: string) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: "seen" as const } : msg
        )
      );
    });

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://LOCALHOST:5000/api/chat/messages/${selectedUser._id}`
        );
        setMessages(response.data);

        // Mark all messages as seen
        socket.emit("messages_seen", {
          senderId: selectedUser._id,
          receiverId: currentUser?._id,
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    return () => {
      socket.off("message");
      socket.off("message_delivered");
      socket.off("message_seen");
      socket.emit("leave", {
        userId: currentUser?._id,
        targetId: selectedUser._id,
      });
    };
  }, [socket, selectedUser, currentUser]);

  const handleSendMessage = async (content: string) => {
    if (!socket || !selectedUser || !currentUser) return;

    try {
      const message = {
        id: Date.now().toString(),
        senderId: currentUser._id,
        receiverId: selectedUser._id,
        content,
        timestamp: new Date(),
        status: "sent" as const,
      };

      socket.emit("message", message);
      setMessages((prev) => [...prev, message]);

      await axios.post("http://LOCALHOST:5000/api/chat/messages", message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="h-screen pt-16">
      <div className="h-full bg-white dark:bg-gray-800 flex">
        <ChatList
          users={users}
          selectedUserId={selectedUser?._id || null}
          onSelectUser={setSelectedUser}
          currentUserId={currentUser?._id || ""}
        />
        <ChatMessages
          messages={messages}
          selectedUser={selectedUser}
          currentUserId={currentUser?._id || ""}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};
