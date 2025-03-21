import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

// Use a global cache to prevent re-connecting in development
let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) {
    console.log("Using cached MongoDB connection.");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("Creating new MongoDB connection...");
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "test", // Ensure the correct database name is specified
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Set the cached connection globally
(global as any).mongoose = cached;

export default connectToDatabase;

