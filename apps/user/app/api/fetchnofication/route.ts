


// import { Notification } from "";
// import dbConnect from "@/lib/dbConnect";
import Notification from "../../../../../packages/models/Notification";

import dbconnect from "lib/dbconnect";

export async function GET(req: Request) {
    await dbconnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const notifications = await Notification.find({userId})
  return Response.json({ notifications });
}

// POST - create new notification
export async function POST(req: Request) {
  const body = await req.json();
  const notif = await Notification.create(body);
  return Response.json({ notification: notif });
}

// PATCH - mark as read
export async function PATCH(req: Request) {
  const { id } = await req.json();
  await Notification.findByIdAndUpdate(id, { read: true });
  return Response.json({ success: true });
}
