import express from "express";
import { upload } from "../config/cloudinary";
import { authenticate } from "../middleware/authenticate";
import { uploadImage, transformImage } from "../controllers/imageController";

// rate limit
import rateLimit from "express-rate-limit";

const router = express.Router();

// Defining the Limits
const transformLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes time window
  max: 50, // Maximum 50 requests allowed per IP
  message: {
    status: 429,
    message: "Too many transformation requests. Please wait 15 minutes.",
  },
});



router.post("/upload", authenticate, upload.single("image"), uploadImage);

// Apply the limiter ONLY to the transform route
router.post(
  "/:id/transform",
  authenticate, 
  transformLimiter, 
  transformImage, 
);

export default router;
