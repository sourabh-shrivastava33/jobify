import { StatusCodes } from "http-status-codes";
import UserModel from "../models/UserModel.js";
import hashPassword, { isValidPassword } from "../utils/passwordUtils.js";
import { UnAuthenticatedError } from "../errors/customErrors.js";
import { createJwt } from "../utils/tokenUtils.js";
export const register = async (req, res) => {
  const isFirstAccount = (await UserModel.countDocuments()) === 0;
  req.body.role = isFirstAccount ? "admin" : "user";
  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;
  const user = await UserModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: "User created successfully" });
};

export const login = async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) throw new UnAuthenticatedError("invalid creadentials");
  const isPasswordCorrect = await isValidPassword(
    req.body.password,
    user.password
  );
  if (!isPasswordCorrect)
    throw new UnAuthenticatedError("invalid creadentials");
  const token = createJwt({ userId: user._id, role: user.role });
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + oneDay),
  });
  res.status(StatusCodes.OK).json({ msg: "logged in successfully" });
};

export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logout successfully" });
};
