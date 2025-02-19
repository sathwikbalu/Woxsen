import React, { useEffect, useState } from "react";
import { MessageSquare, Heart, Trash2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

interface Message {
  _id: string;
  content: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  likes: string[];
  createdAt: string;
  attachments: string[];
}

export const CommunityPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://LOCALHOST:5000/api/messages");
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post("http://LOCALHOST:5000/api/messages", {
        content: newMessage.trim(),
      });
      setMessages([response.data, ...messages]);
      setNewMessage("");
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  const handleLike = async (messageId: string) => {
    try {
      const response = await axios.post(
        `http://LOCALHOST:5000/api/messages/${messageId}/like`
      );
      setMessages(
        messages.map((msg) =>
          msg._id === messageId ? { ...msg, likes: response.data.likes } : msg
        )
      );
    } catch (error) {
      console.error("Error liking message:", error);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    try {
      await axios.delete(`http://LOCALHOST:5000/api/messages/${messageId}`);
      setMessages(messages.filter((msg) => msg._id !== messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Community
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Connect with mental health professionals and fellow members
        </p>
      </div>

      {user?.role === "professional" && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
          onSubmit={handleSubmit}
        >
          <div className="flex items-start space-x-4">
            <div className="min-w-0 flex-1">
              <div className="border-b border-gray-200 dark:border-gray-700 focus-within:border-indigo-600">
                <textarea
                  rows={3}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="block w-full resize-none border-0 border-b border-transparent bg-transparent p-0 pb-2 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-indigo-600 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Share your professional insights..."
                />
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <Send className="h-5 w-5 mr-2" />
                Post
              </button>
            </div>
          </div>
        </motion.form>
      )}

      <div className="space-y-6">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {message.userId.name}
                      </p>
                      <span className="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:text-indigo-200">
                        {message.userId.role}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                  <p className="mt-4 text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <div className="mt-4 flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(message._id)}
                      className={`flex items-center space-x-2 text-sm ${
                        message.likes.includes(user?._id || "")
                          ? "text-pink-600 dark:text-pink-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <Heart className="h-5 w-5" />
                      <span>{message.likes.length}</span>
                    </button>
                    {message.userId._id === user?._id && (
                      <button
                        onClick={() => handleDelete(message._id)}
                        className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
