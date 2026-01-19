import express from "express";
import { upload } from "../config/cloudinary";

import { authenticate } from "../middleware/authenticate";
import { sendError } from "../utils/helpers";

import { uploadImage } from "../controllers/imageContoller";

const router = express.Router();


router.post("/upload", authenticate, upload.single("image"), uploadImage);


export default router;