import { connectToMongo } from "./db";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import urlRoutes from "./routes/urlRoutes";


const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

  app.use("/urls", urlRoutes);


connectToMongo();

app.get("/", (req, res) => {
  res.send("URL Shortening Service Running");
});

app.listen(port, () => console.log("Server running on port 5000"));