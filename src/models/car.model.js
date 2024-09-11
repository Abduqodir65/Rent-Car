import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: true,
      trim: true,
    },
    price_daily: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    fuel_type: {
      type: String,
      required: true,
      enum: ["petrol", "diesel", "electric", "hybrid"],
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    collection: "cars",
    timestamps: true,
  }
);

const Car = mongoose.model("Car", carSchema);
export default Car;
