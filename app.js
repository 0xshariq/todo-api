import express from "express";
import userRouter from "./routes/user.js";
import taskRouter from "./routes/task.js";
import cookieParser from "cookie-parser";

export const app = express();


// Middleware
app.use(express.json()); // This will parse the incoming request body to json
app.use("/api/v1/users", userRouter); // This will use the userRouter for any request that starts with /api/v1/users
app.use("/api/v1/tasks", taskRouter); 
app.use(cookieParser()); // This will parse the incoming cookie header to json

app.get("/", (req, res) => {
  res.send("Hello World");
});
