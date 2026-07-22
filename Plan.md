# Plan.md — InterioArty Demo

## Context
Client: InterioArty (interioarty.com), Pune interior design studio. Sourced via Agency's outreach pipeline. Discovery call held 2026-07-22; demo scheduled 2026-07-23 11:30 AM, link to be sent via WhatsApp.

## Call findings (2026-07-22)
- No AI automation currently — leads from the WhatsApp icon go straight into their CRM, handled manually.
- Pain point: manual handling slows reply speed.
- Their stated interest areas: lead automation with reminders, CRM integration, website redesign.
- They also want a "3D design tool for quick client previews" — noted as a bigger ask, addressed via positioning (see below), not a live build.

## Strategy / scope decision
Full live WhatsApp + Instagram automation and real CRM integration were ruled out for the tomorrow demo — WhatsApp Business API approval and CRM wiring can't happen overnight, and CLAUDE.md blocks enabling Twilio WhatsApp without compliance checks anyway. Decided to anchor the demo on things that can be 100% working and reliable live:

1. Redesigned website (the link they're already expecting).
2. Embedded AI chatbot ("Arty") that answers real questions and qualifies leads.
3. A live mini "Lead Inbox" CRM view that visibly updates the instant the chatbot captures a lead — proves the "reply speed" fix without needing a real CRM/WhatsApp API.
4. WhatsApp/Instagram automation + real CRM + full 3D tool positioned as Phase 2 roadmap, described verbally, not faked live.

## Design direction
- Visual style inspiration: Roman & Williams Guild (rwguild.com) — moody, editorial, full-bleed imagery, dark ink background with warm paper/accent tones.
- Motion inspiration: Framer.com / Linear.app — smooth Lenis-powered scroll, GSAP ScrollTrigger reveals, restrained micro-interactions.
- Palette: near-black ink (#14120f), warm paper (#f4f0e9), bronze accent (#b98a4e). Fraunces serif for display type, Inter for body/UI.
- Images: curated Unsplash interior/architecture photography (verified live), grayscale/contrast-filtered for the abstract editorial feel requested.

## Technical decisions
- Standalone static project (not integrated into the Agency FastAPI backend) — separate repo: github.com/dev-sanidhya/Interioart.
- Chatbot LLM: Groq (`llama-3.3-70b-versatile`) for low latency, called from a Vercel serverless function (`api/chat.js`) so the API key stays server-side. Falls back to a scripted response if no key is set, so nothing breaks live.
- Lead capture: chatbot extracts phone/email via regex from the conversation, then broadcasts via `BroadcastChannel` + `localStorage` (same-browser demo mechanism — no backend DB needed for tomorrow).
- CRM dashboard (`crm.html`): listens on that channel, renders new leads instantly with a toast — this is the visual proof point for automation.
- Deployment target: Vercel (repo import → set `GROQ_API_KEY` env var → deploy).

## Current state
- Homepage, chatbot widget, serverless chat API, and CRM dashboard all built and visually verified locally (static server via `.claude/launch.json` entry `interioarty-demo`, port 3009).
- Lead-capture-to-CRM live-update flow tested and confirmed working (toast + stats + card render correctly).
- Not yet done: push to GitHub remote, deploy to Vercel, add real `GROQ_API_KEY`.

## Next steps
1. Push all commits to `origin main` on github.com/dev-sanidhya/Interioart.
2. User to import repo into Vercel and add `GROQ_API_KEY`.
3. Walk through demo script in README.md before the 11:30 AM call.
4. After the call: capture what the client actually reacted to / objected to here for the next session.
