import { body, param, validationResult } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} from "../errors/customErrors.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";
import mongoose from "mongoose";
import JobModel from "../models/JobModel.js";
import UserModel from "../models/UserModel.js";
const withValidationErrors = (validateValue) => {
  return [
    validateValue,
    (req, res, next) => {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        const errors = result.array().map((error) => error.msg);
        if (errors[0].startsWith("no job")) throw new NotFoundError(errors);
        if (errors[0].startsWith("not authorized"))
          throw new UnAuthorizedError(errors);
        else throw new BadRequestError(errors);
      }
      next();
    },
  ];
};

export const validateJobInput = withValidationErrors([
  body("company").notEmpty().withMessage("company is required"),
  body("position").notEmpty().withMessage("position is required"),
  body("jobLocation").notEmpty().withMessage("job location is required"),
  body("jobStatus")
    .isIn(Object.values(JOB_STATUS))
    .withMessage("invalid job status"),
  body("jobType").isIn(Object.values(JOB_TYPE)).withMessage("invalid job type"),
]);

export const validParamsId = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    const isValid = mongoose.Types.ObjectId.isValid(value);
    if (!isValid) throw new Error("invalid mongodb id");
    const job = await JobModel.findById(value);
    if (!job) throw new Error(`no job with id ${value}`);
    const isOwner = req.user.userId === job.createdBy.toString();
    const isAdmin = req.user.role === "admin";
    if (!isAdmin && !isOwner) {
      throw new Error("not authorized to access this data");
    }
  }),
]);

export const validateRegisterInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("name is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email) => {
      const user = await UserModel.findOne({ email });
      console.log(user);
      if (user) throw new BadRequestError("email already exists");
    }),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be atleast of 8 character"),
  body("lastName").notEmpty().withMessage("last name is required"),
  body("location").notEmpty().withMessage("location is required"),
]);

export const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("password").notEmpty().withMessage("password is required"),
]);

export const validateUpdateUserInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("name is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email, { req }) => {
      const user = await UserModel.findOne({ email });
      if (user && user._id.toString() !== req.user.userId)
        throw new BadRequestError("email already exists");
    }),

  body("lastName").notEmpty().withMessage("last name is required"),
  body("location").notEmpty().withMessage("location is required"),
]);
