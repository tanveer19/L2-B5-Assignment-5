import { Schema, model, Types } from "mongoose";

const transactionSchema = new Schema(
  {
    type: { type: String, enum: ["TOPUP", "WITHDRAW", "SEND"], required: true },
    from: { type: Types.ObjectId, ref: "User" },
    to: { type: Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Transaction = model("Transaction", transactionSchema);
