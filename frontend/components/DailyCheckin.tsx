import React, { useEffect } from "react";
import { Calendar, Moon, Sun, Wind, Brain } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

interface DailyCheckin {
  id: string;
  mood: number;
  sleep: {
    hours: number;
    quality: number;
  };
  anxiety: number;
  stress: number;
  activities: string[];
  notes: string;
  date: Date;
}

export const DailyCheckin = () => {
  const [checkins, setCheckins] = React.useState<DailyCheckin[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [formData, setFormData] = React.useState({
    mood: 3,
    sleepHours: 7,
    sleepQuality: 3,
    anxiety: 3,
    stress: 3,
    activities: [] as string[],
    notes: "",
  });

  useEffect(() => {
    fetchCheckins();
  }, []);

  const fetchCheckins = async () => {
    try {
      const response = await axios.get("http://LOCALHOST:5000/api/checkins");
      setCheckins(response.data);
    } catch (error) {
      console.error("Error fetching checkins:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://LOCALHOST:5000/api/checkins", {
        mood: formData.mood,
        sleep: {
          hours: formData.sleepHours,
          quality: formData.sleepQuality,
        },
        anxiety: formData.anxiety,
        stress: formData.stress,
        activities: formData.activities,
        notes: formData.notes,
      });

      setCheckins([response.data, ...checkins]);
      // Reset form
      setFormData({
        mood: 3,
        sleepHours: 7,
        sleepQuality: 3,
        anxiety: 3,
        stress: 3,
        activities: [],
        notes: "",
      });
    } catch (error) {
      console.error("Error saving checkin:", error);
    }
  };

  const activities = [
    "Exercise",
    "Meditation",
    "Reading",
    "Journaling",
    "Therapy",
    "Social Activity",
    "Nature Walk",
    "Creative Activity",
  ];

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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Daily Check-in
        </h1>
        <p className="text-lg text-gray-600">
          Track your daily mental wellness journey
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-xl p-6 mb-8"
        onSubmit={handleSubmit}
      >
        <div className="space-y-6">
          {/* Mood Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How are you feeling today?
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.mood}
              onChange={(e) =>
                setFormData({ ...formData, mood: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>Very Low</span>
              <span>Low</span>
              <span>Neutral</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Sleep */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours of Sleep
              </label>
              <input
                type="number"
                min="0"
                max="24"
                value={formData.sleepHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sleepHours: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sleep Quality
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.sleepQuality}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sleepQuality: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Anxiety & Stress */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anxiety Level
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.anxiety}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    anxiety: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stress Level
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.stress}
                onChange={(e) =>
                  setFormData({ ...formData, stress: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Activities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activities Today
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {activities.map((activity) => (
                <label
                  key={activity}
                  className="flex items-center space-x-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={formData.activities.includes(activity)}
                    onChange={(e) => {
                      const newActivities = e.target.checked
                        ? [...formData.activities, activity]
                        : formData.activities.filter((a) => a !== activity);
                      setFormData({ ...formData, activities: newActivities });
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{activity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Any thoughts or reflections about your day..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Check-in
          </button>
        </div>
      </motion.form>

      {/* Previous Check-ins */}
      <div className="space-y-6">
        {checkins.map((checkin) => (
          <motion.div
            key={checkin.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(checkin.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-500" />
                <span>Mood: {checkin.mood}/5</span>
              </div>
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-blue-500" />
                <span>
                  Sleep: {checkin.sleep.hours}hrs ({checkin.sleep.quality}/5)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-yellow-500" />
                <span>Anxiety: {checkin.anxiety}/5</span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-red-500" />
                <span>Stress: {checkin.stress}/5</span>
              </div>
            </div>

            {checkin.activities.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Activities:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {checkin.activities.map((activity) => (
                    <span
                      key={activity}
                      className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {checkin.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Notes:
                </h4>
                <p className="text-gray-600">{checkin.notes}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
