import express from 'express';
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from "cookie-parser"

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5001;

app.use(express.json()); // it is used to parse the incoming request with JSON payloads to extract from req.body
app.use(cookieParser());// it is used to parse the cookies


app.use("/api/auth",authRoutes); // it is used for routing to authRoutes where authRoutes is a function imported from auth.route.js
app.listen(PORT, () => {
    console.log("Server is running on PORT:" + PORT);
    connectDB();// databse connection
});