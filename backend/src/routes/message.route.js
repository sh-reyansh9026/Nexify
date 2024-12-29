import express from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import { getUsersForSidebar,getMessages,sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);

// to get chats of a particular user
router.get("/:id", protectRoute, getMessages);
// route for sending messages
router.post("/send/:id", protectRoute, sendMessage);

export default router;