"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const urlRoutes_1 = __importDefault(require("./routes/urlRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use("/urls", urlRoutes_1.default);
(0, db_1.connectToMongo)();
app.get("/", (req, res) => {
    res.send("URL Shortening Service Running");
});
app.listen(port, () => console.log("Server running on port 5000"));
