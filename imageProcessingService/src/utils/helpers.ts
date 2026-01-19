import { Response } from "express";
import crypto from "crypto";
import { getDb } from "../db";
import { User } from "../types/users";

export function sendError(res: Response, msg: string) {
  return res.status(400).json({ error: msg });
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function getUsersCollection() {
  const db = getDb();
  return db.collection<User>("imageOwner");
}

export function getImageCollection() {
  const db = getDb();
  return db.collection("imageUpload");
}