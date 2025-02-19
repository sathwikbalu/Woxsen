import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Brain,
  Target,
  Calendar,
  TrendingUp,
  Award,
  BarChart2,
  MessageSquare,
} from "lucide-react";
import axios from "axios";
import { StatCard } from "./StatCard";
import { InsightCard } from "./InsightCard";
import { Banner } from "./Banner";
import { SadUsersCard } from "./SadUsersCard";

interface DashboardStats {
  activeUsers: number;
  activeUsersChange: number;
  avgMoodScore: number;
  avgMoodScoreChange: number;
  goalCompletionRate: number;
  goalCompletionChange: number;
  dailyCheckins: number;
  dailyCheckinsChange: number;
}

interface Message {
  _id: string;
  content: string;
  userId: {
    name: string;
    avatar?: string;
    role: string;
  };
  createdAt: string;
}

export const ProfessionalDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentMessage, setRecentMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, messagesRes] = await Promise.all([
          axios.get("http://LOCALHOST:5000/api/dashboard/stats"),
          axios.get("http://LOCALHOST:5000/api/messages?limit=1"),
        ]);

        setStats(statsRes.data);
        setRecentMessage(messagesRes.data[0] || null);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null) return "0";
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
  };

  const formatPercentage = (num: number | undefined | null): string => {
    if (num === undefined || num === null) return "0%";
    return `${num.toFixed(1)}%`;
  };

  const formatChange = (num: number | undefined | null): string => {
    if (num === undefined || num === null) return "0%";
    return `${num >= 0 ? "+" : ""}${num.toFixed(1)}%`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const dashboardStats = [
    {
      title: "Active Users",
      value: formatNumber(stats?.activeUsers),
      change: formatChange(stats?.activeUsersChange),
      isPositive: (stats?.activeUsersChange ?? 0) >= 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Avg. Mood Score",
      value: stats?.avgMoodScore ? `${stats.avgMoodScore.toFixed(1)}/5` : "0/5",
      change: formatChange(stats?.avgMoodScoreChange),
      isPositive: (stats?.avgMoodScoreChange ?? 0) >= 0,
      icon: Brain,
      color: "bg-green-500",
    },
    {
      title: "Goal Completion",
      value: formatPercentage(stats?.goalCompletionRate),
      change: formatChange(stats?.goalCompletionChange),
      isPositive: (stats?.goalCompletionChange ?? 0) >= 0,
      icon: Target,
      color: "bg-purple-500",
    },
    {
      title: "Daily Check-ins",
      value: formatNumber(stats?.dailyCheckins),
      change: formatChange(stats?.dailyCheckinsChange),
      isPositive: (stats?.dailyCheckinsChange ?? 0) >= 0,
      icon: Calendar,
      color: "bg-orange-500",
    },
  ];

  const insights = [
    {
      title: "Peak Usage Times",
      description: "Most users engage with the app between 9:00-10:00",
      icon: TrendingUp,
      color: "bg-indigo-500",
    },
    {
      title: "Popular Features",
      description: "Meditation and Mood Tracking are the most used features",
      icon: Award,
      color: "bg-pink-500",
    },
    {
      title: "Mood Patterns",
      description: "Users report higher mood scores after meditation sessions",
      icon: BarChart2,
      color: "bg-teal-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Professional Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Monitor user engagement and wellness trends
        </p>
      </div>

      <Banner />

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Users Needing Support */}
      <div className="mb-12">
        <SadUsersCard />
      </div>

      {/* Insights */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Key Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, index) => (
            <InsightCard key={insight.title} {...insight} index={index} />
          ))}
        </div>
      </div>

      {/* Latest Community Message */}
      {recentMessage && (
        <div className="mb-12">
          <Link
            to="/community"
            className="group block bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Latest Community Message
                </h2>
              </div>
              <span className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                View All Messages →
              </span>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    {recentMessage.userId.avatar ? (
                      <img
                        src={recentMessage.userId.avatar}
                        alt={recentMessage.userId.name}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {recentMessage.userId.name}
                    </p>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(recentMessage.createdAt)}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:text-indigo-200">
                  {recentMessage.userId.role}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                {recentMessage.content}
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/users"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow flex items-center gap-4"
          >
            <div className="bg-indigo-500 p-4 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Manage Users
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                View and manage user accounts and roles
              </p>
            </div>
          </Link>
          <Link
            to="/community"
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow flex items-center gap-4"
          >
            <div className="bg-teal-500 p-4 rounded-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Community
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share insights and engage with users
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
