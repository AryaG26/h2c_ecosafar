import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "260907100312";  // Secure the secret key

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      console.log("Login request received for:", email);

      const user = await User.findOne({ email: email.toLowerCase() });  // Convert email to lowercase
      if (!user) {
        console.log("User not found!");
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      console.log("Entered password before compare:", password);
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Stored password hash:", user.password);
      console.log("Entered password:", password);
      console.log("Password match result:", isMatch);


      if (!isMatch) {
        console.log("Incorrect password!");
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
      console.log("Login successful, token generated!");
      
      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
