import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { callGeminiAPI } from "../../api/geminiAPI";

const FocusSessionSummaryModal = ({ isOpen, onClose, stats }) => {
  const [insight, setInsight] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateInsight = async () => {
    setIsLoading(true);
    const prompt = `A user just completed a ${stats.duration} minute focus session. They had ${stats.distractions} distraction attempts and achieved a focus score of ${stats.focusScore}%. Provide a short, encouraging, one-sentence insight based on this data.`;
    const result = await callGeminiAPI(prompt);
    setInsight(result);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 text-slate-800 dark:text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Focus Session Summary</h2>
        <div className="grid grid-cols-3 gap-4 my-6">
          <div>
            <p className="text-3xl font-bold">
              {stats.duration}
              <span className="text-lg">min</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Duration
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-red-500">
              {stats.distractions}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Distractions
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-500">
              {stats.focusScore}%
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Focus Score
            </p>
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-slate-700/50 p-4 rounded-lg min-h-[80px]">
          <h3 className="font-semibold mb-2">AI Insight</h3>
          {isLoading && (
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Generating...
            </p>
          )}
          {insight ? (
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {insight}
            </p>
          ) : (
            !isLoading && (
              <p className="text-sm text-gray-400 dark:text-slate-500">
                Click below to get a personalized insight.
              </p>
            )
          )}
        </div>
        <div className="flex space-x-4 mt-6">
          <button
            onClick={handleGenerateInsight}
            disabled={isLoading}
            className="bg-blue-600 text-white w-full py-2 rounded-lg text-sm hover:bg-blue-700 disabled:bg-slate-500 inline-flex items-center justify-center space-x-2"
          >
            <Sparkles size={16} />
            <span>Get AI Insight ✨</span>
          </button>
          <button
            onClick={onClose}
            className="border border-gray-300 dark:border-slate-600 w-full py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusSessionSummaryModal;
