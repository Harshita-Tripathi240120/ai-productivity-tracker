import React, { useState } from "react";
import Card from "../components/ui/Card";
import { Sparkles } from "lucide-react";
import { callGeminiAPI } from "../api/geminiAPI";

// Chart Components (assuming they are in ui folder)
const FocusLineChart = ({ data, goal }) => (
  <div className="relative h-56">
    <div className="absolute top-[25%] left-0 right-0 border-t border-dashed border-gray-300 dark:border-slate-600">
      <span className="absolute -top-2.5 right-0 text-xs text-gray-500 dark:text-slate-500 bg-white dark:bg-slate-800 px-1">
        Goal: {goal}h
      </span>
    </div>

    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 150"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
        </linearGradient>
      </defs>

      <polyline
        fill="url(#chartGradient)"
        stroke="none"
        points={`0,150 ${data
          .map(
            (d, i) =>
              `${(i / (data.length - 1)) * 300},${
                150 - (d.value / (goal * 1.5)) * 150
              }`
          )
          .join(" ")} 300,150`}
      />
      <polyline
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        points={data
          .map(
            (d, i) =>
              `${(i / (data.length - 1)) * 300},${
                150 - (d.value / (goal * 1.5)) * 150
              }`
          )
          .join(" ")}
      />
    </svg>
    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 dark:text-slate-400">
      {data.map((d) => (
        <span key={d.label}>{d.label}</span>
      ))}
    </div>
  </div>
);

const ProductivityHeatmap = () => {
  return (
    <div className="flex space-x-2">
      <div className="flex flex-col text-xs text-gray-500 dark:text-slate-500 justify-around shrink-0 pt-4">
        {["M", "W", "F"].map((day) => (
          <div key={day} className="h-1/2">
            {day}
          </div>
        ))}
      </div>
      <div className="w-full">
        <div className="grid grid-cols-12 gap-1 w-full">
          {Array.from({ length: 7 * 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200 dark:bg-slate-700 rounded-sm"
              style={{ opacity: Math.random() }}
            ></div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-slate-500 mt-1">
          <span>6am</span>
          <span>12pm</span>
          <span>6pm</span>
        </div>
      </div>
    </div>
  );
};

const ActivityPieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;
  const gradients = data.map((item) => {
    const percent = (item.value / total) * 100;
    const start = cumulativePercent;
    cumulativePercent += percent;
    return `${item.color} ${start}% ${cumulativePercent}%`;
  });

  return (
    <div className="flex items-center space-x-6">
      <div
        className="w-32 h-32 rounded-full"
        style={{ background: `conic-gradient(${gradients.join(", ")})` }}
      ></div>
      <div className="text-sm space-y-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-slate-700 dark:text-slate-300">
              {item.label} ({((item.value / total) * 100).toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Page Component
const InsightsPage = () => {
  const [suggestions, setSuggestions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const focusTrendData = [
    { label: "Mon", value: 3.5 },
    { label: "Tue", value: 4.2 },
    { label: "Wed", value: 4.0 },
    { label: "Thu", value: 5.1 },
    { label: "Fri", value: 3.8 },
    { label: "Sat", value: 1.5 },
    { label: "Sun", value: 1.2 },
  ];

  const appUsageData = [
    { label: "VS Code", value: 45, color: "#3b82f6" },
    { label: "Chrome", value: 25, color: "#22c55e" },
    { label: "Slack", value: 15, color: "#eab308" },
    { label: "Spotify", value: 10, color: "#64748b" },
    { label: "Other", value: 5, color: "#ef4444" },
  ];

  const handleGenerateSuggestions = async () => {
    setIsGenerating(true);
    setSuggestions("");
    const prompt = `Based on this productivity data:
        - Focus Trend: Peak on Thursday (5.1h), low on weekends. Goal is 4h.
        - App Usage: VS Code is top productive app. Top distraction might be grouped under 'Other'.
        - Context Switches: Averaging 8/hour.
        - Peak Window: Identified as 10 AM - 1 PM.
        - Streak: 4 days hitting daily goal.
        Provide 3 actionable, bulleted recommendations to improve productivity, referencing the user's specific data points. Keep it encouraging.`;
    const result = await callGeminiAPI(prompt);
    setSuggestions(result);
    setIsGenerating(false);
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Insights
        </h1>
        <div className="flex space-x-2">
          <button className="text-sm border border-gray-300 dark:border-slate-600 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200">
            Export PDF
          </button>
          <button className="text-sm border border-gray-300 dark:border-slate-600 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200">
            Share Summary
          </button>
        </div>
      </div>
      {/* Top Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <h3 className="text-sm text-gray-500 dark:text-slate-400 font-medium">
            Focus Quality
          </h3>
          <p className="text-3xl font-bold mt-2 text-green-500">High</p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
            +12% vs last week
          </p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-500 dark:text-slate-400 font-medium">
            Deep Work Ratio
          </h3>
          <p className="text-3xl font-bold mt-2 text-slate-800 dark:text-white">
            65%
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
            Goal: 60%
          </p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-500 dark:text-slate-400 font-medium">
            Context Switching
          </h3>
          <p className="text-3xl font-bold mt-2 text-yellow-500">8/hr</p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
            vs 10/hr last week
          </p>
        </Card>
        <Card>
          <h3 className="text-sm text-gray-500 dark:text-slate-400 font-medium">
            Goal Streak
          </h3>
          <p className="text-3xl font-bold mt-2 text-slate-800 dark:text-white">
            4 Days
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
            Goal completion: 80%
          </p>
        </Card>
      </div>
      {/* Middle Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <Card className="lg:col-span-3">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Focus & Deep Work Trend (Weekly)
          </h3>
          <FocusLineChart data={focusTrendData} goal={4} />
        </Card>
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            App Usage Analysis
          </h3>
          <ActivityPieChart data={appUsageData} />
          <div className="mt-4 text-sm space-y-2">
            <p>
              <span className="font-semibold text-green-600">
                Top Productive:
              </span>{" "}
              VS Code
            </p>
            <p>
              <span className="font-semibold text-red-600">
                Top Distraction:
              </span>{" "}
              YouTube
            </p>
          </div>
        </Card>
      </div>
      {/* Bottom Row Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            Peak Productivity Windows
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
            Heatmap showing your most productive hours. Darker means more focus.
          </p>
          <ProductivityHeatmap />
          <div className="mt-4 text-sm">
            Your golden hours seem to be{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              10:00 AM - 1:00 PM
            </span>
            .
          </div>
        </Card>
        <Card>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                AI-Powered Recommendations
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Personalized tips to boost your focus.
              </p>
            </div>
            <button
              onClick={handleGenerateSuggestions}
              disabled={isGenerating}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 disabled:bg-slate-500 transition-colors duration-200 inline-flex items-center space-x-2 shrink-0"
            >
              <Sparkles size={16} />
              <span>{isGenerating ? "Analyzing..." : "Generate ✨"}</span>
            </button>
          </div>
          {isGenerating && !suggestions && (
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Generating personalized suggestions...
            </p>
          )}
          {!isGenerating && !suggestions && (
            <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-8">
              Click 'Generate' to get AI recommendations based on your activity.
            </p>
          )}
          {suggestions && (
            <div
              className="text-sm text-slate-700 dark:text-slate-300 prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: suggestions.replace(/\n/g, "<br />"),
              }}
            ></div>
          )}
        </Card>
      </div>
    </main>
  );
};

export default InsightsPage;
