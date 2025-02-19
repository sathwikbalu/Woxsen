import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface Notification {
  _id: string;
  message: string;
  type: "daily" | "reminder" | "achievement";
  isRead: boolean;
  scheduledFor: string;
}

export const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://LOCALHOST:5000/api/notifications");
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n: Notification) => !n.isRead).length);
      setError(null);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications");
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`http://LOCALHOST:5000/api/notifications/${id}/read`);
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setError(null);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setError("Failed to mark notification as read");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "daily":
        return "📅";
      case "reminder":
        return "⏰";
      case "achievement":
        return "🏆";
      default:
        return "📫";
    }
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return notificationDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
          >
            {unreadCount}
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 text-sm">
                  {error}
                </div>
              )}

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        !notification.isRead
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      }`}
                      onClick={() => markAsRead(notification._id)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1">
                          <p className="text-gray-800 dark:text-gray-200 mb-1">
                            {notification.message}
                          </p>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                              {formatDate(notification.scheduledFor)}
                            </span>
                            {!notification.isRead && (
                              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowNotifications(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};