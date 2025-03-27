"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const industries = ["Retail", "Technology", "Manufacturing", "Healthcare", "Finance", "Logistics", "Personal"];

const RecommendationPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [travelCarbonFootprint, setTravelCarbonFootprint] = useState<number>(1500);
  const [energyEmitted, setEnergyEmitted] = useState<number>(120.2);
  const [foodCarbonEmission, setFoodCarbonEmission] = useState<number>(600);
  const [industry, setIndustry] = useState<string>("Retail");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [userInput, setUserInput] = useState("");

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      // Determine priority order of carbon sources
      const sortedEmissions = [
        { name: "Travel", value: travelCarbonFootprint },
        { name: "Energy", value: energyEmitted },
        { name: "Food", value: foodCarbonEmission }
      ].sort((a, b) => b.value - a.value);

      const highestFactor = sortedEmissions[0].name;
      const secondHighestFactor = sortedEmissions[1].name;
      const lowestFactor = sortedEmissions[2].name;

      let prompt = `
        You are a sustainability advisor generating **carbon reduction strategies** for a ${
          industry === "Personal" ? "household/individual" : `company in the **${industry}** sector`
        }.
        
        The carbon footprint sources:
        - **Highest:** ${highestFactor} (${sortedEmissions[0].value})
        - **Second Highest:** ${secondHighestFactor} (${sortedEmissions[1].value})
        - **Lowest:** ${lowestFactor} (${sortedEmissions[2].value})

        **Prioritization Rules:**  
        - Give **3-4 suggestions** for the highest factor.  
        - Give **1-2 suggestions** for the second highest.  
        - Give **1 general tip** covering all factors.

        ${
          industry === "Personal"
            ? `
        **Personal Lifestyle Sustainability Tips:**  
        - Focus on **sustainable travel (public transport, carpooling, cycling, EVs)**  
        - Reduce **home energy consumption (solar panels, LED lighting, energy-efficient appliances)**  
        - Optimize **food habits (local produce, plant-based diet, reducing food waste)**  
        - Suggest **eco-friendly habits (minimalist shopping, recycling, reusing items)**`
            : `
        **Industry-Specific Strategy Generation:**  
        - **Retail:** Focus on **supply chain efficiency, packaging waste, logistics emissions, and energy-efficient stores**.  
        - **Technology:** Prioritize **server energy efficiency, AI-driven optimization, remote work strategies, and green hardware adoption**.  
        - **Manufacturing:** Optimize **industrial processes, material sourcing, waste management, and energy usage**.  
        - **Healthcare:** Reduce **medical waste, optimize energy-intensive equipment, and sustainable procurement**.  
        - **Finance:** Encourage **carbon-neutral investment policies, remote work, and green office infrastructure**.  
        - **Logistics:** Focus on **fleet optimization, fuel-efficient routes, and eco-friendly packaging**.`
        }

        Generate **7 numbered industry-specific recommendations** in the requested priority order.  
        Each tip should:
        - **Be highly actionable**
        - **Include estimated cost savings or ROI**
        - **Mention regulatory compliance if applicable**
        - **Use simple, clear language**

        Output format:  
        1. [Recommendation 1]  
        2. [Recommendation 2]  
        3. [Recommendation 3]  
        (No asterisks or bold text.)
      `;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
      const response = await axios.post(endpoint, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 600 },
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
  }, [industry]);

  const handleChatSubmit = async () => {
    if (!userInput.trim()) return;
    setChatHistory((prev) => [...prev, { role: "user", content: userInput }]);
    try {
      const prompt = `User (Business in ${industry}) asked: "${userInput}"\n\nCurrent recommendations:\n${recommendations.join("\n")}\n\nProvide a response with clear, numbered business insights on new lines. Mention compliance if applicable. Inlcude relevant web links where possible.`;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
      const response = await axios.post(endpoint, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
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
      <h1 className="text-3xl font-bold text-center">Carbon Footprint Reduction Suggestor & CSR Advisor</h1>

      {loading && <p className="text-center text-gray-600">Loading recommendations...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Recommendations Section */}
      <div className="mx-auto max-w-3xl p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Industry: {industry}</h2>
        {recommendations.map((recommendation, index) => (
          <p key={index} className="mb-2 text-gray-800">{recommendation}</p>
        ))}
      </div>

      {/* Industry Selection & Carbon Emissions Input */}
      <div className="mt-4 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Customize for Your Advisor</h2>
        <label className="block text-sm font-medium text-gray-700">Select Your Industry</label>
        <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="mt-1 p-2 border rounded-md w-full">
          {industries.map((ind) => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
          Generate Reduction Suggestions
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
