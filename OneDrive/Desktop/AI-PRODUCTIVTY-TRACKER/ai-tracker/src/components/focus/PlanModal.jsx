import React from "react";

const PlanModal = ({ isOpen, onClose, plan, isLoading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">2-Hour Work Plan</h2>
        <div className="bg-slate-700/50 p-4 rounded-lg min-h-[120px] text-left">
          {isLoading ? (
            <p className="text-sm text-slate-400">Generating plan...</p>
          ) : (
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: plan.replace(/\n/g, "<br />"),
              }}
            />
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-6 border border-slate-600 w-full py-2 rounded-lg text-sm hover:bg-slate-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PlanModal;
