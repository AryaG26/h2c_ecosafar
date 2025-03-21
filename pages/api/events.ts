// pages/api/events.ts
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lat, lng } = req.query;

  // Validate query parameters
  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing latitude or longitude" });
  }

  try {
    const response = await axios.get("https://api.predicthq.com/v1/events/", {
      headers: {
        Authorization: `Bearer ${process.env.PREDICTHQ_API_TOKEN}`,
        Accept: "application/json",
      },
      params: {
        q: "environment",
        "active.gte": "2023-10-01",
        "active.lte": "2023-12-31",
        within: `10km@${lat},${lng}`,
        limit: 10,
      },
    });

    // Return the results from the PredictHQ API
    res.status(200).json(response.data.results);
  } catch (error) {
    console.error("Error fetching events:", error.response?.data || error.message);

    // Return a generic error message
    res.status(500).json({ error: "Failed to fetch events" });
  }
}