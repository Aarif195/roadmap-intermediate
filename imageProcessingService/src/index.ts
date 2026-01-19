import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connectToMongo } from "./db";
import authroutes from "./routes/authroutes";


dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send('Hello Dad ')
});


app.use("/auth", authroutes);


connectToMongo();

app.listen(port, () => console.log(`Server running on port ${port}`));
