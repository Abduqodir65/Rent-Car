import { config } from "dotenv";

config();

const passwordResetConfig = {
    secretKey: process.env.PASSWORD_RESET_SECRET_KEY,
    expireTime: process.env.PASSWORD_RESET_EXPIRE_TIME,
};

export default passwordResetConfig;