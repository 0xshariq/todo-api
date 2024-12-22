import ErrorHandler from "../middlewares/error.js";
import { Task } from "../models/task.js";

export const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return next(new ErrorHandler(400, "Title and description are required"));
    }

    if (!req.user || !req.user._id) {
      return next(new ErrorHandler(401, "Unauthorized: User not authenticated"));
    }

    const task = await Task.create({
      title,
      description,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    next(new ErrorHandler(500, "Server Error"));
  }
};

export const getAllTask = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    next(new ErrorHandler(500, "Server Error"));
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return next(new ErrorHandler(404, "Task not found"));
    }
    task.isCompleted = !task.isCompleted;
    await task.save();
    res.status(200).json({ success: true, message: "Task updated" });
  } catch (error) {
    next(new ErrorHandler(500, "Server Error"));
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return next(new ErrorHandler(404, "Task not found"));
    }
    await Task.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    next(new ErrorHandler(500, "Server Error"));
  }
};