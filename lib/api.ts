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

// Map API domain to emoji + display name
export const DOMAIN_META: Record<string, { emoji: string; label: string }> = {
  cooking:    { emoji: "🍳", label: "Cooking" },
  business:   { emoji: "📊", label: "Business" },
  writing:    { emoji: "✍️", label: "Writing" },
  coding:     { emoji: "💻", label: "Development" },
  sales:      { emoji: "📧", label: "Sales" },
  seo:        { emoji: "🔍", label: "SEO" },
  research:   { emoji: "🔬", label: "Research" },
  music:      { emoji: "🎵", label: "Music" },
  general:    { emoji: "⚡", label: "General" },
};

export function domainEmoji(domain: string) {
  return DOMAIN_META[domain]?.emoji ?? "🐚";
}
export function domainLabel(domain: string) {
  return DOMAIN_META[domain]?.label ?? domain;
}
