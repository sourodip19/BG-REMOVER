import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDb from "./config/mongodb.js";
import userRouter from "./routes/UserRoutes.js";

// APP config
const PORT = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
await connectDb();

// API route
app.get("/", (req, res) => {
  res.send("API working");
});
app.use("/api/user", userRouter);

// Server start
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
