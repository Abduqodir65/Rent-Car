import { ConflictException } from "../exceptions/conflic.exception.js";

export const CheckRolesGuard = (...roles) => {
  return (req, _, next) => {
    if (!roles.length) {
      return next();
    }


    if (!roles.includes(req.role)) {
      throw new ConflictException(
        `User don't have access to url: ${req.url} with method: ${req.method}`
      );
    }

    next();
  };
};