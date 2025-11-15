import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDb from "./config/mongodb.js";
import userRouter from "./routes/UserRoutes.js";
import { clerkWebhooks } from "./controllers/userController.js";

// APP config
const PORT = process.env.PORT || 4000;
const app = express();
await connectDb();

app.post(
  "/api/user/webhooks",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);
// Middleware
app.use(express.json());
app.use(cors());

// API route
app.get("/", (req, res) => {
  res.send("API working");
});

// Server start
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
