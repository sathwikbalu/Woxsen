import React from "react";
import { Play, Pause, Clock, Tag, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import type { Meditation } from "../../types";

const meditations: Meditation[] = [
  {
    id: "1",
    title: "Morning Mindfulness",
    duration: 10,
    category: "Mindfulness",
    imageUrl:
      "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=800",
    audioUrl:
      "https://cdn.pixabay.com/download/audio/2023/03/01/audio_12e72d8a3.mp3",
  },
  {
    id: "2",
    title: "Stress Relief",
    duration: 15,
    category: "Anxiety",
    imageUrl:
      "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&q=80&w=800",
    audioUrl:
      "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3",
  },
  {
    id: "3",
    title: "Deep Sleep",
    duration: 20,
    category: "Sleep",
    imageUrl:
      "https://images.unsplash.com/photo-1511295742362-92c96b1cf484?auto=format&fit=crop&q=80&w=800",
    audioUrl:
      "https://cdn.pixabay.com/download/audio/2023/05/02/audio_f43ed0.mp3",
  },
  {
    id: "4",
    title: "Focused Energy",
    duration: 12,
    category: "Focus",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
    audioUrl:
      "https://cdn.pixabay.com/download/audio/2023/07/12/audio_237d98.mp3",
  },
  {
    id: "5",
    title: "Gentle Awakening",
    duration: 8,
    category: "Mindfulness",
    imageUrl:
      "https://images.unsplash.com/photo-1527596422840-95237a21f62e?auto=format&fit=crop&q=80&w=800",
    audioUrl:
      "https://cdn.pixabay.com/download/audio/2023/08/03/audio_73d9.mp3",
  },
  {
    id: "6",
    title: "Peaceful Evening",
    duration: 18,
    category: "Stress Relief",
    imageUrl:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800",
    audioUrl:
      "https://cdn.pixabay.com/download/audio/2023/09/02/audio_41d8.mp3",
  },
];

const categories = [
  "All",
  "Mindfulness",
  "Anxiety",
  "Sleep",
  "Focus",
  "Stress Relief",
];

export const MeditationList = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [playing, setPlaying] = React.useState<string | null>(null);
  const [isMuted, setIsMuted] = React.useState(false);
  const audioRefs = React.useRef<{ [key: string]: HTMLAudioElement }>({});

  const filteredMeditations = meditations.filter(
    (meditation) =>
      selectedCategory === "All" || meditation.category === selectedCategory
  );

  const togglePlay = (id: string) => {
    if (playing === id) {
      audioRefs.current[id].pause();
      setPlaying(null);
    } else {
      if (playing) {
        audioRefs.current[playing].pause();
      }
      audioRefs.current[id].play();
      setPlaying(id);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    Object.values(audioRefs.current).forEach((audio) => {
      audio.muted = !isMuted;
    });
  };

  React.useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach((audio) => audio.pause());
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Find Your Peace
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Discover guided meditations to help you relax, focus, and sleep better
        </p>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <button
          onClick={toggleMute}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          ) : (
            <Volume2 className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMeditations.map((meditation) => (
          <motion.div
            key={meditation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
          >
            <div
              className="h-48 bg-cover bg-center relative group"
              style={{ backgroundImage: `url(${meditation.imageUrl})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => togglePlay(meditation.id)}
                  className="bg-white rounded-full p-4 transform hover:scale-110 transition-transform"
                >
                  {playing === meditation.id ? (
                    <Pause className="w-8 h-8 text-indigo-600" />
                  ) : (
                    <Play className="w-8 h-8 text-indigo-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {meditation.title}
              </h3>

              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{meditation.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span>{meditation.category}</span>
                </div>
              </div>
            </div>

            <audio
              ref={(el) => {
                if (el) audioRefs.current[meditation.id] = el;
              }}
              src={meditation.audioUrl}
              loop
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
