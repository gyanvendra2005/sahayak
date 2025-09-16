import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!lat || !lng) {
      return NextResponse.json({ error: "Missing lat/lng" }, { status: 400 });
    }

    // Step 1: Get address + pincode
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      { headers: { "User-Agent": "Sahaayak-App/1.0 (contact@example.com)" } }
    );
    const geoData = await geoRes.json();
    const pincode = geoData.address.postcode;

    if (!pincode) {
      return NextResponse.json({ error: "No pincode found" }, { status: 404 });
    }

    // Step 2: Get post office details from India Post
    const poRes = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const poData = await poRes.json();

    const postOffices = poData[0]?.PostOffice || [];

    return NextResponse.json({
      pincode,
      postOffices: postOffices[0],
    });
  } catch (err: any) {
    console.error("Error fetching Post Office:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch Post Office details" },
      { status: 500 }
    );
  }
}
