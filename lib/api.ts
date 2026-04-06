const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.hermitcrab.app";
const API_KEY = process.env.NEXT_PUBLIC_HERMITCRAB_API_KEY || process.env.HERMITCRAB_API_KEY || "";

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "X-API-Key": API_KEY,
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export interface ApiSkill {
  skill_id: string;
  title: string;
  domain: string;
  chef: string;
  num_principles: number;
  techniques: string[];
}

export interface ApiSkillDetail extends ApiSkill {
  context: string;
  equipment: string[];
  temperatures: { temp_c: number; duration: string; context: string }[];
  principles: ApiPrinciple[];
}

export interface ApiPrinciple {
  principle_id: string;
  category: string;
  principle: string;
  details: string;
  why: string;
  chef_quotes: string[];
  attribution?: string;
  confidence_score?: number;
  prescription?: string;
}

export interface ApiSearchResult {
  skill: ApiSkill;
  score: number;
  matching_principles: ApiPrinciple[];
}

export async function getSkills(domain?: string, page = 1, perPage = 20): Promise<ApiSkill[]> {
  const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
  if (domain) params.set("domain", domain);
  return apiFetch(`/v1/skills?${params}`);
}

export async function getSkill(skillId: string): Promise<ApiSkillDetail> {
  return apiFetch(`/v1/skills/${skillId}`);
}

export async function searchSkills(query: string, domain?: string, limit = 10): Promise<ApiSearchResult[]> {
  return apiFetch("/v1/search", {
    method: "POST",
    body: JSON.stringify({ query, domain, limit }),
  });
}

export async function getDomains(): Promise<{ domain: string; count: number }[]> {
  return apiFetch("/v1/domains");
}

export async function getRelatedSkills(skillId: string): Promise<{ skill_id: string; title: string; domain: string; shared_techniques: number }[]> {
  return apiFetch(`/v1/skills/${skillId}/related`);
}

export interface ApiCreator {
  handle: string;
  name: string;
  category: string;
  status: "done" | "pending" | "processing";
  video_count: number;
  skill_count?: number;
  progress_pct?: number;
  videos_processed?: number;
}

export async function getCreators(category?: string): Promise<ApiCreator[]> {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  const qs = params.toString() ? `?${params}` : "";
  return apiFetch(`/v1/channels${qs}`);
}

// ── Packs ──

export interface ApiPack {
  pack_id: string;
  name: string;
  domain: string;
  skill_count: number;
  creator_name?: string;
  creator_handle?: string;
  description?: string;
  pack_type?: "creator" | "topic";
}

// Backend returns title/num_skills/creator — map to frontend interface
function mapPack(raw: any): ApiPack {
  return {
    pack_id: raw.pack_id,
    name: raw.title || raw.name || "Untitled Pack",
    domain: raw.domain,
    skill_count: raw.num_skills ?? raw.skill_count ?? 0,
    creator_name: raw.creator ?? raw.creator_name,
    description: raw.description,
    pack_type: raw.pack_type || (raw.pack_id?.startsWith("TOPIC_") ? "topic" : "creator"),
  };
}

export async function getPacks(): Promise<ApiPack[]> {
  const raw = await apiFetch("/v1/packs");
  return raw.map(mapPack);
}

export async function getPack(packId: string): Promise<ApiPack & { skills: ApiSkill[] }> {
  const raw = await apiFetch(`/v1/packs/${packId}`);
  return { ...mapPack(raw), skills: raw.skills || [] };
}

export async function getSkillsByCreator(handle: string, page = 1, perPage = 50): Promise<ApiSkill[]> {
  const params = new URLSearchParams({ channel: handle, page: String(page), per_page: String(perPage) });
  return apiFetch(`/v1/skills?${params}`);
}

// Map API domain to emoji + display name
export const DOMAIN_META: Record<string, { emoji: string; label: string; sprite?: string }> = {
  cooking:      { emoji: "🍳", label: "Cooking", sprite: "/sprites/chef_hermit.png" },
  food:         { emoji: "🍽️", label: "Food", sprite: "/sprites/chef_hermit.png" },
  business:     { emoji: "📊", label: "Business", sprite: "/sprites/gold_hermit.png" },
  product:      { emoji: "🚀", label: "Product", sprite: "/sprites/gold_hermit.png" },
  ai:           { emoji: "🤖", label: "AI", sprite: "/sprites/ai_hermit.png" },
  tech:         { emoji: "💡", label: "Tech", sprite: "/sprites/tech_hermit.png" },
  dev:          { emoji: "💻", label: "Development", sprite: "/sprites/tech_hermit.png" },
  coding:       { emoji: "💻", label: "Development", sprite: "/sprites/tech_hermit.png" },
  finance:      { emoji: "💰", label: "Finance", sprite: "/sprites/gold_hermit.png" },
  fitness:      { emoji: "💪", label: "Fitness", sprite: "/sprites/gym_hermit.png" },
  health:       { emoji: "🧬", label: "Health", sprite: "/sprites/lab_hermit.png" },
  biotech:      { emoji: "🔬", label: "Biotech", sprite: "/sprites/lab_hermit.png" },
  marketing:    { emoji: "📣", label: "Marketing", sprite: "/sprites/marketing_hermit.png" },
  copywriting:  { emoji: "✍️", label: "Copywriting", sprite: "/sprites/pink_hermit.png" },
  seo:          { emoji: "🔍", label: "SEO", sprite: "/sprites/seo_hermit.png" },
  design:       { emoji: "🎨", label: "Design", sprite: "/sprites/artist_hermit.png" },
  realestate:   { emoji: "🏠", label: "Real Estate", sprite: "/sprites/gold_hermit.png" },
  writing:      { emoji: "✍️", label: "Writing", sprite: "/sprites/pink_hermit.png" },
  productivity: { emoji: "⏱️", label: "Productivity", sprite: "/sprites/blue_hermit.png" },
  career:       { emoji: "🎯", label: "Career", sprite: "/sprites/gold_hermit.png" },
  sales:        { emoji: "📧", label: "Sales", sprite: "/sprites/marketing_hermit.png" },
  research:     { emoji: "🔬", label: "Research", sprite: "/sprites/lab_hermit.png" },
  music:        { emoji: "🎵", label: "Music", sprite: "/sprites/artist_hermit.png" },
  gardening:    { emoji: "🌱", label: "Gardening", sprite: "/sprites/gardening_hermit.png" },
  general:      { emoji: "⚡", label: "General", sprite: "/sprites/gold_hermit.png" },
};

export function domainSprite(domain: string): string {
  return DOMAIN_META[domain]?.sprite ?? "/sprites/gold_hermit.png";
}

export function domainEmoji(domain: string) {
  return DOMAIN_META[domain]?.emoji ?? "🐚";
}
export function domainLabel(domain: string) {
  return DOMAIN_META[domain]?.label ?? domain;
}
