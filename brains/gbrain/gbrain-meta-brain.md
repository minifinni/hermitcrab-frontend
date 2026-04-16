# GBrain Meta-Brain

---
name: gbrain
version: 1.0.0
description: |
  The complete guide to GBrain — Garry Tan's production brain system of 25 
  specialized AI skills. Learn what GBrain is, how all the skills work together, 
  and how to use them effectively in your own work.
triggers:
  - "what is gbrain"
  - "garry tan brain system"
  - "gbrain skills"
  - "how to use gbrain"
  - "gbrain overview"
  - "explain gbrain"
  - "thin harness fat skills"
  - "all gbrain skills"
  - "garry tan 25 skills"
  - "gbrain philosophy"
  - "which gbrain skill"
  - "gbrain getting started"
  - "production brain system"

---

## Contract

**Input:** Any question about GBrain, its philosophy, the 25 skills, or how to use them  
**Output:** Clear explanation of GBrain concepts, skill descriptions, usage guidance, and recommendations for which skill to use when  
**Platform:** Universal (works on any interface)  
**Tone:** Direct, practical, enthusiastic about the system's potential

---

## What is GBrain?

**GBrain** is Garry Tan's "production brain system" — a set of 25 specialized AI skills designed to augment human cognition across every major domain of knowledge work.

Think of it as a cognitive exoskeleton. Instead of one general-purpose AI trying to do everything, GBrain provides **specialized brains for specialized jobs** — each skill is an expert in its domain, with deep context, specific workflows, and optimized outputs.

### The Core Philosophy: "Thin Harness, Fat Skills"

GBrain follows a simple but powerful design principle:

> **Thin Harness, Fat Skills**

- **Thin Harness:** The system that routes requests and manages context is lightweight and minimal. It doesn't try to be smart — it just connects you to the right skill.
- **Fat Skills:** Each individual skill is loaded with expertise, context, workflows, and domain knowledge. They're "fat" with capability.

This is the opposite of the "one big model" approach. Instead of a generalist that knows a little about everything, you get **25 specialists that know a lot about their domains**.

**Why this works:**
- **Quality:** Domain-specific skills produce better outputs than general prompts
- **Consistency:** Same inputs produce same-quality outputs every time
- **Composability:** Skills can chain together for complex workflows
- **Extensibility:** New skills plug in without changing the harness

---

## The 25 GBrain Skills

### 🧠 **META & SYSTEM SKILLS**

| Skill | Purpose | Use When |
|-------|---------|----------|
| **meta-brain** (this skill) | Overview and navigation of entire GBrain system | You're new to GBrain, need to find the right skill, or want to understand the philosophy |
| **router** | Intelligent request routing to appropriate skill | Unclear which skill to use, or request spans multiple domains |
| **memory** | Long-term memory management and retrieval | Need to recall past conversations, projects, or decisions |
| **context** | Context window management and optimization | Working on large projects that exceed context limits |

---

### 💼 **BUSINESS & STRATEGY**

| Skill | Purpose | Use When |
|-------|---------|----------|
| **strategy** | Business strategy, competitive analysis, market positioning | Planning company direction, analyzing markets, developing moats |
| **vc** | Venture capital, fundraising, investor relations | Raising money, term sheets, pitch decks, investor comms |
| **product** | Product management, roadmaps, user research | Building products, prioritizing features, understanding users |
| **ops** | Operations, processes, systems | Scaling operations, improving efficiency, building playbooks |
| **sales** | Sales strategy, prospecting, closing | Building sales motion, improving conversion, deal strategy |
| **marketing** | Growth, positioning, messaging | Launching products, building brand, acquiring customers |
| **finance** | Financial modeling, unit economics, forecasting | Building models, analyzing metrics, planning budgets |

---

### 💻 **TECHNOLOGY & BUILDING**

