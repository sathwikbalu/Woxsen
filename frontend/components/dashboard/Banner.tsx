import React from "react";
import { Link } from "react-router-dom";

export const Banner = () => (
  <Link to="/ai-chat">
    <div className="relative h-64 mb-12 overflow-hidden rounded-2xl cursor-pointer">
      <img
        src="https://wallpapercave.com/wp/wp2316798.jpg"
        alt="Wellness Banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-blue-600/80 mix-blend-multiply" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Chat with Myra!!
          </h2>
          <p className="text-lg md:text-xl">Myra is here to support you</p>
        </div>
      </div>
    </div>
  </Link>
);
