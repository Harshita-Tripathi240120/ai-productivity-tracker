import React from "react";

const MiniBarChart = ({ data }) => (
  <div className="flex items-end justify-between h-24">
    {data.map((item, i) => (
      <div key={i} className="flex flex-col items-center w-1/12">
        <div
          className="w-full bg-blue-500 rounded-t-sm"
          style={{ height: `${(item.hours / 6) * 100}%` }}
        ></div>
        <span className="text-xs text-gray-500 dark:text-slate-400 mt-1">
          {item.day}
        </span>
      </div>
    ))}
  </div>
);

export default MiniBarChart;
