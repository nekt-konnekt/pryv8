import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { side, answers, email, whatsapp, source, honeypot, age_confirmed } = body ?? {};

    if (honeypot) return NextResponse.json({ ok: true });
    if (!["user", "creator"].includes(side)) return NextResponse.json({ error: "Invalid side" }, { status: 400 });
    if (!email || !whatsapp || age_confirmed !== true) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!url || !key) {
      console.warn("PRYV8 validation received without Supabase configuration");
      return NextResponse.json({ ok: true, stored: false });
    }

    const response = await fetch(`${url}/rest/v1/validation_responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        side,
        answers,
        email,
        whatsapp,
        source: source || "direct",
        age_confirmed: true,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Supabase insert failed:", detail);
      return NextResponse.json({ error: "Could not save response" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, stored: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}