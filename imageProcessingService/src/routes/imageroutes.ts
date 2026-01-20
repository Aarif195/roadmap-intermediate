import express from "express";
import { upload } from "../config/cloudinary";

import { authenticate } from "../middleware/authenticate";

import { uploadImage } from "../controllers/imageController";

const router = express.Router();

// 1. Add this test route here
router.post("/test", (req, res) => {
  res.send("Router is reachable");
});

router.post("/upload", authenticate, upload.single("image"), uploadImage);


export default router;