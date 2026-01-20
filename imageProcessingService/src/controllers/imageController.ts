import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getImageCollection, sendError } from "../utils/helpers";
import { User } from "../types/users";
import { ObjectId } from "mongodb";

import cloudinary from "../config/cloudinary";
import { AuthRequest } from "../middleware/authenticate";

export async function uploadImage(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, "Unauthorized");
    if (!req.file) return sendError(res, "No file uploaded");

    // Upload to Cloudinary using a buffer stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "roadmap_images" },
      async (error, result) => {
        if (error || !result) return sendError(res, "Cloudinary upload failed");

        // Save metadata to MongoDB
        const imageCol = getImageCollection();
        const newImage = {
          userId: req.user!._id,
          publicId: result.public_id,
          url: result.secure_url,
          originalName: req.file?.originalname,
          mimetype: req.file?.mimetype,
          size: req.file?.size,
          format: result.format,
          createdAt: new Date(),
        };

        const dbResult = await imageCol.insertOne(newImage);

        res.status(201).json({
          message: "Image uploaded successfully",
          image: {
            ...newImage,
            _id: dbResult.insertedId.toString(),
            userId: req.user?._id ? req.user._id.toString() : "missing_id",
          },
        });
      },
    );

    uploadStream.end(req.file.buffer);
  } catch (err) {
    console.error(err);
    sendError(res, "Server error during upload");
  }
}
