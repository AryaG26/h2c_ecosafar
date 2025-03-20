// import mongoose, { Schema, Document } from "mongoose";

// export interface ITrip extends Document {
//   from: string;
//   to: string;
//   distance: number;
//   mode: string;
//   emissions: number;
//   date: string;
//   coordinates?: { lat: number; lng: number };
// }

// const TripSchema: Schema = new Schema({
//   from: { type: String, required: true },
//   to: { type: String, required: true },
//   distance: { type: Number, required: true },
//   mode: { type: String, required: true },
//   emissions: { type: Number, default: 0 },
//   date: { type: String, default: new Date().toISOString() },
//   coordinates: {
//     lat: { type: Number },
//     lng: { type: Number },
//   },
// });

// // Prevent re-declaring the model in Next.js hot reload
// const Trip = mongoose.models.Trip || mongoose.model<ITrip>("trip", TripSchema);

// export default Trip;

import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
  from: String,
  to: String,
  distance: Number,
  mode: String,
  emissions: Number,
  date: { type: Date, default: Date.now },
  coordinates: { lat: Number, lng: Number },
});

export default mongoose.models.Trip || mongoose.model("Trip", TripSchema);
