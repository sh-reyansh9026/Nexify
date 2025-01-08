import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';


config(); // it is important to call this function before using process.env as cloudinary will take api key and api secret from .env file

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;