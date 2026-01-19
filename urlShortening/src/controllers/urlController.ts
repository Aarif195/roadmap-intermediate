import { getDb } from "../db";
import { customAlphabet } from "nanoid";
import { Request, Response } from "express";

interface UrlDoc {
  _id?: any;
  url: string;
  shortCode: string;
  createdAt: Date;
  updatedAt: Date;
  clicks?: number;
}

const alphabet = "3456789abcdefghijkmnpqrstuvwxy";
const generateShortCode = customAlphabet(alphabet, 6);

// createShortUrl
export async function createShortUrl(req: Request, res: Response) {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "url is required" });

    const db = getDb();
    const now = new Date();

    let shortCode;
    let exists = true;
    while (exists) {
      shortCode = generateShortCode();
      const existing = await db.collection("urls").findOne({ shortCode });
      if (!existing) exists = false;
    }

    // new object to insert
    const newUrl = {
      url,
      shortCode,
      createdAt: now,
      updatedAt: now,
    };

    // Insert into MongoDB
    const result = await db.collection("urls").insertOne(newUrl);

    res.status(201).json({
      id: result.insertedId.toString(),
      url: newUrl.url,
      shortCode: newUrl.shortCode,
      createdAt: newUrl.createdAt,
      updatedAt: newUrl.updatedAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// getOriginalUrl
export async function getOriginalUrl(req: Request, res: Response) {
  try {
    const { shortCode } = req.params;
    const db = getDb();

    const urlDoc = await db
      .collection("urls")
      .findOneAndUpdate({ shortCode }, { $inc: { clicks: 1 } });

    if (!urlDoc) return res.status(404).json({ error: "Short URL not found" });

    res.redirect(301, urlDoc.url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// updateShortUrl
export async function updateShortUrl(req: Request, res: Response) {
  try {
    const { shortCode } = req.params;
    const { url } = req.body;

    if (!url) return res.status(400).json({ error: "url is required" });

    console.log("Updating shortCode:", shortCode);
    const db = getDb();
    const now = new Date();

    const found = await db.collection("urls").findOne({ shortCode: "pYj_Gh" });
    console.log("Found document:", found);

    const result = await db
      .collection("urls")
      .findOneAndUpdate(
        { shortCode },
        { $set: { url, updatedAt: now } },
        { returnDocument: "after" }
      );

    console.log("Update result:", result);

    if (!result) return res.status(404).json({ error: "Short URL not found" });

    res.json({
      id: result._id.toString(),
      url: result.url,
      shortCode: result.shortCode,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// deleteShortUrl
export async function deleteShortUrl(req: Request, res: Response) {
  try {
    const { shortCode } = req.params;
    const db = getDb();

    const result = await db.collection("urls").deleteOne({ shortCode });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// getUrlStats
export async function getUrlStats(req: Request, res: Response) {
  try {
    const { shortCode } = req.params;
    const db = getDb();

    const urlDoc = await db.collection("urls").findOne({ shortCode });
    if (!urlDoc) return res.status(404).json({ error: "Short URL not found" });

    res.json({
      id: urlDoc._id.toString(),
      url: urlDoc.url,
      shortCode: urlDoc.shortCode,
      createdAt: urlDoc.createdAt,
      updatedAt: urlDoc.updatedAt,
      accessCount: urlDoc.clicks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
