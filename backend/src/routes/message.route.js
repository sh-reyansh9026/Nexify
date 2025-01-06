import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage,deleteForMe,deleteMessageForEveryone } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);

// to get chats of a particular user
router.get("/:id", protectRoute, getMessages);
// route for sending messages
router.post("/send/:id", protectRoute, sendMessage);
// route for deleting messages
router.put("/deleteForMe/:messageId", protectRoute, deleteForMe);
// route for deleting messages for everyone
router.put("/deleteForEveryone/:messageId", protectRoute, deleteMessageForEveryone);

export default router;