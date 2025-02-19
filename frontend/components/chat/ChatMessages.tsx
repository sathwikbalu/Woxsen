import React, { useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import type { ChatMessage, ChatUser } from "../../types/chat";
import { MessageStatus } from "./MessageStatus";

interface ChatMessagesProps {
  messages: ChatMessage[];
  selectedUser: ChatUser | null;
  currentUserId: string;
  onSendMessage: (content: string) => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  selectedUser,
  currentUserId,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = React.useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage.trim());
    setNewMessage("");
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">
          Select a user to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {selectedUser.avatar ? (
            <img
              src={selectedUser.avatar}
              alt={selectedUser.name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <span className="text-lg font-medium text-indigo-600 dark:text-indigo-400">
                {selectedUser.name[0]}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {selectedUser.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedUser.isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${
                message.senderId === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.senderId === currentUserId
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                }`}
              >
                <p className="break-words">{message.content}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span
                    className={`text-xs ${
                      message.senderId === currentUserId
                        ? "text-indigo-200"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {format(new Date(message.timestamp), "HH:mm")}
                  </span>
                  {message.senderId === currentUserId && (
                    <MessageStatus
                      status={message.status}
                      className={
                        message.senderId === currentUserId
                          ? "text-indigo-200"
                          : "text-gray-500 dark:text-gray-400"
                      }
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
