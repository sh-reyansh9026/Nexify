import express from "express";
import { checkAuth, login, logout, signup, updateProfile,deleteAccount } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);// protectRoute is a middleware used to check if the user is logged in or not then only updation is allowed

router.get("/check", protectRoute, checkAuth);

router.delete("/deleteAccount/:userId", protectRoute, deleteAccount);

export default router;

