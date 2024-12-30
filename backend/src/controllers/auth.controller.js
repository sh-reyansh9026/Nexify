import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async(req, res) => {
    const { email, password, fullName } = req.body; // taking inputs from frontend
    try {
        if (!fullName || !email || !password) { // checking if any of the input is empty
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) { // checking if password is less than 6 characters
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        // if password is greater than 6 characters then it will check if user already exists or not
        const user = await User.findOne({ email });// checking if user with the this email already exists or not
        if (user) {
            return res.status(400).json({ message: "User already exists" });// if user already exists then it will return this message
        }

        const salt = await bcrypt.genSalt(10); // generating salt for hashing password
        const hashedPassowrd = await bcrypt.hash(password, salt); // hashing password

        // creating new user with the inputs from frontend
        const newUser = new User({
            fullName,
            email,
            password: hashedPassowrd
        })

        // if new user created 
        if (newUser) {
            // generate jwt token
            generateToken(newUser._id, res)
            await newUser.save(); // save the user

            res.status(201)
                .json({
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic:newUser.profilePic,
            })
        }
        else {
            return res.status(400).json({ message: "Invalid user data" });
        }


    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if ((!email || !password)) {
            return res.status(400)
            .json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400)
                .json({ message: "Invalid credentials" });
        }
        // if user exists then it will compare the password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);// password from frontend and user.password from database
        if(!isPasswordCorrect) {
            return res.status(400)
                .json({ message: "Invalid credentials" });
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
        
    }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => { 
    try {
        const { profilePic } = req.body; // taking profilePic from frontend

        if(!profilePic) {
            return res.status(400).json({ message: "Profile Pic is required" });
        }
        // if profile pic is provided then it will find the user with the userId and update the profilePic
        const userId = req.user._id; // taking userId from req.user and req.user is passed from protectRoute middleware from req.body

        // now file will be uploaded to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });// new:true makes sure that updated user is returned
        
        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in updateProfile ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// it is for checking if user is authenticated or not based on that which page is to be shown on frontend login,signup or logout
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};