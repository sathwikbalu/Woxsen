import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
}

export const BubblePop = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("bubblePopHighScore");
    return saved ? parseInt(saved) : 0;
  });

  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEEAD",
    "#D4A5A5",
  ];

  const createBubble = (): Bubble => ({
    id: Math.random(),
    x: Math.random() * (window.innerWidth - 100),
    y: window.innerHeight,
    size: Math.random() * 40 + 20,
    color: colors[Math.floor(Math.random() * colors.length)],
    speed: Math.random() * 2 + 1,
  });

  const popBubble = (id: number) => {
    setBubbles((prev) => prev.filter((bubble) => bubble.id !== id));
    setScore((prev) => prev + 10);

    const audio = new Audio(
      "data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA=="
    );
    audio.play().catch(() => {});
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(60);
    setBubbles([]);
  };

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("bubblePopHighScore", score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    if (!isPlaying) return;

    const bubbleInterval = setInterval(() => {
      setBubbles((prev) => [...prev, createBubble()]);
    }, 1000);

    const moveInterval = setInterval(() => {
      setBubbles((prev) =>
        prev
          .map((bubble) => ({
            ...bubble,
            y: bubble.y - bubble.speed,
          }))
          .filter((bubble) => bubble.y + bubble.size > 0)
      );
    }, 16);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(bubbleInterval);
      clearInterval(moveInterval);
      clearInterval(timer);
    };
  }, [isPlaying]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Bubble Pop
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Pop the bubbles to relieve stress and set new high scores!
        </p>
      </div>

      <div className="relative min-h-[600px] bg-gradient-to-b from-blue-50 to-purple-50 rounded-2xl shadow-xl overflow-hidden">
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="text-lg font-semibold">Score: {score}</span>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="text-lg font-semibold">
              High Score: {highScore}
            </span>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="text-lg font-semibold">Time: {timeLeft}s</span>
          </div>
        </div>

        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-20"
            >
              <div className="bg-white rounded-xl p-8 text-center shadow-lg">
                <h2 className="text-2xl font-bold mb-4">
                  {timeLeft === 0 ? "Game Over!" : "Ready to Play?"}
                </h2>
                {timeLeft === 0 && (
                  <div className="mb-6">
                    <p className="text-xl mb-2">Final Score: {score}</p>
                    {score === highScore && score > 0 && (
                      <p className="text-indigo-600 font-semibold">
                        New High Score! 🎉
                      </p>
                    )}
                  </div>
                )}
                <button
                  onClick={startGame}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {timeLeft === 0 ? "Play Again" : "Start Game"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0">
          <AnimatePresence>
            {bubbles.map((bubble) => (
              <motion.div
                key={bubble.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                style={{
                  position: "absolute",
                  left: bubble.x,
                  top: bubble.y,
                  width: bubble.size,
                  height: bubble.size,
                  backgroundColor: bubble.color,
                }}
                className="rounded-full cursor-pointer shadow-lg"
                onClick={() => popBubble(bubble.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
