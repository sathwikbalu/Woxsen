import React from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import type { Meditation } from "../types";

interface Props {
  meditation: Meditation;
}

export const MeditationPlayer: React.FC<Props> = ({ meditation }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${meditation.imageUrl})` }}
      />

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {meditation.title}
          </h3>
          <p className="text-gray-600">{meditation.duration} minutes</p>
        </div>

        <div className="space-y-2">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={togglePlay}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-gray-800" />
              ) : (
                <Play className="w-8 h-8 text-gray-800" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-gray-600" />
              ) : (
                <Volume2 className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
