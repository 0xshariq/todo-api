import bcrypt from "bcryptjs";
import { User } from "../models/user.js";
import { sendCookie } from "../utils/cookie.js";

export const getAllUsers = async (req, res) => {};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    sendCookie(user, res, "Login successful", 200);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login",
      error: error.message
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logout successful",
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    sendCookie(user, res, "User registered successfully", 201);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during registration",
      error: error.message
    });
  }
};

export const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

