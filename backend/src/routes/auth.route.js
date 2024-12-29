import express from "express";
import { signup,login, logout,updateProfile,checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout", logout);

router.put("/update-profile",protectRoute, updateProfile);// protectRoute is a middleware used to check if the user is logged in or not then only updation is allowed

router.get("check", protectRoute, checkAuth);

export default router;

