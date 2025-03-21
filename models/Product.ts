import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  barcode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  greenScore: { type: String, required: true },
  impactGrade: { type: String, required: true },
  carbonFootprint: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
