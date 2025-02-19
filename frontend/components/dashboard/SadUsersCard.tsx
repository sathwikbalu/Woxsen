import React from "react";
import { MessageSquare, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

interface SadUser {
  _id: string;
  name: string;
  lastEntry: {
    content: string;
    date: string;
    sentiment: string;
  };
}

export const SadUsersCard = () => {
  const [sadUsers, setSadUsers] = React.useState<SadUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSadUsers = async () => {
      try {
        const response = await axios.get(
          "http://LOCALHOST:5000/api/gratitude/sad-users"
        );
        setSadUsers(response.data);
      } catch (error) {
        console.error("Error fetching sad users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSadUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Users Needing Support
          </h2>
        </div>
        <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {sadUsers.length} users
        </span>
      </div>

      <div className="space-y-4">
        {sadUsers.map((user) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last entry:{" "}
                  {new Date(user.lastEntry.date).toLocaleDateString()}
                </p>
              </div>
              <Link
                to={`/pchat`}
                className="inline-flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                Chat Now
              </Link>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              "{user.lastEntry.content}"
            </p>
          </motion.div>
        ))}

        {sadUsers.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            No users currently need immediate support
          </div>
        )}
      </div>
    </div>
  );
};
