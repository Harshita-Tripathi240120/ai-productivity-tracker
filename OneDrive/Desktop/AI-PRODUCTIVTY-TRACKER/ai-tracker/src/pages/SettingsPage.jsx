import React, { useContext } from "react";
import Card from "../components/ui/Card";
import SettingsRow from "../components/ui/SettingsRow";
import ToggleSwitch from "../components/ui/ToggleSwitch";
import { ThemeContext } from "../context/ThemeContext";
import { ChevronDown } from "lucide-react";

const SettingsPage = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <main className="flex-1 p-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
        Settings
      </h1>
      <div className="space-y-8 max-w-4xl mx-auto">
        <Card>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
            General
          </h2>
          <SettingsRow
            label="Dark Mode"
            description="Enable a darker color scheme for the interface."
          >
            <ToggleSwitch
              enabled={theme === "dark"}
              setEnabled={() => setTheme(theme === "dark" ? "light" : "dark")}
            />
          </SettingsRow>
          <SettingsRow
            label="Language"
            description="Choose the display language for the application."
            isLast={true}
          >
            <div className="relative">
              <select className="bg-gray-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg pl-3 pr-8 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>English</option>
                <option>Spanish</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 pointer-events-none"
              />
            </div>
          </SettingsRow>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
            Account
          </h2>
          <SettingsRow
            label="Clear History"
            description="Permanently delete all of your tracked activity and session data."
          >
            <button className="text-sm bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200 dark:bg-red-600/20 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-600/40">
              Clear Data
            </button>
          </SettingsRow>
        </Card>
      </div>
    </main>
  );
};

export default SettingsPage;
