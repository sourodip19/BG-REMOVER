import express from "express";
import { clerkWebhooks } from "../controllers/userController.js";

const userRouter = express.Router();
// Raw body parser is applied at app level in server.js
userRouter.post("/webhooks", clerkWebhooks);
export default userRouter;
