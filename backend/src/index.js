import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json()); // it is used to parse the incoming request with JSON payloads to extract from req.body
app.use(cookieParser());// it is used to parse the cookies

app.use(cors({ // it is used to enable CORS with various options
    origin: "http://localhost:5173", 
    credentials: true
})); 


app.use("/api/auth", authRoutes); // it is used for routing to authRoutes where authRoutes is a function imported from auth.route.js
app.use("/api/messages", messageRoutes); // it is used for routing to messageRoutes where messageRoutes is a function imported from message.route.js

app.listen(PORT, () => {
    console.log("Server is running on PORT:" + PORT);
    connectDB();// databse connection
});