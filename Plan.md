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
- Palette/type swapped after feedback that dark+bronze+Fraunces read as a generic AI-template look: now a botanical deep-green (`#12201b`) + sage (`#e8ecde`) + muted forest accent (`#5c8770`) palette, with Instrument Serif (display) + Space Grotesk (body/UI) replacing Fraunces + Inter.
- Groq API key provided by user and dropped into local `.env` (gitignored, never committed). Verified directly against `api/chat.js` — real responses confirmed grounded in InterioArty's actual services/pricing/VR process, and lead extraction (name/phone/email regex) confirmed working mid-conversation.
- Caught and fixed a gap: `api/chat.js` had been written locally but never actually committed/pushed in an earlier session — now committed.
- All commits pushed to `origin main` on github.com/dev-sanidhya/Interioart.

## Design pivot (2026-07-23, demo day)
User flagged that the palette + Instrument Serif heading font looked too close to Aperture (this repo's sibling marketing site, which also uses Instrument Serif + dark/amber tones) — read as a generic AI-template look, not something distinct. Also called out the services/gallery/testimonials sections as "rubbish" (generic SaaS list-with-icon-circles pattern, star ratings). Hero + motion were kept as-is (explicitly approved).

Fix: pulled real computed styles from romanandwilliams.com (not rwguild.com subpage — actual R&W Guild homepage) via browser inspection rather than guessing. Found: warm stone/off-white backgrounds (~#f1efe7), near-black ink text, Lyon Display serif, minimal color, hairline dividers, no rounded-pill/card decoration.

Rebuilt with:
- Fonts: Newsreader (serif, has proper italic, distinct from Instrument Serif) + Archivo (sans) — replaces Fraunces/Instrument Serif + Inter/Space Grotesk entirely, confirmed zero overlap with Aperture's stack (Instrument Serif + Manrope + JetBrains Mono) via grep.
- Palette: warm stone (`#f1efe7`) / ink (`#17140f`) / muted terracotta accent (`#9c5330`) — editorial gallery tones, not SaaS dark+brand-color.
- Layout rhythm: alternating dark/light sections (dark hero → dark marquee → light about/services/vr/gallery → dark testimonials pull-quotes → light FAQ → dark CTA → light footer), matching print-editorial pacing instead of one flat tone.
- Services: rebuilt from icon-circle list into a magazine "spread" — alternating large image + text rows, each service now has real photography.
- Gallery: captions moved below image as catalog/museum-label style instead of hover-overlay.
- Testimonials: removed star ratings (too generic/salesy for this brand), now large italic pull-quotes on a dark section.
- Nav: switched from mix-blend-mode trick to a proper frosted stone bar that only appears once scrolled past the hero (threshold tied to viewport height in main.js), so it reads correctly against both the dark hero and light body sections.

## Next steps
1. User to import repo into Vercel and set `GROQ_API_KEY` (same key already verified working locally) as an env var.
2. Deploy, grab the `*.vercel.app` link, send via WhatsApp ahead of the 11:30 AM demo (today).
3. Walk through demo script in README.md before the call.
4. After the call: capture what the client actually reacted to / objected to here for the next session.
