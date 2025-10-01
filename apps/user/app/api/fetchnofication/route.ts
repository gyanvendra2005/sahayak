// /app/api/fetchnofication/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    // Extract userId from query parameters
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Call your Express server to get notifications from MongoDB
    const response = await axios.get(`http://localhost:4000/notifications/${userId}`);
    const notifications = response.data;

    // Map the data to match your frontend Notification interface
    const formatted = notifications.map((n: any) => ({
      id: n._id,
      type: n.type,
      title: n.title,
      message: n.message,
      timestamp: n.createdAt,
      read: false, // or n.read if you store read status in DB
      issueId: n.issueId,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
