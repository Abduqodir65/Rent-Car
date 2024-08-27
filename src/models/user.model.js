import { Schema,model } from "mongoose";

const userSchema = new Schema({
  first_name: String,
  last_name: String,
  phone: String,
  password:String,
  username:String,
});

export const User = model("User", userSchema);

