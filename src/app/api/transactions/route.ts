import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Transaction } from "@/lib/transactions";
import type { NextRequest } from "next/server";

export async function GET() {
  await connectDB();
  const transactions = await Transaction.find().sort({ date: -1 });
  return NextResponse.json(transactions);
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();

    if (!data.amount || !data.category || !data.date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { _id, ...transactionData } = data;
    console.log(_id);
    const transaction = new Transaction(transactionData);
    await transaction.save();
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error adding transaction:", error);
    return NextResponse.json(
      { error: "Failed to add transaction" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, ...data } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTransaction, { status: 200 });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const deletedTransaction = await Transaction.findByIdAndDelete(id);
    if (!deletedTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Transaction deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
