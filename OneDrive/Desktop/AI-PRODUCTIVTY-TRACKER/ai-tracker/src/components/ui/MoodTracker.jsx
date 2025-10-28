import React, { useState } from "react";
import { Annoyed, Frown, Meh, Smile, Laugh } from "lucide-react";

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const moods = [
    { mood: "Awful", icon: Annoyed },
    { mood: "Bad", icon: Frown },
    { mood: "Okay", icon: Meh },
    { mood: "Good", icon: Smile },
    { mood: "Great", icon: Laugh },
  ];

  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">
        How are you feeling?
      </h4>
      <div className="flex justify-around">
        {moods.map(({ mood, icon: Icon }) => (
          <button
            key={mood}
            onClick={() => setSelectedMood(mood)}
            className={`p-2 rounded-full transition-colors ${
              selectedMood === mood
                ? "bg-blue-600"
                : "hover:bg-gray-200 dark:hover:bg-slate-700"
            }`}
          >
            <Icon
              size={24}
              className={
                selectedMood === mood
                  ? "text-white"
                  : "text-gray-500 dark:text-slate-400"
              }
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodTracker;
