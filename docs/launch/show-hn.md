# Show HN Launch Package

## Title (recommended)
```
Show HN: Hermitcrab – MCP server exposing 333 expert YouTube channels as tools
```

## Timing
**Tuesday or Wednesday, 8–9am ET.** Check HN front page first — don't post if a major AI company just dropped news.

## Post Body

---

I built Hermitcrab because I kept noticing the same thing: you ask an LLM "how do I grow a community?" and you get a hedge. "It depends on your audience, your goals, your stage…" That's the LLM averaging over everyone who ever wrote about community building. It's not wrong, it's just useless when you need a decision.

The people who've actually done this — Greg Isenberg, Sahil Lavingia, Pieter Levels — have strong, opinionated views. They have frameworks. They have "always do X, never do Y" rules born from real experience. That information exists in their YouTube channels, but you can't query it programmatically, you can't cite a principle, and your AI agent has no idea it exists.

Hermitcrab is an MCP server that makes expert knowledge queryable. We processed 57 creator channels — transcripts, structured into discrete principles and frameworks with original quotes and prescriptions. 333 skills total, searchable by concept.

**You can connect right now:**

```
npx @modelcontextprotocol/inspector api.hermitcrab.app/mcp/
```

Or add to Claude Desktop / Cursor config:
```json
{
  "mcpServers": {
    "hermitcrab": {
      "url": "https://api.hermitcrab.app/mcp/"
    }
  }
}
```

Four tools available: `search_skills(query)`, `get_skill(skill_id)`, `find_related(skill_id)`, `list_packs()`.

Example query: `search_skills("when to raise prices")` returns principles from specific creators — not a summary, but a citable framework with the original context and an opinionated prescription.

**Technical decisions worth explaining:**

We deliberately didn't do RAG over raw transcripts. The output would still be a hedge — an LLM averaging over a creator's entire body of work. Instead, we do a structured extraction pass: each "skill" is a discrete, titled principle with a quoted source passage, a prescription ("do this"), and an anti-pattern ("not this"). The skill is the artifact, not the query response. This makes citations traceable and lets agents compare frameworks across creators.

The MCP layer was a deliberate bet. We could have built a web UI and called it a knowledge base. But the people who actually need expert frameworks during their workday are already inside AI agents — Claude Code, Cursor, Codex. Meeting them there seemed more honest than asking them to switch tabs.

**What's missing:** the catalog is English-only, YouTube-only, and biased toward indie business / startup content because that's what we processed first. Manufacturing, biotech, hardware — those are on the roadmap but not there yet. Creator quality control is manual right now, which caps how fast we can expand.

We're 5K transcripts processed, 57 creators, currently free to connect. Happy to answer questions about the extraction pipeline, the MCP implementation, or what's broken.

---

## First Comment (post within 60 seconds)

> Hi HN — builder here. Happy to go deep on any of this. A few things I'd especially want feedback on: (1) the skill extraction schema — we made specific tradeoffs about what counts as a "principle" vs. a "summary", would love pushback; (2) whether the MCP-native approach is the right surface vs. a REST API with a UI; (3) which content categories you'd actually use this for. The endpoint is live, no auth needed for browsing. Go break it.

## Pre-canned responses to expected criticism

**"This is just RAG on YouTube transcripts."**
→ Acknowledge the surface similarity, explain the structural difference. RAG retrieves passages; Hermitcrab retrieves extracted principles. Point to the schema. Offer to share example skill JSON.

**"Why would I trust Greg Isenberg's YouTube opinions as ground truth?"**
→ Agree with the frame. The value is specificity and citability, not authority. Generic LLM advice is averaged over everyone; this is traceable to one person's stated framework. Disagreeing with it is now possible.

**"MCP is still not stable / too new."**
→ True, that's a real bet. The alternative is a web search bar no one opens mid-coding session.

**"57 creators is tiny."**
→ Yes — narrow catalog, high extraction quality was the deliberate tradeoff. Give skills-per-creator numbers to show density, not breadth.

## Supporter briefing
Brief 4–6 people (creators on platform, power users) on exact post time.
Message: *"I'm posting on HN at 9am Tuesday. If you've used Hermitcrab and found it useful, a genuine comment about your experience would help. Don't vote unless you genuinely think it's interesting."*
Goal: 3 real comments in first 30 minutes.

## Pre-launch checklist
- [ ] MCP endpoint live and tested with inspector command
- [ ] `list_packs()` returns something interesting (no empty state)
- [ ] 30 mins free to respond to early comments
- [ ] Post read aloud — remove any marketing-copy phrases
- [ ] First comment drafted and ready to paste in 60 seconds
- [ ] 4–6 supporters briefed
- [ ] HN front page checked — no competing AI news that day
