import express from "express";
import { clerkWebhooks } from "../controllers/userController.js";

const userRouter = express.Router();
// Use raw body parser for webhook route (required for Svix verification)
userRouter.post("/webhooks", express.raw({ type: "application/json" }), clerkWebhooks);
export default userRouter;
