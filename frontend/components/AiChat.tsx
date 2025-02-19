import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Bot, Loader2, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  content: string;
  type: "user" | "ai";
  timestamp: Date;
}

interface Category {
  title: string;
  items: string[];
}

export const AiChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setTranscript(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript("");
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  const formatAIResponse = (text: string): JSX.Element => {
    const segments = text.split("*").filter(Boolean);
    const formattedContent: JSX.Element[] = [];

    segments.forEach((segment, index) => {
      const trimmedSegment = segment.trim();
      if (index % 2 === 0) {
        // Even indices are titles (bold)
        formattedContent.push(
          <h3
            key={`title-${index}`}
            className="text-lg font-bold text-white-900 dark:text-white mb-2"
          >
            {trimmedSegment}
          </h3>
        );
      } else {
        // Odd indices are list items
        const items = trimmedSegment.split("\n").filter(Boolean);
        formattedContent.push(
          <ul key={`list-${index}`} className="mb-4 space-y-2">
            {items.map((item, itemIndex) => (
              <li
                key={`item-${itemIndex}`}
                className="flex items-start gap-2 text-white-700 dark:text-white-300"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        );
      }
    });

    return <div className="space-y-4">{formattedContent}</div>;
  };

  const handleSend = async () => {
    if (!transcript.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: transcript,
      type: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setTranscript("");

    try {
      const response = await fetch("http://LOCALHOST:7000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from AI.");
      }

      const data = await response.json();
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: data.text || "I'm sorry, I couldn't process that request.",
        type: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      speakResponse(aiMessage.content);
    } catch (error) {
      console.error("Error calling Flask API:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "An error occurred. Please try again later.",
          type: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakResponse = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          AI Assistant
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Speak or type to interact with your AI companion
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4">
          <div className="relative">
            <motion.div
              animate={{
                scale: isSpeaking ? [1, 1.2, 1] : 1,
                transition: { repeat: Infinity, duration: 1.5 },
              }}
              className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center"
            >
              <Bot className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </motion.div>
            {isSpeaking && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute -right-1 -top-1"
              >
                <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </motion.div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Assistant
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Always here to help
            </p>
          </div>
        </div>

        <div
          ref={chatContainerRef}
          className="h-[500px] overflow-y-auto p-6 space-y-4"
        >
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.type === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  {message.type === "ai" ? (
                    formatAIResponse(message.content)
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="relative">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Say something..."
              className="w-full px-4 py-2 pr-24 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none dark:bg-gray-700 dark:text-white"
              rows={3}
            />
            <div className="absolute bottom-2 right-2 flex gap-2">
              <button
                onClick={toggleListening}
                className={`p-2 rounded-full transition-colors ${
                  isListening
                    ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                }`}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={handleSend}
                disabled={!transcript.trim() || isLoading}
                className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
