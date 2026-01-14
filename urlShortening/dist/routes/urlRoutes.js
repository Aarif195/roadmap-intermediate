"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const urlController_1 = require("../controllers/urlController");
const router = express_1.default.Router();
// Create a new short URL
router.post("/shorten", urlController_1.createShortUrl);
// Retrieve the original URL
router.get("/shorten/:shortCode", urlController_1.getOriginalUrl);
// Update an existing short URL
router.put("/shorten/:shortCode", urlController_1.updateShortUrl);
// Delete an existing short URL
router.delete("/shorten/:shortCode", urlController_1.deleteShortUrl);
// Get statistics for a short URL
router.get("/shorten/:shortCode/stats", urlController_1.getUrlStats);
exports.default = router;
