import mongoose from 'mongoose';

// here database connection is established
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        
    }
}