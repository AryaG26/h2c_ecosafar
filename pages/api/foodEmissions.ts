import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    await connectToDatabase();

    const result = await Product.aggregate([
     
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      },
      // Convert carbonFootprint to a number (handle invalid or null values)
      {
        $addFields: {
          carbonFootprint: {
            $convert: {
              input: "$carbonFootprint",
              to: "double",
              onError: 0, // Set to 0 if conversion fails (e.g., 'N/A', invalid)
              onNull: 0,  // Set to 0 if value is null
            },
          },
        },
      },
      // Group and sum up the valid carbonFootprint values
      {
        $group: {
          _id: null,
          totalEmissions: { $sum: "$carbonFootprint" },
        },
      },
    ]);

    // Extract total emissions or default to 0
    const totalEmissions = result.length > 0 ? result[0].totalEmissions : 0;

    // Respond with the total emissions for today
    return res.status(200).json({ totalEmissions });
  } catch (error) {
    console.error('Error fetching daily emissions:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await connectToDatabase();

//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Start of the day

//     // Fetch all products scanned today and sum carbonFootprint
//     const totalEmissions = await Product.aggregate([
//       { $match: { createdAt: { $gte: today } } },
//       {
//         $group: {
//           _id: null,
//           totalCarbon: { $sum: { $toDouble: "$carbonFootprint" } },
//         },
//       },
//     ]);

//     res.status(200).json({
//       totalEmissions: totalEmissions[0]?.totalCarbon || 0,
//     });
//   } catch (error) {
//     console.error("Error fetching daily emissions:", error);
//     res.status(500).json({ error: "Failed to fetch daily emissions" });
//   }
// }
