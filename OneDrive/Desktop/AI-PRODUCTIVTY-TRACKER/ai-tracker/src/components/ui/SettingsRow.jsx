import React from "react";

const SettingsRow = ({ label, description, children, isLast = false }) => (
  <div
    className={`flex justify-between items-center py-4 ${
      !isLast && "border-b border-gray-200 dark:border-slate-700/50"
    }`}
  >
    <div>
      <p className="font-medium text-slate-800 dark:text-slate-200">{label}</p>
      <p className="text-sm text-gray-500 dark:text-slate-400 max-w-md">
        {description}
      </p>
    </div>
    <div className="shrink-0 ml-6">{children}</div>
  </div>
);

export default SettingsRow;
