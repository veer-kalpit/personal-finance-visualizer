import mongoose, {  Document } from "mongoose";

export interface ITransaction extends Document {
  amount: number;
  category: string;
  description: string;
  date: Date;
}

const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Other"],
  },
  description: { type: String },
  date: { type: Date, required: true, default: Date.now },
});

export const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);
