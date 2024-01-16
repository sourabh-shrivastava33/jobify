import { readFile } from "fs/promises";
import User from "./models/UserModel.js";
import Job from "./models/JobModel.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

try {
  await mongoose.connect(process.env.MONGO_URL);
  const user = await User.findOne({ email: "john@example.com" });
  const jobsJson = JSON.parse(
    await readFile(new URL("./utils/mockData.json", import.meta.url))
  );
  const jobs = jobsJson.map((job) => {
    return { ...job, createdBy: user._id };
  });
  await Job.deleteMany({ createdBy: user._id });
  await Job.create(jobs);
  console.log("Success!!!");
  process.exit(0);
} catch (error) {
  console.log(error);
  process.exit(1);
}
