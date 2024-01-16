import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import "cookie-parser";
const app = express();
import morgan from "morgan";
import mongoose from "mongoose";

// routes
import jobRouter from "./routes/jobRoute.js";
import authRouter from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
// public
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
const __dirname = fileURLToPath(dirname(import.meta.url));
import cloudinary from "cloudinary";
// middleware

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
import errorHandlerMiddleWare from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";
import cookieParser from "cookie-parser";
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(path.resolve(__dirname, "./client/dist")));
app.use(cookieParser());
app.use(express.json());
app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "test route" });
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobRouter);
app.use("/api/v1/users", authenticateUser, userRoute);

app.use("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});

app.use("*", (req, res) => {
  res.status(404).json({
    msg: "Route not found",
  });
});
app.use(errorHandlerMiddleWare);

const port = process.env.PORT || 5100;
try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on ${port}...`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
