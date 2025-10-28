import React, { useState, useEffect } from "react";
import { Play, Pause, Square } from "lucide-react";
import CircularProgress from "../ui/CircularProgress";

const FocusModeOverlay = ({ closeFocusMode }) => {
  const [sessionLength, setSessionLength] = useState(25 * 60); // 25 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(sessionLength);
  const [isActive, setIsActive] = useState(false);
  const [distractionAttempts, setDistractionAttempts] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      closeFocusMode(true, {
        duration: sessionLength / 60,
        distractions: distractionAttempts,
        focusScore: Math.round(
          (1 - distractionAttempts / (sessionLength / 60)) * 100
        ),
      });
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, closeFocusMode, sessionLength, distractionAttempts]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const percentage = ((sessionLength - timeLeft) / sessionLength) * 100;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center z-50 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Focus Mode: Active</h1>
        <p className="text-slate-400 mt-2">
          "Stay focused, you’re doing great 💪"
        </p>
      </div>
      <div className="relative w-72 h-72 my-12">
        <CircularProgress percentage={percentage} size={288} strokeWidth={12} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-mono">{formatTime(timeLeft)}</span>
          <span className="text-lg text-slate-300">Time Remaining</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className="px-8 py-3 bg-blue-600 rounded-lg text-lg font-semibold flex items-center space-x-2 hover:bg-blue-700"
        >
          {isActive ? <Pause size={20} /> : <Play size={20} />}
          <span>{isActive ? "Pause" : "Start"}</span>
        </button>
        <button
          onClick={() => closeFocusMode(false)}
          className="px-8 py-3 bg-red-600/80 rounded-lg text-lg font-semibold flex items-center space-x-2 hover:bg-red-700"
        >
          <Square size={20} />
          <span>End Session</span>
        </button>
      </div>
      <div className="mt-8 text-center">
        <h3 className="text-lg font-semibold">Distraction Attempts</h3>
        <p className="text-2xl font-bold text-yellow-400 mt-1">
          {distractionAttempts}
        </p>
        <button
          onClick={() => setDistractionAttempts((d) => d + 1)}
          className="text-xs text-slate-500 mt-2 border border-slate-600 px-2 py-1 rounded"
        >
          (Simulate Distraction)
        </button>
      </div>
    </div>
  );
};

export default FocusModeOverlay;
