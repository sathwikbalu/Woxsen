import React, { useEffect } from "react";
import { Calendar, Smile, Frown, Meh } from "lucide-react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import type { MoodEntry } from "../types";

export const MoodTracker = () => {
  const [mood, setMood] = React.useState<1 | 2 | 3 | 4 | 5>(3);
  const [note, setNote] = React.useState("");
  const [entries, setEntries] = React.useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchMoodEntries();
  }, []);

  const fetchMoodEntries = async () => {
    try {
      const response = await axios.get("http://LOCALHOST:5000/api/mood");
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching mood entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://LOCALHOST:5000/api/mood", {
        mood,
        note,
      });
      setEntries([response.data, ...entries]);
      setNote("");
    } catch (error) {
      console.error("Error saving mood entry:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          How are you feeling today?
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMood(value as 1 | 2 | 3 | 4 | 5)}
                className={`p-4 rounded-full transition-all ${
                  mood === value
                    ? "bg-indigo-100 scale-110"
                    : "hover:bg-gray-100 hover:scale-105"
                }`}
              >
                {value === 1 && <Frown className="w-8 h-8 text-red-500" />}
                {value === 2 && <Frown className="w-8 h-8 text-orange-500" />}
                {value === 3 && <Meh className="w-8 h-8 text-yellow-500" />}
                {value === 4 && <Smile className="w-8 h-8 text-lime-500" />}
                {value === 5 && <Smile className="w-8 h-8 text-green-500" />}
              </button>
            ))}
          </div>

          <div>
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Add a note (optional)
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
              placeholder="How are you feeling? What's on your mind?"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Entry
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Mood History</h3>
          <Calendar className="w-6 h-6 text-gray-500" />
        </div>

        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50"
            >
              <div className="flex-shrink-0">
                {entry.mood <= 2 && <Frown className="w-6 h-6 text-red-500" />}
                {entry.mood === 3 && (
                  <Meh className="w-6 h-6 text-yellow-500" />
                )}
                {entry.mood >= 4 && (
                  <Smile className="w-6 h-6 text-green-500" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {new Date(entry.timestamp).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                {entry.note && (
                  <p className="mt-1 text-gray-700">{entry.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
