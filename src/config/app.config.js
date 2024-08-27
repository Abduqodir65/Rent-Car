import { config } from "dotenv";

config();

export const appConfig = {
  port: parseInt(process.env.APP_PORT) || 7070,
  host: process.env.APP_HOST || "localhost",
};
