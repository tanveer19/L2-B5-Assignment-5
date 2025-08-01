import { Schema, model, Types } from "mongoose";

const walletSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, default: 50 }, // initial ৳50
});

export const Wallet = model("Wallet", walletSchema);