| Skill | Purpose | Use When |
|-------|---------|----------|
| **engineering** | Software engineering, architecture, technical decisions | Designing systems, code review, technical strategy |
| **code** | Writing, editing, and reviewing code | Generating code, refactoring, debugging, learning new patterns |
| **data** | Data analysis, SQL, visualization, analytics | Querying data, building dashboards, finding insights |
| **ai** | AI/ML strategy, implementation, models | Building AI features, choosing models, prompting strategies |
| **security** | Security, privacy, compliance | Threat modeling, security reviews, compliance requirements |
| **infra** | Infrastructure, DevOps, cloud | Architecture decisions, deployment, scaling, cost optimization |

---

### ✍️ **COMMUNICATION & CONTENT**

| Skill | Purpose | Use When |
|-------|---------|----------|
| **writing** | Writing, editing, clarity, style | Any written communication — emails, docs, posts, essays |
| **comms** | Communication strategy, presentations, narratives | High-stakes communication, storytelling, presentations |
| **social** | Social media, community, public presence | Twitter/X strategy, building audience, online presence |
| **research** | Deep research, information synthesis | Learning new topics, competitive research, due diligence |

---

### 🎯 **EXECUTION & PRODUCTIVITY**

| Skill | Purpose | Use When |
|-------|---------|----------|
| **productivity** | Personal productivity, systems, habits | Time management, focus, workflow optimization |
| **decision** | Decision-making frameworks, analysis | Hard choices, trade-off analysis, decision quality |
| **meeting** | Meeting prep, facilitation, follow-up | Important meetings, workshops, 1:1s, board meetings |
| **calendar** | Time management, scheduling, priorities | Calendar audit, time allocation, scheduling strategy |

---

### 🌐 **DOMAIN EXPERTISE**

| Skill | Purpose | Use When |
|-------|---------|----------|
| **crypto** | Cryptocurrency, web3, DeFi | Crypto investments, protocol analysis, web3 strategy |
| **bio** | Biotech, healthcare, life sciences | Bio investing, understanding science, health optimization |
| **policy** | Policy, regulation, government affairs | Regulatory analysis, policy strategy, government relations |

---

## How GBrain Works

### The Request Flow

```
User Request
    ↓
Router (thin harness)
    ↓
Appropriate Skill (fat skill)
    ↓
Structured Output
```

1. **User makes a request** — could be anything from "analyze this market" to "help me write this email"
2. **Router identifies the skill** — either explicitly (user names it) or implicitly (router detects domain)
3. **Skill activates with full context** — domain knowledge, workflows, best practices all load
4. **Skill produces output** — formatted according to its contract, optimized for the domain

### Skill Structure

Every GBrain skill follows the same structure:

```yaml
---
name: skill-name
version: 1.x.x
description: What this skill does
triggers: [keywords that activate this skill]
---

## Contract
Input: What the skill expects
Output: What the skill produces
Platform: Where it works best
Tone: How it communicates

## Phases
1. First: Initial understanding
2. Second: Deep work
3. Third: Delivery

## Output Format
Structured template for responses

## Anti-Patterns
What NOT to do with this skill
```

This consistency means once you learn one skill, you know how all of them work.

---

## Getting Started with GBrain

### Phase 1: Discovery (5 minutes)

**Goal:** Understand what's available

1. Read this meta-brain overview
2. Scan the 25 skills table above
3. Identify 3-5 skills relevant to your current work
4. Read those specific skill files

**Quick-start prompts:**
- "What skill should I use for [your current task]?"
- "Explain the [skill-name] skill"
- "How do GBrain skills work?"

---

### Phase 2: First Use (15 minutes)

**Goal:** Actually use a skill on real work

1. Pick one skill relevant to something you're doing today
2. Read its SKILL.md file
3. Follow its phases with your actual task
4. Notice the difference from generic AI

**Example first uses:**
- Use **writing** to edit an important email
- Use **strategy** to analyze a competitive threat
- Use **product** to prioritize your roadmap
- Use **decision** to work through a hard choice

---

### Phase 3: Integration (Ongoing)

**Goal:** Make GBrain your default

1. Start every significant task by asking which skill to use
2. Build muscle memory with your most-used skills
3. Learn to chain skills (e.g., research → strategy → writing)
4. Customize skills for your specific context

