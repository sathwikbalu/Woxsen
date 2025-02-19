import React from "react";
import { MessageSquare, Heart } from "lucide-react";
import { motion } from "framer-motion";

interface Message {
  _id: string;
  content: string;
  userId: {
    name: string;
    avatar?: string;
  };
  likes: string[];
  createdAt: string;
}

interface CommunityGridProps {
  messages: Message[];
}

export const CommunityGrid: React.FC<CommunityGridProps> = ({ messages }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {messages.map((message, index) => (
        <motion.div
          key={message._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {message.userId.avatar ? (
                <img
                  className="h-10 w-10 rounded-full"
                  src={message.userId.avatar}
                  alt={message.userId.name}
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {message.userId.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(message.createdAt)}
              </p>
            </div>
          </div>
          <p className="mt-4 text-gray-800 dark:text-gray-200 line-clamp-3">
            {message.content}
          </p>
          <div className="mt-4 flex items-center text-gray-500 dark:text-gray-400">
            <Heart className="h-5 w-5 mr-1" />
            <span>{message.likes.length}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
