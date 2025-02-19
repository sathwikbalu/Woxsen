import React from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Heart,
  Target,
  Wind,
  Activity,
  Smile,
  Sun,
  Calendar,
  Shield,
  Gamepad,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { ProfessionalDashboard } from "./dashboard/ProfessionalDashboard";
import { Banner } from "./dashboard/Banner";

const features = [
  {
    title: "Mood Tracker",
    description: "Track your daily emotions and mental state",
    icon: Activity,
    path: "/mood",
    color: "bg-blue-500",
    bgImage:
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Meditation",
    description: "Guided sessions for inner peace",
    icon: Heart,
    path: "/meditate",
    color: "bg-purple-500",
    bgImage:
      "https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Goal Tracking",
    description: "Set and achieve your mental wellness goals",
    icon: Target,
    path: "/goals",
    color: "bg-green-500",
    bgImage:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Breathing Exercises",
    description: "Calm your mind with guided breathing",
    icon: Wind,
    path: "/breathing",
    color: "bg-indigo-500",
    bgImage:
      "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Gratitude Journal",
    description: "Practice daily gratitude",
    icon: Sun,
    path: "/gratitude",
    color: "bg-yellow-500",
    bgImage:
      "https://images.unsplash.com/photo-1506784926709-22f1ec395907?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Daily Check-in",
    description: "Record your daily mental wellness",
    icon: Calendar,
    path: "/checkin",
    color: "bg-red-500",
    bgImage:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Community",
    description: "Connect with professionals and peers",
    icon: MessageSquare,
    path: "/community",
    color: "bg-teal-500",
    bgImage:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Bubble Pop Game",
    description: "Relieve stress with this fun game",
    icon: Gamepad,
    path: "/games/bubble-pop",
    color: "bg-pink-500",
    bgImage:
      "https://tse4.mm.bing.net/th?id=OIP.R_KvEfLE9eizzU92NyqorAHaD3&pid=Api&P=0&h=180",
  },
  {
    title: "Vibe check",
    description: "Check ur mood",
    icon: Smile,
    path: "/photo",
    color: "bg-yellow-500",
    bgImage:
      "https://tse4.mm.bing.net/th?id=OIP.Ol5QQp1Q61_Zc1oZw3rgUwHaEK&pid=Api&P=0&h=180",
  },
  {
    title: "Yoga center",
    description: "Get Yoga Classes here",
    icon: Shield,
    path: "/yoga",
    color: "bg-blue-500",
    bgImage:
      "https://tse1.mm.bing.net/th?id=OIP.ad36QYLk0GAw4EvNxR_2wQHaE8&pid=Api&P=0&h=180",
  },
  {
    title: "Story",
    description: "Generate a story ",
    icon: Heart,
    path: "/story",
    color: "bg-purple-500",
    bgImage:
      "https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?auto=format&fit=crop&q=80&w=800",
  },
];

const StandardDashboard = ({ user }: { user: any }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome back, {user?.name}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Take control of your mental well-being with these powerful tools
        </p>
      </div>

      <Banner />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Link
            key={feature.path}
            to={feature.path}
            className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"
              style={{ backgroundImage: `url(${feature.bgImage})` }}
            />
            <div className="relative p-8">
              <div
                className={`${feature.color} text-white p-3 rounded-xl inline-block mb-4`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const { user } = useAuth();
  return user?.role === "professional" ? (
    <ProfessionalDashboard />
  ) : (
    <StandardDashboard user={user} />
  );
};
