"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShortUrl = createShortUrl;
exports.getOriginalUrl = getOriginalUrl;
exports.updateShortUrl = updateShortUrl;
exports.deleteShortUrl = deleteShortUrl;
exports.getUrlStats = getUrlStats;
const db_1 = require("../db");
const nanoid_1 = require("nanoid");
const alphabet = '3456789abcdefghijkmnopqrstuvwxy';
const generateShortCode = (0, nanoid_1.customAlphabet)(alphabet, 6);
// createShortUrl
async function createShortUrl(req, res) {
    try {
        const { url } = req.body;
        if (!url)
            return res.status(400).json({ error: "url is required" });
        const db = (0, db_1.getDb)();
        const now = new Date();
        let shortCode;
        let exists = true;
        while (exists) {
            shortCode = generateShortCode();
            const existing = await db.collection("urls").findOne({ shortCode });
            if (!existing)
                exists = false;
        }
        // new object to insert
        const newUrl = {
            url,
            shortCode,
            createdAt: now,
            updatedAt: now
        };
        // Insert into MongoDB
        const result = await db.collection("urls").insertOne(newUrl);
        res.status(201).json({
            id: result.insertedId.toString(),
            url: newUrl.url,
            shortCode: newUrl.shortCode,
            createdAt: newUrl.createdAt,
            updatedAt: newUrl.updatedAt
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}
// getOriginalUrl
async function getOriginalUrl(req, res) {
    try {
        const { shortCode } = req.params;
        const db = (0, db_1.getDb)();
        const urlDoc = await db.collection("urls").findOneAndUpdate({ shortCode }, { $inc: { clicks: 1 } });
        if (!urlDoc)
            return res.status(404).json({ error: "Short URL not found" });
        res.redirect(301, urlDoc.url);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}
// updateShortUrl
async function updateShortUrl(req, res) {
    try {
        const { shortCode } = req.params;
        const { url } = req.body;
        if (!url)
            return res.status(400).json({ error: "url is required" });
        console.log("Updating shortCode:", shortCode);
        const db = (0, db_1.getDb)();
        const now = new Date();
        const found = await db.collection("urls").findOne({ shortCode: "pYj_Gh" });
        console.log("Found document:", found);
        const result = await db.collection("urls").findOneAndUpdate({ shortCode }, { $set: { url, updatedAt: now } }, { returnDocument: "after" });
        console.log("Update result:", result);
        if (!result)
            return res.status(404).json({ error: "Short URL not found" });
        res.json({
            id: result._id.toString(),
            url: result.url,
            shortCode: result.shortCode,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}
// deleteShortUrl
async function deleteShortUrl(req, res) {
    try {
        const { shortCode } = req.params;
        const db = (0, db_1.getDb)();
        const result = await db.collection("urls").deleteOne({ shortCode });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Short URL not found" });
        }
        res.status(204).send();
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}
// getUrlStats
async function getUrlStats(req, res) {
    try {
        const { shortCode } = req.params;
        const db = (0, db_1.getDb)();
        const urlDoc = await db.collection("urls").findOne({ shortCode });
        if (!urlDoc)
            return res.status(404).json({ error: "Short URL not found" });
        res.json({
            id: urlDoc._id.toString(),
            url: urlDoc.url,
            shortCode: urlDoc.shortCode,
            createdAt: urlDoc.createdAt,
            updatedAt: urlDoc.updatedAt,
            accessCount: urlDoc.clicks
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}
