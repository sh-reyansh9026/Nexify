import jwt from "jsonwebtoken";
import { User } from "../models/user.mode.js";

// this middleware is used to check if the user is logged in or not then only updation is allowed
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; // taking token from cookies

        // if token is not provided then it will return this message
        if(!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        // if token is provided then it will verify the token after decoding it from process.env.JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // if token is invalid then it will return this message
        if(!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        // if token is valid then it will find the user with the userId from the database and removes password bcoz passowrd is not shown to user
        const user = await User.findById(decoded.userId).select("-password");

        // if user is not found then it will return this message
        if(!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        // if user is found then it will pass the user to req.user and move to next middleware
        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        
    }
}