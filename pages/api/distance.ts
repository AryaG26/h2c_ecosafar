import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ success: false, message: "Missing 'from' or 'to' parameters" });
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json`,
      {
        params: {
          origins: from,
          destinations: to,
          units: "metric",
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (!response.data || response.data.status !== "OK") {
      return res.status(400).json({ success: false, message: "Invalid API response", data: response.data });
    }

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ Distance Matrix API Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch distance", error: error.message });
  }
}