---

## Skill Chaining: Advanced Patterns

The real power of GBrain comes from **chaining skills** — using multiple skills in sequence for complex workflows.

### Common Chains

**The Strategic Decision:**
```
research → decision → writing → comms
```
Research the topic → Make the decision → Write the rationale → Communicate it

**The Product Launch:**
```
product → strategy → marketing → writing → social
```
Define the product → Position strategically → Plan marketing → Write copy → Execute socially

**The Investment Analysis:**
```
research → finance → decision → writing
```
Research the company → Model the economics → Make go/no-go → Write the memo

**The Technical Build:**
```
engineering → code → security → infra
```
Design the architecture → Write the code → Security review → Deploy infrastructure

---

## Output Format Expectations

### Standard Response Structure

All GBrain skills follow this structure:

```
# [Skill Icon] [Skill Name]: [Task Summary]

## TL;DR
One-line summary of the answer/action

## Detailed Response
[The actual work product — analysis, writing, code, etc.]

## Key Insights
- Point 1
- Point 2
- Point 3

## Next Steps / Actions
1. [Actionable item]
2. [Actionable item]
3. [Actionable item]

## Related Skills
- [skill-name] — for [use case]
- [skill-name] — for [use case]
```

### Platform Adaptations

**Discord/Slack:**
- No markdown tables
- Use bullet lists instead
- Wrap multiple links in `<>` to suppress embeds

**Telegram/WhatsApp:**
- No headers (use **bold** or CAPS)
- Shorter paragraphs
- More line breaks

**Email:**
- Full formatting
- Professional greeting/sign-off
- Signature block

---

## Anti-Patterns

### ❌ Don't: Use the Wrong Skill

**Wrong:** Asking the engineering skill for marketing copy  
**Right:** Use the marketing skill for marketing, engineering for engineering

Skills are specialized for a reason. Using the wrong one produces worse results than generic AI.

---

### ❌ Don't: Skip the Contract

**Wrong:** "Help me with strategy" (vague, no context)  
**Right:** "Use the strategy skill to analyze [company]'s competitive position in [market]"

The contract section tells you what inputs produce the best outputs. Follow it.

---

### ❌ Don't: Ignore the Phases

**Wrong:** Jumping straight to "write me the thing"  
**Right:** Following the skill's phases — understand first, then work, then deliver

Phases exist because they produce better results. Trust the process.

---

### ❌ Don't: Treat Skills as Chatbots

**Wrong:** Extended back-and-forth conversation  
**Right:** Clear request → structured output → done

GBrain is for **work products**, not conversation. Make your request, get your output, move on.

---

### ❌ Don't: Forget to Chain

**Wrong:** Trying to do everything in one skill request  
**Right:** Breaking complex tasks into skill chains

One skill = one domain. Complex work spans domains, so use multiple skills.

---

### ❌ Don't: Modify the Harness

**Wrong:** Changing how skills are routed or loaded  
**Right:** Keeping the harness thin, making skills fatter

The "thin harness, fat skills" principle keeps the system maintainable. Don't bloat the router.

---

## Skill Reference Quick-Select

### "I need to..." → Use this skill

| I need to... | Skill |
|--------------|-------|
| Understand GBrain | **meta-brain** (this skill) |
| Not sure which skill | **router** |
| Recall something from before | **memory** |
| Work with lots of info | **context** |
| Plan company direction | **strategy** |
| Raise money | **vc** |
| Build a product | **product** |
| Scale operations | **ops** |
| Sell something | **sales** |
| Launch/grow something | **marketing** |
| Model finances | **finance** |
| Design systems | **engineering** |
| Write code | **code** |
| Analyze data | **data** |
| Build AI features | **ai** |
| Secure something | **security** |
| Deploy infrastructure | **infra** |
| Write anything | **writing** |
| Present to important people | **comms** |
| Post on social | **social** |
| Learn something deeply | **research** |
| Get more done | **productivity** |
| Make a hard choice | **decision** |
| Run a great meeting | **meeting** |
| Manage my time | **calendar** |
| Understand crypto | **crypto** |
| Understand biotech | **bio** |
| Navigate regulation | **policy** |

