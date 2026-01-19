import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";

// Cloudinary & Multer configuration 

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// We use memory storage because we will stream the file to Cloudinary
// configure Multer to upload to Cloudinary
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export default cloudinary;