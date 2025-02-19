import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface InsightCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  index: number;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  title,
  description,
  icon: Icon,
  color,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <div
        className={`${color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </motion.div>
  );
};
