import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token
    if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });


    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user
    const user = await User.findById(decoded._id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please log in again.",
      });
    }

    // Attach the user to the request object
    req.user = user;
    console.log('User:', user);
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
      });
    }
    
    // For any other errors, pass to the error handling middleware
    next(error);
  }
};