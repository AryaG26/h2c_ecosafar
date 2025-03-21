// import type { NextApiRequest, NextApiResponse } from "next";
// import mongoose from "mongoose";
// import Trip, { ITrip } from "@/models/trips";

// const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI!;

// // Ensure we connect to the "trip" database
// const connectDB = async () => {
//   if (mongoose.connection.readyState === 1) return;
//   await mongoose.connect(MONGODB_URI, {
//     dbName: "trips", // Explicitly specify "trip" database
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   } as any);
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await connectDB();

//   if (req.method === "GET") {
//     try {
//       const trips: ITrip[] = await Trip.find().sort({ date: -1 });
//       res.status(200).json({ trips });
//     } catch (error) {
//       res.status(500).json({ message: "Failed to fetch trips", error });
//     }
//   } else if (req.method === "POST") {
//     try {
//       const { from, to, distance, mode, coordinates } = req.body;
//       const emissions = calculateEmissions(distance, mode);

//       const newTrip = new Trip({
//         from,
//         to,
//         distance,
//         mode,
//         emissions,
//         coordinates,
//       });

//       await newTrip.save();
//       res.status(201).json({ message: "Trip saved!", trip: newTrip });
//     } catch (error) {
//       res.status(500).json({ message: "Error saving trip", error });
//     }
//   } else {
//     res.status(405).json({ message: "Method Not Allowed" });
//   }
// }

// // Helper function to estimate emissions based on mode of transport
// const calculateEmissions = (distance: number, mode: string): number => {
//   const emissionRates: { [key: string]: number } = {
//     Car: 0.12, // kg CO₂ per km
//     Bus: 0.05,
//     Train: 0.03,
//     Airplane: 0.25,
//     Cycle: 0,
//     Walk: 0,
//   };

//   return distance * (emissionRates[mode] || 0.1); // Default rate
// };

import { connectToDatabase } from "@/lib/mongodb";
import Trip from "@/models/trips";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    const trips = await Trip.find({});
    return res.json({ trips });
  }

  if (req.method === "POST") {
    const { from, to, distance, mode, coordinates } = req.body;

    const emissionsFactor = {
      Car: 0.12,
      Bus: 0.05,
      Train: 0.03,
      Airplane: 0.25,
      Cycle: 0,
      Walk: 0,
    };

    const emissions = (distance * (emissionsFactor[mode] || 0)).toFixed(2);

    const newTrip = await Trip.create({ from, to, distance, mode, emissions, coordinates });

    return res.status(201).json({ trip: newTrip });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
