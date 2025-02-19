import React, { useEffect } from "react";
import { Target, CheckCircle, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import type { Goal } from "../../types";

export const GoalTracker = () => {
  const [goals, setGoals] = React.useState<Goal[]>([]);
  const [isAddingGoal, setIsAddingGoal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [newGoal, setNewGoal] = React.useState({
    title: "",
    description: "",
    targetDays: 21,
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get("http://LOCALHOST:5000/api/goals");
      setGoals(response.data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;

    try {
      const response = await axios.post("http://LOCALHOST:5000/api/goals", {
        title: newGoal.title.trim(),
        description: newGoal.description.trim(),
        targetDays: newGoal.targetDays,
      });

      setGoals([response.data, ...goals]);
      setNewGoal({ title: "", description: "", targetDays: 21 });
      setIsAddingGoal(false);
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  };

  const completeDay = async (goalId: string) => {
    try {
      const response = await axios.patch(
        `http://LOCALHOST:5000/api/goals/${goalId}/progress`
      );
      const updatedGoal = response.data;

      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal._id === updatedGoal._id ? updatedGoal : goal
        )
      );
    } catch (error) {
      console.error("Error updating goal progress:", error);
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Goal Tracker</h1>
        <p className="text-lg text-gray-600">
          Build healthy habits and track your progress
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isAddingGoal ? (
          <motion.button
            key="add-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAddingGoal(true)}
            className="w-full bg-white rounded-xl shadow-md p-6 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50 transition-colors mb-8"
          >
            <Target className="w-5 h-5" />
            Set New Goal
          </motion.button>
        ) : (
          <motion.form
            key="add-form"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-md p-6 mb-8"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, title: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Daily Meditation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                  placeholder="Why do you want to achieve this goal?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Days
                </label>
                <input
                  type="number"
                  value={newGoal.targetDays}
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      targetDays: parseInt(e.target.value),
                    })
                  }
                  min="1"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsAddingGoal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Goal
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence>
        <div className="space-y-6">
          {goals.map((goal) => (
            <motion.div
              key={goal._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {goal.title}
                </h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Day {goal.completedDays} of {goal.targetDays}
                  </span>
                </div>
              </div>

              {goal.description && (
                <p className="text-gray-600 mb-6">{goal.description}</p>
              )}

              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                      Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-indigo-600">
                      {Math.round((goal.completedDays / goal.targetDays) * 100)}
                      %
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                  <div
                    style={{
                      width: `${(goal.completedDays / goal.targetDays) * 100}%`,
                    }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => completeDay(goal._id)}
                  disabled={goal.completedDays >= goal.targetDays}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-5 h-5" />
                  Complete Today
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};
