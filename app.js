import express from "express";
import userRouter from "./routes/user.js";
import taskRouter from "./routes/task.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";

export const app = express();

// Middlewares
app.use(express.json()); // This will parse the incoming request body to json
app.use(cookieParser()); // This will parse the incoming cookie header to json
app.use(
  cors({
    origin: ["http://localhost:4000", process.env.FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
); // This will allow requests from http://localhost:3000
app.use("/api/v1/users", userRouter); // This will use the userRouter for any request that starts with /api/v1/users
app.use("/api/v1/tasks", taskRouter);
app.use(errorMiddleware); // This will handle any errors that are thrown in the application and return a 500 status code

app.get("/", (req, res) => {
  res.send("Hello World!");
});
