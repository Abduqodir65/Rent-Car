import jwt from "jsonwebtoken";
import { BadRequestException } from "../exceptions/bad-request.exception.js";
import { verifyToken } from "../helpers/jwt.helper.js";

export const CheckAuthGuard = (isProtected) => {
  return (req, _, next) => {
    if (!isProtected) {
        return next();
    }

    const token = req.headers["authorization"];

    if (!(token && token.startsWith("Bearer") && token.split(" ")[1])) {
      throw new BadRequestException(`Given token: ${token} is invalid`);
    }

    const accessToken = token.split(" ")[1];

    verifyToken(accessToken);

    const { id, role } = jwt.decode(accessToken);

    req.userId = id;
    req.role = role;

    next();
  };
};