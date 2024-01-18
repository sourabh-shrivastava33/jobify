import {
  BadRequestError,
  UnAuthenticatedError,
  UnAuthorizedError,
} from "../errors/customErrors.js";
import { verifyJwt } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new UnAuthenticatedError("invalid credentials");
  try {
    const { userId, role } = verifyJwt(token);
    const testUser = userId === "659f9d69569b767e339efaaa";
    req.user = { userId, role, testUser };
    next();
  } catch (error) {
    throw new UnAuthenticatedError("invalid credentials");
  }
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnAuthorizedError("not authorized to access this route");
    }
    next();
  };
};

export const checkTestUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError("Demo user, Read only!");
  }
  next();
};
