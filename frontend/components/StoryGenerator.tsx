import React from "react";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export const StoryGenerator = () => {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [story, setStory] = React.useState(null); // State to hold the generated story

  const generateStory = async () => {
    setIsGenerating(true);
    const text="Genereate a new motivational story"
    try {
      const response = await fetch("http://LOCALHOST:7000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text }),
      });
      if (response.ok) {
        const data = await response.json(); // Parse JSON response
        setStory(data.text); 
        console.log(data);
      } else {
        console.error("Error in response:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error generating story:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="flex flex-col items-center gap-6">
        <motion.button
          onClick={generateStory}
          disabled={isGenerating}
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity" />
          <div className="flex flex-col items-center gap-4">
            <BookOpen className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {isGenerating ? "Crafting your story..." : "Generate Story"}
            </span>
            {isGenerating && (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent" />
            )}
          </div>
        </motion.button>

        {/* Render the generated story if it exists */}
        {story && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg w-full max-w-2xl text-gray-900 dark:text-white">
            <h2 className="text-2xl font-semibold mb-4">Your Story:</h2>
            <p>{story}</p> {/* Render story text */}
          </div>
        )}
      </div>
    </div>
  );
};
