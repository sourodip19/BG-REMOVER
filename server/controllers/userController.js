import { Webhook } from "svix";
import userModel from "../models/User.js";
// Api controller function to manage clerk user with database
// http://localhost:4000/api/user/webhooks

const clerkWebhooks = async (req, res) => {
  try {
    // Log incoming webhook request for debugging
    console.log("Webhook received - Headers:", {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"] ? "present" : "missing",
    });
    console.log("Body type:", typeof req.body, "Is Buffer:", Buffer.isBuffer(req.body));

    if (!process.env.CLERK_WEBHOOK_SECRET) {
      throw new Error("CLERK_WEBHOOK_SECRET is not set in environment variables");
    }

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify webhook signature using raw body
    const payload = await whook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = payload;
    console.log("Webhook event type:", type);
    console.log("Webhook data received:", JSON.stringify(data, null, 2));
    
    switch (type) {
      case "user.created": {
        // Validate required data
        if (!data.id) {
          throw new Error("User ID is missing");
        }
        if (!data.email_addresses || data.email_addresses.length === 0) {
          throw new Error("User email is missing");
        }

        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          photo: data.image_url || "",
        };
        
        console.log("Creating user with data:", userData);
        const newUser = await userModel.create(userData);
        console.log("✅ User created in database:", newUser.email);
        res.json({ success: true, message: "User created", userId: newUser._id });
        break;
      }

      case "user.deleted": {
        await userModel.findOneAndDelete({ clerkId: data.id });
        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        };
        await userModel.findOneAndUpdate({ clerkId: data.id }, userData);
        res.json({});
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error("Webhook error:", error.message);
    console.error("Error stack:", error.stack);
    res.status(400).json({ success: false, message: error.message });
  }
};

export { clerkWebhooks };
