import React from "react";

const Skeleton = ({ className = "", width = "full", height = "6", circle = false }) => {
  const widthClass = width === "full" ? "w-full" : `w-${width}`;
  const heightClass = height === "full" ? "h-full" : `h-${height}`;
  
  return (
    <div
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse ${
        circle ? "rounded-full" : "rounded-lg"
      } ${widthClass} ${heightClass} ${className}`}
      style={{
        backgroundSize: "200% 100%",
        animation: "pulse 2s infinite, shimmer 2s infinite"
      }}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default Skeleton;