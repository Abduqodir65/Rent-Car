import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Customer",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["credit_card", "debit_card", "paypal", "stripe"],
    },
    card: {
      type: String,
      required: true,
    },
  },
  {
    collection: "wallets",
    timestamps: true,
  }
);

const Wallet = mongoose.model("Wallet", walletSchema);
export default Wallet;
