import React, { useState, useMemo } from "react";
import Card from "../components/ui/Card";
import {
  Search,
  Briefcase,
  MessageSquare,
  Clock,
  Tv,
  Coffee,
  Zap,
} from "lucide-react";

const MOCK_ACTIVITIES = [
  {
    id: 1,
    app: "VS Code",
    title: "Refactor API services",
    category: "Work",
    start: 9.25,
    end: 10.5,
    note: "Focused on performance improvements.",
  },
  {
    id: 2,
    app: "Slack",
    title: "Team Sync",
    category: "Communication",
    start: 10.5,
    end: 10.75,
  },
  {
    id: 3,
    app: "Chrome",
    title: "Researching SWR",
    category: "Work",
    start: 10.75,
    end: 11.5,
  },
  {
    id: 4,
    app: "Idle",
    title: "AFK",
    category: "Breaks",
    start: 11.5,
    end: 11.75,
  },
  {
    id: 5,
    app: "VS Code",
    title: "Implementing new hook",
    category: "Work",
    start: 11.75,
    end: 13.0,
  },
  {
    id: 6,
    app: "Spotify",
    title: "Lofi Beats",
    category: "Entertainment",
    start: 9.25,
    end: 13.0,
  },
  {
    id: 7,
    app: "Lunch",
    title: "Lunch Break",
    category: "Breaks",
    start: 13.0,
    end: 13.75,
  },
  {
    id: 8,
    app: "YouTube",
    title: "React Conf videos",
    category: "Entertainment",
    start: 13.75,
    end: 14.25,
  },
  {
    id: 9,
    app: "Google Meet",
    title: "Design Review",
    category: "Meetings",
    start: 14.5,
    end: 15.5,
    note: "Discussed new dashboard layout.",
  },
  {
    id: 10,
    app: "Figma",
    title: "Updating Components",
    category: "Work",
    start: 15.5,
    end: 16.75,
  },
];

const CATEGORY_STYLES = {
  Work: { color: "bg-blue-500", icon: Briefcase },
  Communication: { color: "bg-yellow-500", icon: MessageSquare },
  Meetings: { color: "bg-purple-500", icon: Clock },
  Entertainment: { color: "bg-red-500", icon: Tv },
  Breaks: { color: "bg-green-500", icon: Coffee },
};

const ActivityTimelineItem = ({ activity }) => {
  const { color, icon: Icon } = CATEGORY_STYLES[activity.category] || {
    color: "bg-slate-500",
    icon: Zap,
  };

  const formatTime = (decimalHour) => {
    const hours = Math.floor(decimalHour);
    const minutes = Math.round((decimalHour - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="py-3 px-4 hover:bg-gray-100 dark:hover:bg-slate-800/50 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${color}/20`}>
          <Icon size={16} className={`${color.replace("bg-", "text-")}-500`} />
        </div>
        <div className="flex-1">
          <p className="font-medium text-slate-800 dark:text-slate-200">
            {activity.app} -{" "}
            <span className="text-gray-500 dark:text-slate-400 font-normal">
              {activity.title}
            </span>
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-500">
            {formatTime(activity.start)} - {formatTime(activity.end)}
          </p>
        </div>
        {activity.note && (
          <MessageSquare
            size={14}
            className="text-gray-400 dark:text-slate-500"
            title={activity.note}
          />
        )}
      </div>
    </div>
  );
};

const ActivitiesPage = () => {
  const [view, setView] = useState("Daily");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredActivities = useMemo(() => {
    return MOCK_ACTIVITIES.filter(
      (activity) =>
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.app.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Activities
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-200 dark:bg-slate-800 p-1 rounded-lg">
            {["Daily", "Weekly", "Monthly"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 text-sm rounded-md ${
                  view === v
                    ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    : "text-gray-500 dark:text-slate-400"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <button className="text-sm border border-gray-300 dark:border-slate-600 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
            Export CSV
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="!p-4">
          <h3 className="text-sm text-gray-500 dark:text-slate-400">
            Total Work Time
          </h3>
          <p className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">
            4h 52m
          </p>
        </Card>
        <Card className="!p-4">
          <h3 className="text-sm text-gray-500 dark:text-slate-400">
            Deep Work
          </h3>
          <p className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">
            3h 10m
          </p>
        </Card>
        <Card className="!p-4">
          <h3 className="text-sm text-gray-500 dark:text-slate-400">
            Distractions
          </h3>
          <p className="text-2xl font-bold mt-1 text-red-500 dark:text-red-400">
            30m
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                Activity Timeline
              </h2>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-100 dark:bg-slate-700/50 rounded-lg pl-9 pr-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              {filteredActivities.map((act) => (
                <ActivityTimelineItem key={act.id} activity={act} />
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Session Highlights
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-slate-400">
                  Longest focus session
                </span>
                <span className="font-medium text-slate-800 dark:text-white">
                  1h 15m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-slate-400">
                  Idle / AFK time
                </span>
                <span className="font-medium text-slate-800 dark:text-white">
                  15m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-slate-400">
                  Total Focus Sessions
                </span>
                <span className="font-medium text-slate-800 dark:text-white">
                  3
                </span>
              </div>
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Stats by Category
            </h2>
            <div className="space-y-3">
              {Object.entries(CATEGORY_STYLES).map(([cat, { color }]) => {
                const percentage = Math.floor(Math.random() * 60) + 10;
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700 dark:text-slate-300">
                        {cat}
                      </span>
                      <span className="text-gray-500 dark:text-slate-400">
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full">
                      <div
                        className={`h-2 ${color} rounded-full`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default ActivitiesPage;