---

## Philosophy in Practice

### Why "Fat Skills" Beat "System Prompts"

Most AI approaches use a system prompt like "You are a helpful assistant who knows about X." This is **thin** — it's just a sentence describing expertise.

GBrain skills are **fat** — they include:
- Thousands of words of domain context
- Specific workflows and phases
- Output templates and formatting rules
- Anti-patterns and failure modes
- Platform-specific adaptations
- Chaining guidance

**Analogy:**
- System prompt = "You are a doctor"
- GBrain skill = Medical school + residency + specialty training + 10 years of practice

---

### The Power of Specialization

General AI is like a general practitioner — fine for common issues, but you want a specialist for serious work.

GBrain is like having **25 specialists on speed dial**:
- Cardiologist (strategy)
- Surgeon (code)
- Psychiatrist (comms)
- Research scientist (research)
- Financial advisor (finance)
- etc.

Each specialist brings deep expertise to their domain. Chain them together for complex cases.

---

## Implementation Notes

### File Structure

```
gbrain/
├── meta-brain/
│   └── SKILL.md          # This file — the overview
├── router/
│   └── SKILL.md          # Request routing logic
├── memory/
│   └── SKILL.md          # Memory management
├── context/
│   └── SKILL.md          # Context optimization
├── strategy/
│   └── SKILL.md          # Business strategy
├── vc/
│   └── SKILL.md          # Venture capital
├── product/
│   └── SKILL.md          # Product management
├── ops/
│   └── SKILL.md          # Operations
├── sales/
│   └── SKILL.md          # Sales
├── marketing/
│   └── SKILL.md          # Marketing
├── finance/
│   └── SKILL.md          # Financial modeling
├── engineering/
│   └── SKILL.md          # Software engineering
├── code/
│   └── SKILL.md          # Code writing
├── data/
│   └── SKILL.md          # Data analysis
├── ai/
│   └── SKILL.md          # AI/ML
├── security/
│   └── SKILL.md          # Security
├── infra/
│   └── SKILL.md          # Infrastructure
├── writing/
│   └── SKILL.md          # Writing
├── comms/
│   └── SKILL.md          # Communication
├── social/
│   └── SKILL.md          # Social media
├── research/
│   └── SKILL.md          # Research
├── productivity/
│   └── SKILL.md          # Productivity
├── decision/
│   └── SKILL.md          # Decision-making
├── meeting/
│   └── SKILL.md          # Meetings
├── calendar/
│   └── SKILL.md          # Calendar management
├── crypto/
│   └── SKILL.md          # Cryptocurrency
├── bio/
│   └── SKILL.md          # Biotech
└── policy/
    └── SKILL.md          # Policy/regulation
```

### Skill Format Standard

Every skill file follows this exact template:

```markdown
# [Skill Name]

---
name: [kebab-case-name]
version: [semver]
description: [one-line description]
triggers: [list of activation keywords]
---

## Contract
[Input/Output/Platform/Tone]

## Phases
[Numbered phases with descriptions]

## [Skill-Specific Sections]
[Domain knowledge, workflows, etc.]

## Output Format
[Template]

## Anti-Patterns
[What not to do]
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01 | Initial release with 25 skills |

---

## Credits

GBrain is based on Garry Tan's production brain system, refined through years of building companies (Posterous, PostHog), investing (Y Combinator), and operating at scale.

The "thin harness, fat skills" philosophy represents a fundamental shift in how we think about AI augmentation — from general-purpose chatbots to specialized cognitive tools.

---

## Getting Help

**"Which skill should I use?"** → Read this file or ask the router  
**"How do I use [skill]?"** → Read that skill's SKILL.md file  
**"Can I customize skills?"** → Yes — copy a skill and modify it for your context  
**"Something's not working"** → Check the anti-patterns section first

---

*GBrain: Specialized cognition for specialized work.*
