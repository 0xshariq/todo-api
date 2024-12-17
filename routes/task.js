import express from "express";
import { createTask, getAllTask } from "../controllers/task.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new",isAuthenticated, createTask);
router.get("/all",isAuthenticated, getAllTask);

export default router;
