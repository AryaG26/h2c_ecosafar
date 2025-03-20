import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await axios.get(url);
    if (response.data.results.length > 0) {
      res.status(200).json({ coordinates: response.data.results[0].geometry.location });
    } else {
      res.status(404).json({ message: "Location not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching geocode data" });
  }
}
