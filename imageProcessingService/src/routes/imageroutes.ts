import express from "express";

import { authenticate } from "../middleware/authenticate";
import { sendError } from "../utils/helpers";

import { uploadImageController } from "../controllers/imageContoller";

const router = express.Router();

router.post("/image", uploadImageController);


export default router;