// app/api/whatsapp/route.ts
import dbconnect from "lib/dbconnect";
import { NextResponse } from "next/server";
import { uploadMedia } from "utils/cloudnary";
import PostModel from "../../../../../packages/models/Post";


const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN!;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "sahaayak123";
const API_VERSION = process.env.WHATSAPP_API_VERSION || "v17.0";

/**
 * GET - webhook verification (Meta will call this once when you register the webhook)
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new Response(challenge || "ok", { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

/**
 * Helper: send a simple text message back to a WhatsApp user
 */
async function sendWhatsAppText(to: string, body: string) {
  const res = await fetch(
    `https://graph.facebook.com/${API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    }
  );

  return res.ok ? await res.json() : Promise.reject(await res.text());
}

/**
 * Helper: download media from WhatsApp (two-step: get media url, then fetch binary)
 */
async function downloadWhatsAppMedia(mediaId: string): Promise<Buffer> {
  // 1) GET /{media-id}
  const metaRes = await fetch(
    `https://graph.facebook.com/${API_VERSION}/${mediaId}`,
    {
      headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` },
    }
  );
  if (!metaRes.ok) throw new Error(`Failed to fetch media metadata: ${await metaRes.text()}`);
  const metaJson = await metaRes.json();
  const mediaUrl = metaJson.url;
  if (!mediaUrl) throw new Error("No media url returned");

  // 2) Download bytes (binary)
  const fileRes = await fetch(mediaUrl, {
    headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` },
  });
  if (!fileRes.ok) throw new Error(`Failed to download media: ${await fileRes.text()}`);
  const arrayBuffer = await fileRes.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * POST - webhook handler for incoming WhatsApp messages
 */
export async function POST(req: Request) {
  try {
    await dbconnect();

    const body = await req.json().catch(() => ({}));
    // Basic defensive parsing - WhatsApp nested structure
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const messages = value?.messages;
    const message = messages?.[0];

    // If webhook event not a message (e.g., status), return 200
    if (!message) return NextResponse.json({ status: "no_message" });

    const from = message.from; // sender phone number (E.164)
    const messageType = message.type;

    // handle image messages
    if (messageType === "image") {
      // message.image.id contains the media id
      const mediaId = message.image?.id;
      const caption = message.image?.caption || message.text?.body || "Reported via WhatsApp";

      if (!mediaId) {
        await sendWhatsAppText(from, "Could not find image id. Please resend.");
        return NextResponse.json({ ok: false, reason: "no_media_id" }, { status: 400 });
      }

      // 1) download binary from WhatsApp
      const buffer = await downloadWhatsAppMedia(mediaId);

      // 2) optional: you can run hashing/duplicate checks here before uploading
      // 3) upload to Cloudinary (your helper accepts Buffer or dataUri)
      //    your uploadMedia supports Buffer, so pass buffer directly
      const uploaded = await uploadMedia(buffer);
      const photoUrl = uploaded.secure_url;

      // 4) Save to DB - create a post/complaint
      const ticketId = `C-${Date.now()}`;
      const newPost = new PostModel({
        title: caption,
        description: caption,
        category: "General",
        photoUrl,
        ticketId,
        userId: from,
        location: {}, // message.location? parse if user sent location separately
        pincode: "NA",
        department: "Municipal",
        source: "whatsapp",
        whatsapp_from: from,
      });
      await newPost.save();

      // 5) Reply to user with confirmation
      await sendWhatsAppText(
        from,
        `✅ Complaint received!\nTicket ID: ${ticketId}\nWe will review and update you.`
      );

      return NextResponse.json({ ok: true, ticketId });
    }

    // handle location type (user shares live location or pin)
    if (messageType === "location") {
      const loc = message.location; // { latitude, longitude, name, ... }
      const ticketId = `C-${Date.now()}`;
      const newPost = new PostModel({
        title: `Issue reported at ${loc.name || `${loc.latitude},${loc.longitude}`}`,
        description: `Location shared via WhatsApp`,
        category: "General",
        photoUrl: null,
        ticketId,
        userId: from,
        location: loc,
        pincode: "NA",
        department: "Municipal",
        source: "whatsapp",
        whatsapp_from: from,
      });
      await newPost.save();
      await sendWhatsAppText(from, `✅ Complaint received at location. Ticket ID: ${ticketId}`);
      return NextResponse.json({ ok: true, ticketId });
    }

    // handle text messages - support "STATUS <ticketId>" or new complaint text
    if (messageType === "text") {
      const text = message.text?.body?.trim() || "";

      // Support STATUS command: "STATUS TIC-12345" or "STATUS C-..."
      const statusMatch = text.match(/^STATUS\s+(\S+)/i);
      if (statusMatch) {
        const ticketId = statusMatch[1];
        const post = await PostModel.findOne({ ticketId }).lean();
        if (!post) {
          await sendWhatsAppText(from, `No ticket found with ID ${ticketId}. Please check and try again.`);
        } else {
          await sendWhatsAppText(
            from,
            `📊 Status for ${ticketId}\nStatus: ${post.status || "Pending"}\nDepartment: ${post.department || "N/A"}`
          );
        }
        return NextResponse.json({ ok: true });
      }

      // If not a command, treat as new complaint text (simple parsing)
      const ticketId = `C-${Date.now()}`;
      const newPost = new PostModel({
        title: text.slice(0, 80),
        description: text,
        category: "General",
        photoUrl: null,
        ticketId,
        userId: from,
        location: {},
        pincode: "NA",
        department: "Municipal",
        source: "whatsapp",
        whatsapp_from: from,
      });
      await newPost.save();
      await sendWhatsAppText(from, `✅ Complaint received!\nTicket ID: ${ticketId}\nReply STATUS ${ticketId} to check.`);
      return NextResponse.json({ ok: true, ticketId });
    }

    // If message type not handled:
    await sendWhatsAppText(from, "Sorry, I can't process that message type yet.");
    return NextResponse.json({ ok: false, reason: "unsupported_type" });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
