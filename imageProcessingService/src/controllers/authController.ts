import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getUsersCollection, hashPassword, sendError } from "../utils/helpers";
import { User } from "../types/users";

const JWT_SECRET = process.env.JWT_SECRET!;

// REGISTER
export async function register(req: Request, res: Response) {
  try {
    const { username, email, password }: { username: string; email: string; password: string } = req.body;

    if (!username || !email || !password)
      return sendError(res, "All fields are required");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return sendError(res, "Invalid email format");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password))
      return sendError(res, "Password must be at least 8 characters and include uppercase, lowercase, number, and special character");

    const usersCol = getUsersCollection();

    if (await usersCol.findOne({ email }))
      return sendError(res, "Email already exists");

    if (await usersCol.findOne({ username }))
      return sendError(res, "Username already exists");

    const newUser: User = {
      username,
      email,
      password: hashPassword(password),
    };

    const result = await usersCol.insertOne(newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: result.insertedId.toString(),
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    sendError(res, "Server error");
  }
}

// LOGIN
export async function login(req: Request, res: Response) {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    if (!email || !password)
      return sendError(res, "Email and password are required");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return sendError(res, "Invalid email format");

    const usersCol = getUsersCollection();
    const user = await usersCol.findOne({ email });

    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error(err);
    sendError(res, "Server error");
  }
}
