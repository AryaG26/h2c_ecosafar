import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Ensure database connection
    await connectToDatabase();
    console.log("Connected to MongoDB.");

    const { barcode, name, brand, category, image, greenScore, impactGrade, carbonFootprint } = req.body;

    if (!barcode || !name || !brand) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingProduct = await Product.findOne({ barcode });

    if (!existingProduct) {
      const newProduct = new Product({
        barcode,
        name,
        brand,
        category,
        image,
        greenScore,
        impactGrade,
        carbonFootprint,
      });
      await newProduct.save();
      return res.status(201).json({ message: "Product saved successfully" });
    }

    return res.status(200).json({ message: "Product already exists" });
  } catch (error) {
    console.error("Error saving product:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
