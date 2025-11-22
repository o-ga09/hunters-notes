import React from "react";

export const Loader: React.FC = () => {
  return (
    <div className="relative w-24 h-24">
      <div className="absolute inset-0 border-4 border-stone-800 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-yellow-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-2 border-4 border-stone-700 rounded-full opacity-50"></div>
      <div
        className="absolute inset-2 border-4 border-b-orange-700 border-t-transparent border-l-transparent border-r-transparent rounded-full animate-spin"
        style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
      ></div>

      {/* Center Emblem */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-yellow-900 rotate-45 transform shadow-lg border border-yellow-600"></div>
      </div>
    </div>
  );
};
