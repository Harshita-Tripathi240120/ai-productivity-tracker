import React, { useState, useEffect } from "react";
import Card from "../components/ui/Card";
import CircularProgress from "../components/ui/CircularProgress";
import { Play, Pause, Square, RotateCcw } from "lucide-react";

const SessionsPage = () => {
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, timeLeft]);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(sessionLength * 60);
    }
  }, [sessionLength, isActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePauseResume = () => setIsPaused(!isPaused);

  const handleStop = () => {
    setIsActive(false);
    setTimeLeft(sessionLength * 60);
  };

  const handleReset = () => {
    if (!isActive) {
      setTimeLeft(sessionLength * 60);
    }
  };

  const sessionsHistory = [
    {
      date: "2025-10-14",
      duration: "1h 30m",
      focusPercentage: 85,
      tags: ["Deep Work", "React Dev"],
    },
    {
      date: "2025-10-13",
      duration: "0h 45m",
      focusPercentage: 60,
      tags: ["Emails", "Admin"],
    },
    {
      date: "2025-10-12",
      duration: "2h 15m",
      focusPercentage: 95,
      tags: ["Deep Work", "API Design"],
    },
  ];

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
        Sessions
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Current Session
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-around">
              <div className="relative w-48 h-48 mb-6 md:mb-0">
                <CircularProgress
                  percentage={
                    ((sessionLength * 60 - timeLeft) / (sessionLength * 60)) *
                    100
                  }
                  size={192}
                  strokeWidth={12}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-mono text-slate-800 dark:text-white">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-slate-400">
                    Goal: Write Code
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-2">
                  {[15, 25, 50].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => {
                        if (!isActive) setSessionLength(mins);
                      }}
                      disabled={isActive}
                      className={`px-3 py-1 text-sm rounded-md ${
                        sessionLength === mins && !isActive
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-300"
                      } disabled:opacity-50`}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleReset}
                    disabled={isActive}
                    className="p-3 bg-gray-200 dark:bg-slate-700 rounded-full hover:bg-gray-300 dark:hover:bg-slate-600 disabled:opacity-50"
                  >
                    <RotateCcw size={20} />
                  </button>
                  {!isActive ? (
                    <button
                      onClick={handleStart}
                      className="px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold flex items-center space-x-2 hover:bg-blue-700"
                    >
                      <Play size={20} />
                      <span>Start</span>
                    </button>
                  ) : (
                    <button
                      onClick={handlePauseResume}
                      className={`px-6 py-3 rounded-full text-lg font-semibold flex items-center space-x-2 ${
                        isPaused
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                    >
                      {isPaused ? <Play size={20} /> : <Pause size={20} />}
                      <span>{isPaused ? "Resume" : "Pause"}</span>
                    </button>
                  )}
                  <button
                    onClick={handleStop}
                    disabled={!isActive}
                    className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 disabled:bg-slate-700"
                  >
                    <Square size={20} />
                  </button>
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Live Session Stats
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-500">92%</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Focus Quality
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-500">3</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Distractions
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  1.2/hr
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Switches
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  85
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Productivity Score
                </p>
              </div>
            </div>
          </Card>
        </div>
        <div className="space-y-8">
          <Card>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              AI Insights
            </h2>
            <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <p>
                ✨ Your focus is highest in the first 15 mins. Try to tackle the
                hardest task then.
              </p>
              <p>⚡️ Distractions are low, keep up the great work!</p>
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Gamification
            </h2>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">
                  🔥 5 Day Deep Work Streak
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Complete one more session today to keep it going!
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-white">
                  🏆 50 Sessions Completed Badge
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  You're a productivity master!
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <Card>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Session History
          </h2>
          <div className="divide-y divide-gray-200 dark:divide-slate-700/50">
            {sessionsHistory.map((session, index) => (
              <div
                key={index}
                className="grid grid-cols-4 items-center py-4 px-2"
              >
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {session.date}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-slate-300">
                    {session.duration}
                  </p>
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  {session.focusPercentage}% Focus
                </div>
                <div className="flex justify-end space-x-2">
                  {session.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
};

export default SessionsPage;
