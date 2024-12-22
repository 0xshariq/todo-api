import bcrypt from "bcryptjs";
import { User } from "../models/user.js";
import { sendCookie } from "../utils/cookie.js";
import ErrorHandler from "../middlewares/error.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(new ErrorHandler(500, "Error fetching users"));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler(400, "Email and password are required"));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler(404, "User not found"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorHandler(401, "Invalid email or password"));
    }

    sendCookie(user, res, "Login successful", 200);
  } catch (error) {
    next(new ErrorHandler(500, "Internal server error during login"));
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("token", {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production" ? true : false,
    })
    .json({
      success: true,
      message: "Logout successful",
    });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new ErrorHandler(400, "All fields are required"));
    }

    let user = await User.findOne({ email });
    if (user) {
      return next(new ErrorHandler(400, "User already exists"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    sendCookie(user, res, "User registered successfully", 201);
  } catch (error) {
    next(new ErrorHandler(500, "Error during registration"));
  }
};

export const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};
