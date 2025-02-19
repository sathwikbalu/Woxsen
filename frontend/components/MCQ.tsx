import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Loader2 } from "lucide-react";

const questionsPool = [
  "How often do you feel sad or hopeless for no clear reason?",
  "Do you find it difficult to enjoy things you once loved?",
  "How often do you feel excessively tired despite getting enough sleep?",
  "How frequently do you experience a lack of interest in daily activities?",
  "Do you find it hard to concentrate on tasks, even simple ones?",
  "How often do you feel anxious or on edge for no apparent reason?",
  "How do you handle stressful situations in your life?",
  "How frequently do you feel isolated or lonely, even when around others?",
  "How often do you feel overwhelmed by small tasks?",
  "Do you find it difficult to fall asleep or stay asleep?",
  "How often do you experience mood swings without an identifiable cause?",
  "How do you generally feel about your self-worth?",
  "Do you experience a racing mind or inability to stop worrying?",
  "How often do you feel physically tense (e.g., muscle tightness, headaches)?",
  "How frequently do you procrastinate on important tasks because of fear or anxiety?",
  "How often do you feel irritable or easily frustrated by small things?",
  "Have you lost or gained significant weight without intending to?",
  "How often do you engage in activities that help you relax or unwind?",
  "Do you avoid social situations because of fear or discomfort?",
  "How often do you feel detached or numb, as if watching life from the outside?",
  "How often do you have intrusive thoughts that you find distressing?",
  "How often do you feel like giving up on things you care about?",
  "Do you ever feel that life isn’t worth living?",
  "How often do you compare yourself negatively to others?",
  "Do you feel like you’re not meeting expectations (yours or others)?",
  "How often do you feel like your emotions are out of control?",
  "How often do you engage in self-criticism or negative self-talk?",
  "How frequently do you feel disconnected from reality or those around you?",
  "How often do you feel guilty about things beyond your control?",
  "How frequently do you feel a lack of energy, even after resting?",
  "How often do you feel like you can’t trust others?",
  "Do you have someone you can talk to about your feelings when needed?",
  "How often do you feel that people don’t understand what you’re going through?",
  "How often do you feel like you have no purpose in life?",
  "How often do you feel trapped by your current circumstances?",
  "How often do you seek professional help when feeling mentally unwell?",
  "How frequently do you experience feelings of guilt or regret over past actions?",
  "How often do you feel like you are losing control over your thoughts?",
  "Do you feel the need to escape from your responsibilities frequently?",
  "How often do you feel emotionally numb or detached from your emotions?",
  "How often do you feel overly critical of your achievements?",
  "How frequently do you worry about what others think of you?",
  "How often do you fear that something bad will happen, even when it’s unlikely?",
  "How often do you feel bored or uninterested in most things around you?",
  "Do you experience difficulty in maintaining relationships or friendships?",
  "How frequently do you get angry or upset without knowing why?",
  "How often do you feel that you are a burden to others?",
  "How often do you feel panic or fear in situations that seem ordinary?",
  "How often do you feel helpless when dealing with problems?",
  "How frequently do you find yourself avoiding responsibilities or commitments?",
];

const descriptiveQuestions = [
  "Can you describe a recent situation where you felt extremely anxious or overwhelmed? How did you manage it?",
  "When you're feeling down or stressed, what activities or strategies help you feel better?",
  "Have there been any changes in your daily routine or behavior recently that you've noticed? If so, what are they?",
  "What kind of support do you feel you need right now to improve your mental well-being?",
];

const options = ["Never", "Rarely", "Sometimes", "Often", "Always"];

const getCondition = (score) => {
  if (score >= 80)
    return { text: "Good Mental Health", color: "text-green-500" };
  if (score >= 60)
    return { text: "Mild Mental Health Concerns", color: "text-yellow-500" };
  if (score >= 40)
    return {
      text: "Moderate Mental Health Concerns",
      color: "text-orange-500",
    };
  return { text: "Significant Mental Health Concerns", color: "text-red-500" };
};

export const MCQ = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<number[]>([]);
  const [descriptiveResponses, setDescriptiveResponses] = useState<string[]>(
    Array(4).fill("")
  );
  const [score, setScore] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const shuffledQuestions = questionsPool
      .sort(() => 0.5 - Math.random())
      .slice(0, 15);
    setQuestions(shuffledQuestions);
    setResponses(Array(15).fill(0));
  }, []);

  const handleChange = (index: number, value: string) => {
    const pointsMapping = [5, 4, 3, 2, 1]; // Points corresponding to Never, Rarely, Sometimes, Often, Always
    const newResponses = [...responses];
    newResponses[index] = pointsMapping[parseInt(value) - 1]; // Map the selected option to points
    setResponses(newResponses);
  };

  const handleDescriptiveChange = (index: number, value: string) => {
    const newDescriptiveResponses = [...descriptiveResponses];
    newDescriptiveResponses[index] = value;
    setDescriptiveResponses(newDescriptiveResponses);
  };

  const analyzeText = async (text: string) => {
    try {
      const response = await axios.post(
        "https://d3f2-35-240-254-25.ngrok-free.app/analyze-text",
        { text }
      );
      console.log(response);
      console.log(response.data.score);
      return response.data.score || 0;
    } catch (error) {
      console.error("Error analyzing text:", error);
      return 0;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    try {
      // Analyze all descriptive responses
      const textScores = await Promise.all(
        descriptiveResponses.map((text) => analyzeText(text))
      );

      const mcqScore = responses.reduce((acc, curr) => acc + curr, 0); // Summing up MCQ scores with the new point system
      const textTotalScore = textScores.reduce((acc, curr) => acc + curr, 0);
      const totalScore = Math.min(
        Math.round(((mcqScore + textTotalScore) / 100) * 100),
        100
      );

      setScore(totalScore);
      setShowResult(true);

      // POST request to backend
      await axios.post("http://localhost:5000/api/submit-score", {
        score: totalScore,
      });
    } catch (error) {
      console.error("Error submitting assessment:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Mental Health Assessment
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Please answer honestly to help us understand your mental well-being
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((question, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <p className="text-lg text-gray-900 dark:text-white mb-4">
              {index + 1}. {question}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {options.map((option, optIndex) => (
                <label
                  key={optIndex}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={optIndex + 1}
                    onChange={(e) => handleChange(index, e.target.value)}
                    required
                    className="form-radio text-indigo-600"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {descriptiveQuestions.map((question, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <p className="text-lg text-gray-900 dark:text-white mb-4">
              {questions.length + index + 1}. {question}
            </p>
            <textarea
              value={descriptiveResponses[index]}
              onChange={(e) => handleDescriptiveChange(index, e.target.value)}
              required
              className="w-full h-32 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Type your answer here..."
            />
          </div>
        ))}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isAnalyzing}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <span>Submit Assessment</span>
            )}
          </button>
        </div>
      </form>

      {showResult && score !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <span className="text-5xl font-bold text-gray-900 dark:text-white">
                {score}
              </span>
              <span className="text-lg text-gray-600 dark:text-gray-300">
                /100
              </span>
            </div>

            <h2
              className={`text-2xl font-bold text-center mb-4 ${
                getCondition(score).color
              }`}
            >
              {getCondition(score).text}
            </h2>

            <button
              onClick={() => setShowResult(false)}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors mt-4"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MCQ;