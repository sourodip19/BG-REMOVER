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

// IMPORTANT: Webhook route needs raw body, so we handle it BEFORE JSON parser
// Apply raw body parser specifically for webhook route
app.use("/api/user/webhooks", express.raw({ type: "application/json" }));

// Apply JSON parser to all other routes
app.use(express.json());
await connectDb();

// API route
app.get("/", (req, res) => {
  res.send("API working");
});

// Test endpoint to verify server is running
app.get("/api/test", (req, res) => {
  res.json({
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/user", userRouter);

// Server start
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
