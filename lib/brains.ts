import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BRAINS_DIR = path.join(process.cwd(), "brains/creators");

export interface Brain {
  slug: string;
  name: string;
  title: string;
  description: string;
  domains: string[];
  author: string;
  version: string;
  triggers: string[];
  content: string;
}

export function getAllBrains(): Brain[] {
  const files = fs.readdirSync(BRAINS_DIR).filter(f => f.endsWith(".md"));
  return files.map(file => parseBrain(file.replace(".md", ""))).sort((a, b) =>
    a.title.localeCompare(b.title)
  );
}

export function getBrain(slug: string): Brain | null {
  try {
    return parseBrain(slug);
  } catch {
    return null;
  }
}

function parseBrain(slug: string): Brain {
  const raw = fs.readFileSync(path.join(BRAINS_DIR, `${slug}.md`), "utf-8");
  const { data, content } = matter(raw);

  const firstHeading = content.match(/^# (.+)$/m)?.[1] ?? slug;

  return {
    slug,
    name: data.name ?? slug,
    title: firstHeading,
    description: (data.description ?? "").trim(),
    domains: data.domains ?? [],
    author: data.author ?? "",
    version: data.version ?? "1.0.0",
    triggers: data.triggers ?? [],
    content,
  };
}
