import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Flame, Zap } from "lucide-react";

// UI Components
import Card from "../components/ui/Card";
import ProgressRing from "../components/ui/ProgressRing";
import MiniBarChart from "../components/ui/MiniBarChart";
import MoodTracker from "../components/ui/MoodTracker";
import UserInfo from "../components/ui/UserInfo";
import SystemInfoBar from "../components/ui/SystemInfoBar";

// Focus Components
import FocusModeOverlay from "../components/focus/FocusModeOverlay";
import FocusSessionSummaryModal from "../components/focus/FocusSessionSummaryModal";

const Dashboard = () => {
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [lastSessionStats, setLastSessionStats] = useState(null);

  const weeklyData = [
    { day: "M", hours: 3.5 },
    { day: "T", hours: 4.2 },
    { day: "W", hours: 4.0 },
    { day: "T", hours: 5.1 },
    { day: "F", hours: 3.8 },
    { day: "S", hours: 1.5 },
    { day: "S", hours: 1.2 },
  ];

  const handleCloseFocusMode = (sessionCompleted, stats) => {
    setIsFocusModeActive(false);
    if (sessionCompleted) {
      setLastSessionStats(stats);
      setShowSummaryModal(true);
    }
  };

  return (
    <>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <UserInfo />
            <button
              onClick={() => setIsFocusModeActive(true)}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Start Focus Mode
            </button>
          </div>
        </div>

        <div className="mb-8">
          <SystemInfoBar />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="flex flex-col items-center justify-center text-center">
            <Flame size={24} className="text-orange-400" />
            <p className="text-3xl font-bold mt-2 text-slate-800 dark:text-white">
              5 Days
            </p>
            <h3 className="text-sm text-gray-500 dark:text-slate-400 font-medium">
              Focus Streak
            </h3>
          </Card>
          <Card className="flex flex-col items-center justify-center">
            <ProgressRing percentage={80} />
            <h3 className="text-sm text-gray-500 dark:text-slate-400 font-medium mt-2">
              Daily Goal (3.2h / 4h)
            </h3>
          </Card>
          <Card className="flex flex-col items-center justify-center text-center">
            <Zap size={24} className="text-yellow-400" />
            <p className="text-3xl font-bold mt-2 text-slate-800 dark:text-white">
              Low
            </p>
            <h3 className="text-sm text-gray-500 dark:text-slate-400 font-medium">
              Distraction Score
            </h3>
          </Card>
          <Card className="flex flex-col items-center justify-center text-center">
            <p className="text-3xl font-bold text-slate-800 dark:text-white">
              92
            </p>
            <div className="flex text-yellow-400">★★★★☆</div>
            <h3 className="text-sm text-gray-500 dark:text-slate-400 font-medium">
              Productivity Score
            </h3>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          <Card className="lg:col-span-3">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Weekly Snapshot
            </h3>
            <MiniBarChart data={weeklyData} />
          </Card>
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Today's Timeline
            </h3>
            <div className="relative h-10 bg-gray-200 dark:bg-slate-700/50 rounded-full">
              <div
                className="absolute h-10 bg-blue-500 rounded-l-full"
                style={{ left: "38%", width: "20%" }}
                title="Work"
              ></div>
              <div
                className="absolute h-10 bg-purple-500"
                style={{ left: "58%", width: "6%" }}
                title="Meeting"
              ></div>
              <div
                className="absolute h-10 bg-green-500"
                style={{ left: "64%", width: "4%" }}
                title="Break"
              ></div>
              <div
                className="absolute h-10 bg-blue-500 rounded-r-full"
                style={{ left: "68%", width: "10%" }}
                title="Work"
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-slate-500 mt-2 px-2">
              <span>9am</span>
              <span>12pm</span>
              <span>3pm</span>
              <span>6pm</span>
            </div>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              AI Insights Preview
            </h3>
            <div className="space-y-3 text-sm">
              <p>
                💡 Your focus quality is{" "}
                <span className="text-green-500">15% higher</span> than
                yesterday.
              </p>
              <p>
                🚀 Peak productivity today was between{" "}
                <span className="text-blue-500">9–11 AM.</span>
              </p>
              <NavLink
                to="/insights"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                View detailed insights →
              </NavLink>
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Top Apps Today
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <p>1. VS Code</p>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  Productive
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p>2. Chrome</p>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  Productive
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p>3. Slack</p>
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                  Neutral
                </span>
              </div>
            </div>
          </Card>
          <Card>
            <MoodTracker />
          </Card>
        </div>
      </main>
      {isFocusModeActive && (
        <FocusModeOverlay closeFocusMode={handleCloseFocusMode} />
      )}
      {showSummaryModal && lastSessionStats && (
        <FocusSessionSummaryModal
          isOpen={showSummaryModal}
          onClose={() => setShowSummaryModal(false)}
          stats={lastSessionStats}
        />
      )}
    </>
  );
};

export default Dashboard;
