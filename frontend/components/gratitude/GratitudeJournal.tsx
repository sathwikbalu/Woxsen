import React, { useEffect } from "react";
import { format } from "date-fns";
import {
  Heart,
  Calendar,
  Plus,
  Smile,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import type { GratitudeEntry } from "../../types";

interface GratitudeEntryWithSentiment extends GratitudeEntry {
  sentiment?: string;
}

const sentimentEmojis: { [key: string]: string } = {
  "Extremely Happy": "🤩",
  "Very Happy": "😊",
  "Happy": "🙂",
  "Neutral": "😐",
  "Sad": "🙁",
  "Very Sad": "😢",
  "Extremely Sad": "😭",
};

export const GratitudeJournal = () => {
  const [entries, setEntries] = React.useState<GratitudeEntryWithSentiment[]>(
    []
  );
  const [newEntry, setNewEntry] = React.useState("");
  const [isAdding, setIsAdding] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  useEffect(() => {
    fetchEntries(currentPage);
  }, [currentPage]);

  const fetchEntries = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://LOCALHOST:5000/api/gratitude?page=${page}&limit=10`
      );
      setEntries(response.data.entries);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (error) {
      console.error("Error fetching gratitude entries:", error);
      setError("Failed to load entries. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeSentiment = async (prompt: string): Promise<string> => {
    let retryCount = 0;
    while (retryCount < 2) {
      try {
        const response = await axios.post(
          "https://b330-34-126-114-207.ngrok-free.app/analyze-sentiment",
          { prompt },
          { headers: { "Content-Type": "application/json" }, timeout: 10000 }
        );
        if (response.data?.sentiment) return response.data.sentiment;
      } catch (error) {
        console.error(`Retry ${retryCount + 1} failed:`, error);
      }
      retryCount++;
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s before retry
    }
    return "Neutral";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const sentiment = await analyzeSentiment(newEntry.trim());
      const response = await axios.post("http://localhost:5000/api/gratitude", {
        {
          content: newEntry.trim(),
          sentiment,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      });

      setEntries([response.data, ...entries]);
      setNewEntry("");
      setIsAdding(false);
    } catch (error) {
      console.error("Error saving gratitude entry:", error);
      setError("Failed to save entry. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentColor = (sentiment: string = "Neutral") => {
    const colors: { [key: string]: string } = {
      "Extremely Happy":
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
      "Very Happy":
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Happy: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
      Neutral: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      Sad: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      "Very Sad":
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      "Extremely Sad":
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[sentiment] || colors.Neutral;
  };

  if (isLoading && entries.length === 0) {
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
          Gratitude Journal
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Take a moment to reflect on what you're grateful for today
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-8">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Entry
          </button>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
            onSubmit={handleSubmit}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              What are you grateful for today?
            </label>
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={4}
              placeholder="I'm grateful for..."
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Smile className="w-5 h-5" />
                    Save Entry
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(entry.date), "MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2">
                  {entry.sentiment && (
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(
                        entry.sentiment
                      )}`}
                    >
                      {sentimentEmojis[entry.sentiment]}
                      {entry.sentiment}
                    </span>
                  )}
                  <Heart className="w-5 h-5 text-pink-500" />
                </div>
              </div>
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {entry.content}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="flex items-center text-gray-600 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
