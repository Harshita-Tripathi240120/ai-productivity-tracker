import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Clock,
  BarChart3,
  Lightbulb,
  Settings,
} from "lucide-react";

const NavItem = ({ icon: Icon, label, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors duration-200 w-full text-left ${
        isActive
          ? "bg-gray-200 dark:bg-slate-700 text-slate-900 dark:text-white"
          : ""
      }`
    }
  >
    <Icon size={20} />
    <span>{label}</span>
  </NavLink>
);

const Sidebar = () => (
  <aside className="w-64 bg-white dark:bg-slate-900 p-6 flex flex-col shrink-0 border-r border-gray-200 dark:border-slate-800">
    <div className="text-2xl font-bold mb-12 text-slate-900 dark:text-white">
      AI Productivity Tracker
    </div>
    <nav className="flex flex-col space-y-3">
      <NavItem icon={LayoutDashboard} label="Dashboard" to="/" />
      <NavItem icon={Clock} label="Sessions" to="/sessions" />
      <NavItem icon={BarChart3} label="Activities" to="/activities" />
      <NavItem icon={Lightbulb} label="Insights" to="/insights" />
      <NavItem icon={Settings} label="Settings" to="/settings" />
    </nav>
  </aside>
);

export default Sidebar;
