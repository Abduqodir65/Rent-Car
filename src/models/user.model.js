import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name berilishi shart⚠️"],
      trim: true,
    },
    last_name: {
      type: String,
      trim: true,
      required: false,
    },
    username: {
      type: String,
      unique: true,
      required: [true, "username berilishi shart!"],
    },
    password: {
      type: String,
      unique: true,
      required: [true, "password berilishi shart!"],
    },
    phone: {
      type: String,
      required: true,
      minLength: [12, "Nomer 12 uzunlikda bo'lishi kerak"],
      maxLength: 12,
    },
    email: {
      type: String,
      unique: [true, "Email yagona bo'lishi kerak"],
    },
    role: {
      type: String,
      enum: {
        values: ["student", "teacher", "admin", "super-admin"],
      },
      required: true,
      default: "student",
    },
    birthDate: {
      type: Date,
      required: true,
    },
    image_url: {
      type: String,
      required: false,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpireTime: {
      type: Date,
    },
    groups: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Group",
      },
    ],
  },
  {
    collection: "users",
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
