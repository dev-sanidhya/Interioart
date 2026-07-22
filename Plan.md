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

## Color fix (2026-07-23, later same day)
User flagged the terracotta accent as "off" and told me to actually think about it rather than guess again. Root cause: I'd invented an unrelated terracotta/rust accent instead of grounding the palette in anything real. Fixed by inspecting InterioArty's *actual live site* computed styles — their real brand CTA color is a deep maroon/wine (`rgb(140,10,36)`, used 20+ times) on warm cream (`rgb(251,246,239)`), with navy as a secondary. Swapped `--accent` to a refined `#7a1530` (their maroon, slightly desaturated for an editorial feel) and warmed `--stone`/`--ink` slightly to sit closer to their actual cream/charcoal. This keeps brand continuity with their existing site while still being a clear step up in execution — lesson: check the client's real brand colors before inventing a palette, don't just chase "premium-looking" hexes in isolation.

## First-principles redesign (2026-07-23, later still — same day)
User rejected the incremental-patching approach entirely: still felt like an AI-generated template, too many generic/equal-weight sections, still reminiscent of Aperture, typography lacking personality. Explicit instruction: redesign from first principles, don't reskin. Full brief covered content strategy, type, color, layout, imagery, cards/shadows, animation pacing, and code quality — not just visuals.

Content decisions (question every section, per the brief):
- **Deleted**: the scrolling marquee ticker (pure SaaS-landing-page cliché).
- **Merged**: About + the old numbered 4-step process list into one "Statement" section — a single editorial line of copy, with the process folded into a quiet inline credits-style row instead of a bordered list.
- **Collapsed**: four repeated image+text service "spreads" (equal visual weight, felt templated) into one quiet typographic index (service names only, no photo per row) plus a single large signature photograph — creates actual hierarchy instead of four identical blocks.
- **Rebuilt**: VR section as full-bleed edge-to-edge photography with a plain caption block below (no card, no floating stat badge).
- **Rebuilt**: gallery from a uniform 6-image grid to two asymmetric plates (different aspect ratios, different sizes).
- **Rebuilt**: testimonials from a 3-column bordered card grid to one full-width pull-quote at a time, each with real vertical space around it.

System decisions:
- Typography: Bodoni Moda (didone display serif — genuinely different personality from every previous serif tried, real editorial/fashion pedigree, not a common "AI template" font) + Switzer via Fontshare (quiet neutral grotesque, higher-quality feel than Inter/Space Grotesk/Archivo, uncommon enough to not read as generic). Confirmed both @import URLs resolve (200) before committing.
- Color: kept the neutral bone/ink base and the brand-grounded maroon accent from the previous fix, but reduced the accent to near-invisible use (eyebrow labels, one italic word, thin underlines) rather than painting it across buttons/badges — "colors should disappear behind the content" per brief.
- Full CSS rewrite (not patched) — new spacing scale (`--sp-1` … `--sp-8`) and fluid type scale (`--t-*` via clamp) as actual design tokens, ~35% smaller stylesheet, verified zero orphaned classes after the rewrite (grepped class defs against HTML/JS usage, removed 3 that were genuinely unused).
- Reveal animation duration increased 1.1s → 1.8s, stagger removed — "slow, elegant, barely noticeable" per brief. Hero motion (Lenis smooth scroll, GSAP parallax) left untouched as explicitly instructed.
- Nav CTA and all buttons converted from filled/bordered pills to plain underlined text links — "understated buttons... no flashy hover effects."
- Chat launcher restyled from a circular icon-only SaaS bubble to a rectangular tab with a serif-italic "Ask Arty" label, matching the editorial system instead of looking like a bolted-on widget.

Also caught mid-fix: an earlier session's `package.json`/`vercel.json` bug fixes (removing `vercel dev` self-recursion, fixing an invalid `functions.runtime` value) had been made locally but never actually committed — folded into this push.

Verification note: the local screenshot/browser-pane tool has been non-functional for this entire session (times out with "pane not displayed"). All verification this round was done via computed-style checks, layout bounding-rect checks, console-error checks, and live DOM interaction tests (FAQ click, chat launcher click) — not visual screenshots. Flagged to user; recommend they eyeball it directly before the demo.

## Revert + lead-capture fix (2026-07-23, later still)
User rejected the first-principles rebuild and asked to revert two iterations back. Ambiguous by raw commit count (one intermediate commit was a pure color swap on identical structure), so asked user to pick explicitly between the two candidates — they chose the terracotta+Newsreader/Archivo editorial-spread version (commit `d78b19a`), not the maroon fix layered on top of it. Restored `css/style.css`, `index.html`, `js/main.js`, `crm.html`, `js/chatbot.js` to that commit's content via `git show d78b19a:<path>`.

Also fixed a real bug reported alongside the revert: a qualified-sounding chat conversation produced no CRM entry. Root cause in `api/chat.js`'s `extractLead` — it only matched a strict contiguous-digit phone regex and scanned *all* messages including the assistant's own, risking false positives on InterioArty's own listed number. Fixed by: scoping regex extraction to user-authored messages only, widening the phone regex to tolerate spaced/dashed formats, adding simple name extraction ("I'm X" / "my name is X"), and adding a `qualified` flag driven by whether the assistant's reply actually contains its own confirmation phrase. Frontend (`chatbot.js`) now fires a lead on phone OR email OR name OR qualified — deliberately over-captures rather than risk another silent miss during the live demo. This fix was kept on top of the reverted files (had to manually reapply since `chatbot.js`/`crm.js` were also part of the revert).

## Next steps
1. User to import repo into Vercel and set `GROQ_API_KEY` (same key already verified working locally) as an env var.
2. Deploy, grab the `*.vercel.app` link, send via WhatsApp ahead of the 11:30 AM demo (today).
3. Walk through demo script in README.md before the call.
4. After the call: capture what the client actually reacted to / objected to here for the next session.
