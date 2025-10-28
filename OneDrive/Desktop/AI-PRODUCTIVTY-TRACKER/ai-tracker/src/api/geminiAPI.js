// --- Helper: Gemini API Call ---
export const callGeminiAPI = async (prompt) => {
  const apiKey = ""; // Will be provided by the environment
  const url = `https://generativelang-staging.sandbox.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const result = await response.json();
    if (
      result.candidates &&
      result.candidates.length > 0 &&
      result.candidates[0].content.parts[0].text
    ) {
      return result.candidates[0].content.parts[0].text;
    } else {
      return "Sorry, I couldn't generate a response. Please try again.";
    }
  } catch (error) {
    console.error("Gemini API call error:", error);
    return "An error occurred while contacting the AI. Please check the console for details.";
  }
};
