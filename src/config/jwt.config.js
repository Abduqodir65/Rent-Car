import { config } from "dotenv";

config();

const jwtConfig = {
  secretKey: process.env.JWT_SECRET_KEY,
  expireTime: process.env.JWT_EXPIRE_TIME,
};

export default jwtConfig;