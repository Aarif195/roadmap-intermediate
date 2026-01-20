import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../types/users";

const JWT_SECRET = process.env.JWT_SECRET!

export interface AuthRequest extends Request {
  user?: User; 
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User;
    // console.log("Decoded User from Token:", decoded);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
}