import React, { useRef, useState } from "react";
import { Camera, RefreshCw, Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export const PhotoCapture = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [emotion, setEmotion] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError("");
    } catch (err) {
      setError(
        "Unable to access camera. Please ensure you have granted camera permissions."
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const capturePhoto = async () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setPhoto(dataUrl);
        stopCamera();

        try {
          setIsLoading(true);
          setEmotion("");

          // Convert base64 to blob
          const response = await fetch(dataUrl);
          const blob = await response.blob();

          // Create FormData and append the image
          const formData = new FormData();
          formData.append("file", blob, "photo.jpg");

          // Send to Flask backend
          const apiResponse = await axios.post(
            "http://LOCALHOST:7000/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          setEmotion(apiResponse.data.resopnse);
        } catch (err) {
          setError("Failed to process the image. Please try again.");
          console.error("Error:", err);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    setEmotion("");
    startCamera();
  };

  const downloadPhoto = () => {
    if (photo) {
      const link = document.createElement("a");
      link.href = photo;
      link.download = `photo-${new Date().toISOString()}.jpg`;
      link.click();
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      Happy:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Sad: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Angry: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      Surprise:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Fear: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Disgust:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      Neutral: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return (
      colors[emotion] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Emotion Detection
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Take a photo to analyze your emotional state
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6"
          >
            {error}
            <button onClick={() => setError("")} className="float-right">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="relative aspect-video bg-black">
            <AnimatePresence mode="wait">
              {!photo ? (
                <motion.video
                  key="video"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <motion.img
                  key="photo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={photo}
                  alt="Captured photo"
                  className="w-full h-full object-cover"
                />
              )}
            </AnimatePresence>

            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
              </div>
            )}
          </div>

          {emotion && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium ${getEmotionColor(
                    emotion
                  )}`}
                >
                  Detected Emotion: {emotion}
                </span>
              </div>
            </div>
          )}

          <div className="p-6">
            <div className="flex justify-center gap-4">
              {!photo ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={capturePhoto}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  Take Photo
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={retakePhoto}
                    className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Retake
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadPhoto}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
