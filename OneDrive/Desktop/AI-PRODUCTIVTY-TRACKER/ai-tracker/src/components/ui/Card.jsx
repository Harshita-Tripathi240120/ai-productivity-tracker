import React from "react";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200/80 dark:border-slate-800 shadow-sm ${className}`}
  >
    {children}
  </div>
);

export default Card;
