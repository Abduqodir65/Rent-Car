import mongoose from "mongoose";
import { mongoConfig } from "../config/mongo.config.js";

export async function mongoDB() {
  await mongoose.connect(mongoConfig.url);
}
