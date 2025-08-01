import { Schema, model, Types } from "mongoose";

export interface ITransaction {
  from: Types.ObjectId | null; // null for system credits
  to: Types.ObjectId;
  amount: number;
  type: "SEND" | "RECEIVE" | "CREDIT" | "DEBIT";
  timestamp: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    from: { type: Schema.Types.ObjectId, ref: "Wallet", default: null },
    to: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["SEND", "RECEIVE", "CREDIT", "DEBIT"],
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
