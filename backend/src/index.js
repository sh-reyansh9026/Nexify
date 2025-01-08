import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";


dotenv.config();
// const app = express(); // it is deleted bcoz it is already created in socket.js file which is imported here

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: '5mb' })); // it is used to parse the incoming request with JSON payloads to extract from req.body 
// here we are setting the limit to 5mb so that we can upload images of size upto 5mb bcoz By default, Express sets a limit of 100KB for incoming JSON payloads. If your image is larger than this, it will trigger the error.
app.use(cookieParser());// it is used to parse the cookies

app.use(cors({ // it is used to enable CORS with various options
    origin: "http://localhost:5173", 
    credentials: true
})); 

app.use("/api/auth", authRoutes); // it is used for routing to authRoutes where authRoutes is a function imported from auth.route.js
app.use("/api/messages", messageRoutes); // it is used for routing to messageRoutes where messageRoutes is a function imported from message.route.js

if (process.env.NODE_ENV == "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist"))); // it is used to serv

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend","dist","index.html"));
    })
}
server.listen(PORT, () => { // here instead of app.listen we are using server.listen bcoz we are using socket.io
    console.log("Server is running on PORT:" + PORT);
    connectDB();// databse connection
});