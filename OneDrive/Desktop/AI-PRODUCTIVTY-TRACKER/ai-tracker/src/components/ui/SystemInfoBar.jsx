import React from "react";
import { Monitor, Cpu, Database, Wifi } from "lucide-react";

const SystemInfoBar = () => (
  <div className="bg-white dark:bg-slate-800/50 flex items-center space-x-6 text-xs text-gray-500 dark:text-slate-400 p-2 px-4 rounded-lg border border-gray-200/80 dark:border-slate-700/50">
    <div className="flex items-center space-x-2">
      <Monitor size={14} />
      <span>Windows 11</span>
    </div>
    <div className="flex items-center space-x-2">
      <Cpu size={14} />
      <span>CPU 12%</span>
    </div>
    <div className="flex items-center space-x-2">
      <Database size={14} />
      <span>RAM 4.2/16 GB</span>
    </div>
    <div className="flex items-center space-x-2">
      <Wifi size={14} />
      <span>Connected</span>
    </div>
  </div>
);

export default SystemInfoBar;
