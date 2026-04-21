# Community Targeting & MCP Directories

## MCP Directories (submit in this order)

| Priority | Platform | URL | How to submit | Notes |
|---|---|---|---|---|
| 1 | **MCP.so** | https://mcp.so/submit | Submit form | Claude Desktop queries this directly — highest priority |
| 2 | **Glama.ai** | https://glama.ai/mcp/servers | Public GitHub repo + ping their Discord | Auto-indexes; needs well-formed mcp.json manifest |
| 3 | **PulseMCP** | https://pulsemcp.com | Submit button in navbar | Hand-reviewed; high curation signal |
| 4 | **Smithery.ai** | https://smithery.ai | `smithery mcp publish <url>` CLI | Clean app-store UI; shows install commands to users |
| 5 | **awesome-mcp-servers** | https://github.com/punkpeye/awesome-mcp-servers | Open a PR | Referenced by developers searching for quality MCP servers |

## Discord Communities

| Community | Why | How to post |
|---|---|---|
| **Anthropic Discord** (86k members) | Direct ICP overlap with Claude Code users; #mcp channel | Post before/after demo — do not use marketing language |
| **Cursor Discord** | MCP-compatible IDE users | Post in Tools & Integrations |
| **Windsurf Discord** | Same ICP as Cursor | Same approach |

## Reddit Communities

| Subreddit | Members | Rules | Best format |
|---|---|---|---|
| **r/SideProject** | 453K | Self-promo encouraged | "I built X" post with demo |
| **r/ClaudeAI** | Growing | Self-promo tolerated if useful | MCP skill marketplace angle |
| **r/LocalLLaMA** | ~350K | Allowed if not >10% of activity | Show MCP working with open model agents |
| **r/OpenAI** | 1M+ | Useful tools OK | Use-case post, no spam |
| **r/MachineLearning** | 3M | Monthly showcase threads only | Participate in "What are you working on?" thread |

**Reddit rules:** Participate for 2–3 days before posting. Comment on 5+ other threads. Never post verbatim across subs.

## Demo Scripts (before/after format — use these for all community posts)

### Demo 1: Community Building (Greg Isenberg skill)

**User query:** "I just launched an indie developer tool. Should I start a Discord community? How do I grow it?"

**Generic AI response:**
> "Starting a Discord is a great idea! Post consistently, engage with members, create different channels for different topics, run events, and promote it on social media."

**Hermitcrab response (Greg Isenberg skill via MCP):**
> "Before you create a Discord, you need to answer one question: do you have 10 people who would be genuinely upset if it disappeared tomorrow? That's your signal.
>
> Greg Isenberg's principle: Minimum Viable Community (MVC). Scale is the enemy of intimacy early on. Start with a private channel or email thread with your 10 most engaged users — not a public server. Let them shape the culture.
>
> Prescription: DM your first 50 users personally. The ones who reply in paragraphs become your founding members. Only open publicly once those 10–50 people are having conversations you didn't start.
>
> Do NOT post a Discord invite on Product Hunt day one. You'll flood the room with one-time-visitors and dilute the signal."

---

### Demo 2: SaaS Pricing

**User query:** "I'm launching a B2B SaaS tool. I'm thinking $9/mo, $19/mo, $49/mo tiers. Does this look right?"

**Generic AI response:**
> "Your pricing tiers look reasonable! Make sure to clearly differentiate the value at each tier. Consider offering a free trial to reduce friction."

**Hermitcrab response (pricing expert skill via MCP):**
> "The numbers aren't the problem — the structure is. You have three tiers with no anchor.
>
> Principle: 'The job of your highest tier is not to sell — it is to make the middle tier feel like a bargain.' Your $49 tier needs to feel almost unreasonably generous so $19 becomes the obvious choice. $9/$19/$49 reads as a linear ladder.
>
> Fix: Add a $149/mo tier with something that costs you nothing at scale — unlimited seats, API access, white-label. This makes $49 look like the smart professional choice.
>
> Second principle: 'Price for your best customer, not your median one.' Developer tools under $99/mo are often perceived as hobby projects.
>
> Recommendation: Test $29/$79/$149 before locking in $9/$19/$49."
