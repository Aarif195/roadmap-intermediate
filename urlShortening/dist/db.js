"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongo = connectToMongo;
exports.getDb = getDb;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
let db;
async function connectToMongo() {
    const client = new mongodb_1.MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log("MongoDB connected:", dbName);
}
function getDb() {
    if (!db) {
        throw new Error("Database not connected. Call connectToMongo() first.");
    }
    return db;
}
