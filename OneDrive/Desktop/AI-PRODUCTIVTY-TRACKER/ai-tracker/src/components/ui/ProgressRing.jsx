import React from "react";
import CircularProgress from "./CircularProgress";

const ProgressRing = ({ percentage, size = 100, strokeWidth = 8 }) => {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <CircularProgress
        percentage={percentage}
        size={size}
        strokeWidth={strokeWidth}
        colorClass="text-green-500"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-slate-800 dark:text-white">
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export default ProgressRing;
