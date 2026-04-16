import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.hermitcrab.app";
const API_KEY = process.env.HERMITCRAB_API_KEY || process.env.NEXT_PUBLIC_HERMITCRAB_API_KEY || "";

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/v1/packs`, {
      headers: { "X-API-Key": API_KEY, "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return NextResponse.json({ error: `API error: ${res.status}` }, { status: res.status });
    }
    const data = await res.json();
    // Map backend fields to frontend interface
    const mapped = data.map((p: any) => ({
      pack_id: p.pack_id,
      name: p.title || p.name || "Untitled",
      domain: p.domain,
      skill_count: p.num_skills ?? p.skill_count ?? 0,
      creator_name: p.creator ?? p.creator_name,
      description: p.description,
      pack_type: p.pack_type || (p.pack_id?.startsWith("TOPIC_") ? "topic" : "creator"),
    }));
    return NextResponse.json(mapped);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
