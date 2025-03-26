"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const RecommendationPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [travelCarbonFootprint, setTravelCarbonFootprint] = useState<number>(1500);
  const [energyEmitted, setEnergyEmitted] = useState<number>(900);
  const [foodCarbonEmission, setFoodCarbonEmission] = useState<number>(600);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [userInput, setUserInput] = useState("");

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const prompt = `
        Your task is to develop a personalized recommendation system. You will receive three numerical inputs representing a user's carbon footprint:

        1. Travel Carbon Footprint: ${travelCarbonFootprint}
        2. Energy Emitted: ${energyEmitted}
        3. Food Carbon Emission: ${foodCarbonEmission}

       Based on these inputs, generate **ONLY 6 personalized recommendations** to reduce their carbon footprint.

      **Prioritization rules**:
      - Identify the highest, second highest, and lowest input values.
      - Otherwise, allocate 3-4 recommendations to the highest factor.
      - Allocate 1-2 recommendations to the second highest.
      - Allocate 1 recommendation** for the lowest factor (or a general tip covering all three).
        
      Start with Justifying the suggestions by saying it is based on the highest factor order.
      Return the response as a clear numbered list based on factor strength without asterisks or bold text.
      `;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
      const response = await axios.post(endpoint, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 400 },
      });

      let generatedText = response.data.candidates[0].content.parts[0].text;
      setRecommendations(generatedText.split("\n").filter((line) => line.trim() !== ""));
      setLoading(false);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setError("Unable to generate recommendations at this time.");
      setLoading(false);
    }
  };

  useEffect(() => {
    generateRecommendations();
  }, []);

  const handleChatSubmit = async () => {
    if (!userInput.trim()) return;
    setChatHistory((prev) => [...prev, { role: "user", content: userInput }]);
    try {
      const prompt = `User asked: "${userInput}"\n\nRecommendations:\n${recommendations.join("\n")}\n\nProvide a response with clear, numbered suggestions on new lines. Provide relevant and trusted clickable web links whereever possible. `;
      
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
      const response = await axios.post(endpoint, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
      });
      
      const botResponse = response.data.candidates[0].content.parts[0].text;
      setChatHistory((prev) => [...prev, { role: "bot", content: botResponse.replace(/\*/g, "") }]);
      setUserInput("");
    } catch (error) {
      console.error("Error in chat:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center">Personalized Carbon Footprint Reduction Tips</h1>

      {loading && <p className="text-center text-gray-600">Loading recommendations...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="mx-auto max-w-3xl p-6 bg-white shadow-lg rounded-lg">
        {recommendations.map((recommendation, index) => (
          <p key={index} className="mb-2 text-gray-800">{recommendation}</p>
        ))}
      </div>

      <div className="mt-4 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Please Input your Carbon Emissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{ label: "Travel Carbon Footprint", value: travelCarbonFootprint, setter: setTravelCarbonFootprint },
            { label: "Energy Emitted", value: energyEmitted, setter: setEnergyEmitted },
            { label: "Food Carbon Emission", value: foodCarbonEmission, setter: setFoodCarbonEmission }].map(({ label, value, setter }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input type="number" value={value} onChange={(e) => setter(Number(e.target.value))} className="mt-1 p-2 border rounded-md w-full" />
            </div>
          ))}
        </div>
        <button onClick={generateRecommendations} className="mt-4 bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg w-full">
          Generate Recommendations
        </button>
      </div>

      <div className="mt-6 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-lg font-semibold">Chat with Green Bot</h2>
        <div className="h-48 overflow-y-auto border p-4 rounded-md bg-gray-50">
          {chatHistory.map((msg, index) => (
            <p key={index} className={`mb-2 ${msg.role === "user" ? "text-right text-gray-600" : "text-left text-gray-800"}`}>
              <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>
              <br />
              {msg.content.split("\n").map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </p>
          ))}
        </div>
        <div className="mt-4 flex gap-3">
          <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Ask about the tips..." className="w-full p-3 border rounded-md" />
          <button onClick={handleChatSubmit} className="bg-green-600 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-lg">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;