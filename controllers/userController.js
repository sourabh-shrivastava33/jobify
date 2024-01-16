import { StatusCodes } from "http-status-codes";
import UserModel from "../models/UserModel.js";
import JobModel from "../models/JobModel.js";
import cloudinary from "cloudinary";
import { promises as fs } from "fs";
export const getCurrentUser = async (req, res) => {
  const user = await UserModel.findOne({ _id: req.user.userId });
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

export const getApplicationStats = async (req, res) => {
  const users = await UserModel.countDocuments();
  const jobs = await JobModel.countDocuments();
  res.status(StatusCodes.OK).json({ jobs, users });
};
export const updateUser = async (req, res) => {
  const newUser = { ...req.body };
  delete newUser.password;
  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
    newUser.avatar = response.secure_url;
    newUser.avatarPublicId = response.public_id;
  }

  const updateUser = await UserModel.findByIdAndUpdate(
    req.user.userId,
    newUser
  );
  if (req.file && updateUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(updateUser.avatarPublicId);
  }
  res.status(StatusCodes.OK).json({ msg: "User updated successfully" });
};
