import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { callGeminiAPI } from "./api/geminiAPI";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import ActivitiesPage from "./pages/ActivitiesPage";
import SessionsPage from "./pages/SessionsPage";
import InsightsPage from "./pages/InsightsPage";
import SettingsPage from "./pages/SettingsPage";

// Modals
import PlanModal from "./components/focus/PlanModal";

// Main App Component
function AppContent() {
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState("");
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // This function was originally in App, but it's not used by any
  // of the routes. I've left it here, but it seems disconnected.
  // If it was meant to be triggered by a component, that component
  // would need to have this function passed as a prop.
  const handleGeneratePlan = async () => {
    setShowPlanModal(true);
    setIsGeneratingPlan(true);
    const prompt = `My peak productivity window is from 10:00 AM to 12:00 PM. My main productive tasks involve 'VS Code' and 'Browser'. Generate a simple, actionable 2-hour work plan for this window. Use markdown for formatting.`;
    const result = await callGeminiAPI(prompt);
    setGeneratedPlan(result);
    setIsGeneratingPlan(false);
  };

  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      <PlanModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        plan={generatedPlan}
        isLoading={isGeneratingPlan}
      />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
