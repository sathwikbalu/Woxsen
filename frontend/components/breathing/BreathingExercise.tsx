import React from "react";
import { motion } from "framer-motion";

interface BreathingExerciseProps {
  duration: number;
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
}

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({
  duration,
  inhaleTime,
  holdTime,
  exhaleTime,
}) => {
  const [phase, setPhase] = React.useState<"inhale" | "hold" | "exhale">("inhale");
  const [timeLeft, setTimeLeft] = React.useState(duration);
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    if (!isActive) return;

    const cycleTime = inhaleTime + holdTime + exhaleTime;
    const interval = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 0) {
          clearInterval(interval);
          setIsActive(false);
          return 0;
        }
        return time - 1;
      });

      const currentTime = duration - timeLeft;
      const currentCycleTime = currentTime % cycleTime;

      if (currentCycleTime < inhaleTime) {
        setPhase("inhale");
      } else if (currentCycleTime < inhaleTime + holdTime) {
        setPhase("hold");
      } else {
        setPhase("exhale");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, duration, inhaleTime, holdTime, exhaleTime, timeLeft]);

  const circleVariants = {
    inhale: {
      scale: 1.5,
      transition: { duration: inhaleTime, ease: "easeInOut" },
    },
    hold: {
      scale: 1.5,
      transition: { duration: holdTime },
    },
    exhale: {
      scale: 1,
      transition: { duration: exhaleTime, ease: "easeInOut" },
    },
  };

  const getPhaseEmoji = () => {
    switch (phase) {
      case "inhale":
        return "😤";
      case "hold":
        return "😶";
      case "exhale":
        return "😮‍💨";
      default:
        return "😌";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 dark:text-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8">Box Breathing Exercise</h2>

        <div className="relative mb-12 w-32 h-32 mx-auto">
          <motion.div
            variants={circleVariants}
            animate={isActive ? phase : "exhale"}
            className="w-full h-full bg-indigo-600 rounded-full opacity-20 absolute"
          />
          <motion.div
            variants={circleVariants}
            animate={isActive ? phase : "exhale"}
            className="w-full h-full border-4 border-indigo-600 rounded-full absolute"
          />
          {isActive && (
            <div className="absolute inset-0 flex items-center justify-center text-4xl">
              {getPhaseEmoji()}
            </div>
          )}
        </div>

        {isActive && (
          <div className="text-2xl font-medium mb-8">
            {phase === "inhale" && "Breathe In"}
            {phase === "hold" && "Hold"}
            {phase === "exhale" && "Breathe Out"}
          </div>
        )}

        <button
          onClick={() => {
            setIsActive(!isActive);
            if (!isActive) setTimeLeft(duration);
          }}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {isActive ? "Stop" : "Start Breathing Exercise"}
        </button>

        {timeLeft > 0 && isActive && (
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Time remaining: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </p>
        )}
      </div>
    </div>
  );
};