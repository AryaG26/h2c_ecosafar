import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Trip from "@/models/trips";

// Helper function to get the start of the day
const getStartOfDay = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  try {
    const startOfDay = getStartOfDay();

    // Aggregate total distance and emissions for today
    const travelSummary = await Trip.aggregate([
      {
        $match: {
          date: { $gte: startOfDay }, // Filter trips from the start of the day
        },
      },
      {
        $group: {
          _id: null,
          totalDistance: { $sum: "$distance" },
          totalEmissions: { $sum: "$emissions" },
        },
      },
    ]);

    const { totalDistance = 0, totalEmissions = 0 } = travelSummary[0] || {};

    return res.status(200).json({ totalDistance, totalEmissions });
  } catch (error) {
    console.error("Error fetching travel summary:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
