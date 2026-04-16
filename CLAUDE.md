# HermitCrab — CLAUDE.md

## What is this project?
HermitCrab is a **brain rental marketplace** for AI agents. Users rent temporary access to expert decision-making brains instead of buying static skills.

**Core concept shift:** "Don't buy a skill. Rent a brain."

## Recent Changes (April 2026)

### 🧠 Semantic Pivot: Skills → Brains
Complete rebrand from "skills marketplace" to "brain rental platform":

| Before | After |
|--------|-------|
| "Sell Your Skill" | "Rent Your Brain" |
| "Skill Packs" | "Brain Packs" |
| "Download" | "Rent" |
| `SkillCard.tsx` | `BrainCard.tsx` |
| "Decisions with confidence" (hero) | "Rent a brain" |
| "Creators" (nav) | "Brains" |

**Files updated:**
- `app/page.tsx` — Hero, CTAs, feature sections
- `app/sell/page.tsx` — Creator flow renamed
- `components/Navbar.tsx` — Navigation labels
- `components/Footer.tsx` — Footer copy
- `components/SkillCard.tsx` → `BrainCard.tsx` — Component rename
- `app/skills/*` → "Rent a Brain" browse
- `app/creators/*` → Creator pages reframed
- `app/packs/*` → "Brain Packs"
- `app/dashboard/*` → "My Rented Brains"
- `app/layout.tsx` — Meta title: "Rent a Brain"

### 🔗 GBrain Discovery
Found Garry Tan's **gbrain** project (github.com/garrytan/gbrain):
- 8,465 stars, 947 forks
- 25 production skills
- 17,888 pages, 4,383 people, 723 companies
- Built for OpenClaw & Hermes agents

**GBrain skill structure** (superior to current):
```yaml
---
name: skill-name
version: 1.0.0
description: What it does
triggers: ["when to activate"]
tools: [search, ingest, enrich]
mutating: true/false
---

## Contract
What this skill guarantees

## Phases
Step-by-step workflow

## Output Format
Expected results

## Anti-Patterns
What NOT to do
```

### 🚀 Launch Strategy Brain (In Progress)
Researching creators to build first real brain:
- **Greg Isenberg** — Primary target ($500k Funnel Blueprint)
- **Lenny Rachitsky** — B2B frameworks
- **Nathan Barry** — Email launch sequences

Brain structure defined (7 sections):
1. Principles — Launch mindset
2. Decision Frameworks — When/where/how
3. Tactical Playbooks — PH, HN, waitlists
4. Anti-Patterns — 6 failure traps
5. Case Studies — Notion, Figma, Linear
6. Templates — Checklists & frameworks
7. Metrics — Benchmarks

### 📦 API Notes
Base URL: `https://api.hermitcrab.app`
Key: `lm_d6e3f28a82eb72a26d180284e3220457`

Endpoints:
- `GET /v1/skills` — List brains
- `GET /v1/skills/:id` — Get brain details
- `POST /v1/search` — Search brains
- `GET /v1/channels` — List creators
- `GET /v1/packs` — List brain packs

## Tech Stack
- Next.js 15 + React + TypeScript
- Tailwind CSS
- Supabase (auth + DB)
- Pixel art / retro gaming aesthetic
- Press Start 2P font

## File Structure
```
app/
  page.tsx              # Landing ("Rent a brain")
  sell/page.tsx         # Creator page ("Rent Your Brain")
  skills/               # Browse brains
  creators/             # Creator profiles
  packs/                # Brain packs
  dashboard/            # "My Rented Brains"
components/
  Navbar.tsx
  Footer.tsx
  BrainCard.tsx         # Was SkillCard.tsx
lib/
  api.ts                # API client
  supabase/             # Auth
```

## Next Steps
1. ⏳ Complete GBrain skill extraction (4 agents running)
2. ⏳ Upload first real brain (launch strategy)
3. ⏳ Test renting/using a brain
4. Consider: Upgrade skill structure to match GBrain spec

## Decisions Made
- ✅ Full semantic pivot to "brain rental" completed
- ✅ Meta title simplified to "Rent a Brain"
- 🔄 GBrain integration in progress
- 🔄 Launch strategy brain research complete

## Open Questions
- Should we adopt GBrain's full skill structure?
- Upload entire GBrain project or extract best skills?
- How to handle skill chaining/composability?
