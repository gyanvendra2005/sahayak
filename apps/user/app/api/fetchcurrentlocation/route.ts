import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!lat || !lng) {
      return NextResponse.json({ error: "Missing lat/lng" }, { status: 400 });
    }

    // Step 1: Get address + pincode from Nominatim
   const geoRes = await fetch(
  `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`,
  {
    headers: {
      "User-Agent": "Sahaayak-App/1.0 (contact@example.com)",
    },
  }
);


    if (!geoRes.ok) {
      return NextResponse.json({ error: "Nominatim failed" }, { status: geoRes.status });
    }

    const geoData = await geoRes.json();
    const pincode = geoData.address?.postcode;

    if (!pincode) {
      return NextResponse.json({ error: "No pincode found" }, { status: 404 });
    }

    // Step 2: Get post office details from India Post
    // const poRes = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
    //   cache: "no-store",
    // });

    // if (!poRes.ok) {
    //   return NextResponse.json({ error: "India Post API failed" }, { status: poRes.status });
    // }

    // const poData = await poRes.json();
    // const postOffices = poData[0]?.PostOffice || [];

    return NextResponse.json({
      geoData,
      pincode,
      // postOffices: postOffices[0] || null,
    });
  } catch (err: any) {
    console.error("Error fetching Post Office:", err);
    return NextResponse.json(
      { error: "Failed to fetch Post Office details" },
      { status: 500 }
    );
  }
}
