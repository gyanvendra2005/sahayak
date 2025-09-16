import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbconnect from "lib/dbconnect";
import PostModel from "../../../../../packages/models/Post";

export async function GET(request: Request) {
  try {
    await dbconnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // ✅ Validate ObjectId before casting
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid userId format" },
        { status: 400 }
      );
    }

    const datas = await PostModel.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ timestamp: -1 })
      .lean();

    return NextResponse.json({ issues: datas }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Error fetching user issues:", err.message);
    return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 });
  }
}
