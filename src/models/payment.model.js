import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Order",
      required: true,
    },
    customer_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Customer",
      required: true,
    },
    wallet_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Wallet",
      required: true,
    },
    payment_date: {
      type: Date,
      required: true,
    },
  },
  {
    collection: "payments",
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
