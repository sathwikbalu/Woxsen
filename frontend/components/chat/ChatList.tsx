import React from "react";
import { Search, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import type { ChatUser } from "../../types/chat";

interface ChatListProps {
  users: ChatUser[];
  selectedUserId: string | null;
  onSelectUser: (user: ChatUser) => void;
  currentUserId: string;
}

export const ChatList: React.FC<ChatListProps> = ({
  users,
  selectedUserId,
  onSelectUser,
  currentUserId,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredUsers = users.filter(
    (user) =>
      user._id !== currentUserId &&
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-96 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredUsers.map((user) => (
          <motion.button
            key={user._id}
            onClick={() => onSelectUser(user)}
            className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              selectedUserId === user._id
                ? "bg-indigo-50 dark:bg-indigo-900/30"
                : ""
            }`}
            whileHover={{ x: 4 }}
          >
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              )}
              {user.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
              )}
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {user.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.role}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
