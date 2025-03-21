"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const RecommendationPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [travelCarbonFootprint, settravelCarbonFootprint] = useState<number>(1500);
  const [energyEmitted, setEnergyEmitted] = useState<number>(900);
  const [foodCarbonEmission, setFoodCarbonEmission] = useState<number>(600);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const prompt = `
        Your task is to develop a personalized recommendation system. You will receive three numerical inputs representing a user's carbon footprint:

        1. Total Carbon Footprint: ${travelCarbonFootprint}
        2. Energy Emitted: ${energyEmitted}
        3. Food Carbon Emission: ${foodCarbonEmission}

        Based on these inputs, you must generate ONLY five personalized recommendations in 250 words to reduce their carbon footprint. Prioritize recommendations based on the highest contributing factor (Energy or Food) to the total footprint.

        Instructions:

        * Analyze the provided numerical inputs to determine the areas where the user's carbon footprint is highest.
        * Generate five actionable recommendations.
        * Format your response as a numbered list.
        * If the energy emitted and food carbon emission are relatively close, provide a mix of both energy and food-related recommendations.
        * If the total carbon footprint is very low, provide general sustainable living tips.
        * ADD EMOJIS if required.
      `;

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

      const response = await axios.post(endpoint, {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 280,
        },
      });

      let generatedText = response.data.candidates[0].content.parts[0].text;
      generatedText = generatedText.replace(/\*\*/g, "");

      setRecommendations(generatedText.split("\n"));
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

  const handleSubmit = () => {
    generateRecommendations();
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Carbon Footprint Reduction Recommendations</h1>
      {loading && <p className="text-center">Loading recommendations...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="mx-auto max-w-280 p-4 bg-white shadow-md rounded-lg my-2">
        {recommendations.map((recommendation, index) => {
          if (recommendation.trim() === "") return null;
          return (
            <p key={index} className="mb-2">
              {recommendation}
            </p>
          );
        })}
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Test with Custom Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Travel Carbon Footprint</label>
            <input
              type="number"
              value={travelCarbonFootprint}
              onChange={(e) => settravelCarbonFootprint(Number(e.target.value))}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Energy Emitted</label>
            <input
              type="number"
              value={energyEmitted}
              onChange={(e) => setEnergyEmitted(Number(e.target.value))}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Food Carbon Emission</label>
            <input
              type="number"
              value={foodCarbonEmission}
              onChange={(e) => setFoodCarbonEmission(Number(e.target.value))}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default RecommendationPage;