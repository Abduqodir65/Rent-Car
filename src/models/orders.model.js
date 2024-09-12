import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    car_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Car",
      required: true,
    },
    customer_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    start_time: {
      type: Date,
      required: true,
    },
    finish_time: {
      type: Date,
      required: true,
    },
    total_amount: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "orders",
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
