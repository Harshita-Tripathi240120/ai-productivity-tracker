import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AppLayout = () => (
  <div className="min-h-screen flex bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-300 font-sans">
    <Sidebar />
    <main className="flex-1 bg-gray-50 dark:bg-slate-900/50 overflow-y-auto">
      <Outlet />
    </main>
  </div>
);

export default AppLayout;
