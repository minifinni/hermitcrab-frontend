import { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.hermitcrab.app";
const API_KEY = process.env.HERMITCRAB_API_KEY || process.env.NEXT_PUBLIC_HERMITCRAB_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!Array.isArray(body.pack_ids) || body.pack_ids.length < 2) {
      return new Response("Need at least 2 expert crabs", { status: 400 });
    }

    const upstream = await fetch(`${API_URL}/v1/sandbox/spark`, {
      method: "POST",
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pack_ids: body.pack_ids }),
    });

    if (!upstream.ok || !upstream.body) {
      const err = await upstream.text();
      return new Response(`Backend error: ${err}`, { status: upstream.status });
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (e: any) {
    return new Response(`Error: ${e.message}`, { status: 500 });
  }
}
