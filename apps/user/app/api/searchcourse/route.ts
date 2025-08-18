// app/api/courses/search/route.ts
import dbconnect from "lib/dbconnect";
import { NextResponse } from "next/server";
import { CourseModel } from "../../../../admin/models/Course";


export async function GET(req: Request) {
  try {
    await dbconnect();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const level = searchParams.get("level") || "";

    // Build filters
    const filters: any = {
        isPublished: true, 
    };
    if (q) {
      filters.title = { $regex: q, $options: "i" }; // case-insensitive search
    }
    if (category) {
      filters.category = category;
    }
    if (level) {
      filters.level = level;
    }

    const courses = await CourseModel.find(filters).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: courses },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error fetching courses:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
