import React from "react";
import { Play, Clock, Tag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface YogaVideo {
  id: string;
  title: string;
  duration: string;
  level: string;
  videoUrl: string;
  instructor: string;
  category: string;
}

// Function to extract video ID from YouTube URL
const getYouTubeThumbnail = (videoUrl: string) => {
  const videoIdMatch = videoUrl.match(
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/
  );
  const videoId = videoIdMatch ? videoIdMatch[1] : null;
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
};

const yogaVideos: YogaVideo[] = [
  {
    id: "1",
    title: "Morning Yoga Flow",
    duration: "20 min",
    level: "Beginner",
    videoUrl: "https://www.youtube.com/embed/sTANio_2E0Q",
    instructor: "Sarah Johnson",
    category: "Morning Practice",
  },
  {
    id: "2",
    title: "Stress Relief Yoga",
    duration: "15 min",
    level: "All Levels",
    videoUrl: "https://www.youtube.com/embed/hJbRpHZr_d0",
    instructor: "Michael Chen",
    category: "Stress Relief",
  },
  {
    id: "3",
    title: "Bedtime Yoga Sequence",
    duration: "10 min",
    level: "Beginner",
    videoUrl: "https://www.youtube.com/embed/BiWDsfZ3zbo",
    instructor: "Emma Wilson",
    category: "Evening Practice",
  },
  {
    id: "4",
    title: "Power Yoga Flow",
    duration: "30 min",
    level: "Advanced",
    videoUrl: "https://www.youtube.com/embed/9kOCY0KNByw",
    instructor: "David Miller",
    category: "Power Yoga",
  },
  {
    id: "5",
    title: "Gentle Stretching",
    duration: "25 min",
    level: "Beginner",
    videoUrl: "https://www.youtube.com/embed/g_tea8ZNk5A",
    instructor: "Lisa Anderson",
    category: "Gentle Practice",
  },
  {
    id: "6",
    title: "Core Strength Yoga",
    duration: "30 min",
    level: "Intermediate",
    videoUrl: "https://www.youtube.com/embed/93z3NDIiU2E",
    instructor: "Alex Thompson",
    category: "Core Focus",
  },
];

export const YogaPage = () => {
  const [selectedVideo, setSelectedVideo] = React.useState<YogaVideo | null>(
    null
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Yoga Practice
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Find balance and inner peace with our curated yoga sessions
        </p>
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl"
            >
              <div className="relative">
                <div className="w-full h-[480px] sm:h-[560px] md:h-[640px] lg:h-[720px]">
                  <iframe
                    src={`${selectedVideo.videoUrl}?autoplay=1`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-t-xl"
                  ></iframe>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedVideo.title}
                </h2>
                <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{selectedVideo.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    <span>{selectedVideo.level}</span>
                  </div>
                  <div>
                    <span className="font-medium">Instructor:</span>{" "}
                    {selectedVideo.instructor}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {yogaVideos.map((video) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
          >
            <div
              className="relative h-48 bg-cover bg-center group"
              style={{
                backgroundImage: `url(${getYouTubeThumbnail(video.videoUrl)})`,
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => setSelectedVideo(video)}
                  className="bg-white rounded-full p-4 transform hover:scale-110 transition-transform"
                >
                  <Play className="w-8 h-8 text-indigo-600" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {video.title}
              </h3>
              <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{video.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span>{video.level}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
