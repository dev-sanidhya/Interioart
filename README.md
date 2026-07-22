# InterioArty — Redesign + AI Chatbot Demo

Pitch demo built for InterioArty (interioarty.com), a Pune interior design studio. Redesigned marketing site + an AI chatbot ("Arty") that qualifies leads and streams them into a live mini CRM.

## What's in here

- `index.html` / `css/style.css` / `js/main.js` — redesigned homepage. Moody editorial visual style (Roman & Williams Guild) + smooth-scroll/motion feel (Framer, Linear) via Lenis + GSAP ScrollTrigger.
- `js/chatbot.js` — floating chat widget ("Arty"). Calls `/api/chat`, extracts phone/email from the conversation, and broadcasts captured leads.
- `api/chat.js` — Vercel serverless function. Proxies to Groq (`llama-3.3-70b-versatile`) for low-latency answers, grounded in InterioArty's real services/pricing/process via a system prompt. Falls back to a scripted response if `GROQ_API_KEY` isn't set, so the site never breaks without a key.
- `crm.html` / `js/crm.js` — live "Lead Inbox" dashboard. Listens for leads via `BroadcastChannel` + `localStorage` and renders them instantly with a toast notification — demonstrates the "no more manual reply delay" pitch without needing a real CRM/WhatsApp integration wired up yet.

## Local preview

Static preview (no live chatbot answers, widget still fully interactive with a graceful fallback message):

```bash
npx serve . -l 3009
```

Full preview with a working chatbot (needs Vercel CLI + a Groq key):

```bash
npm i -g vercel
vercel dev
```

## Deploying for the demo

1. Push this folder to `github.com/dev-sanidhya/Interioart` (already wired as `origin`).
2. Import the repo in Vercel → New Project.
3. Add environment variable `GROQ_API_KEY` (get a free key at console.groq.com).
4. Deploy. Share the resulting `*.vercel.app` link.

## Demo script (suggested flow for the pitch)

1. Open the homepage — let the hero + scroll motion breathe for a few seconds before talking.
2. Scroll through Services → VR section (their existing differentiator, now framed better) → Gallery → Testimonials.
3. Click the chat launcher, ask "How much does interior design cost?" and "Tell me about the VR walkthrough" — show instant, accurate answers.
4. Give the bot a name + phone number in the conversation.
5. Open `/crm.html` in a second tab — show the lead land live with the toast notification. This is the "reply speed" fix, made visible.
6. Close with the roadmap: same AI receptionist wired into WhatsApp + Instagram DMs, plus real CRM integration — this demo proves the concept works before we build the full integration.

## Known scope boundaries (be upfront about these if asked)

- WhatsApp/Instagram automation is **not** live-wired in this demo (needs WhatsApp Business API approval + compliance review) — positioned as Phase 2.
- The "CRM" here is a same-browser live demo (BroadcastChannel + localStorage), not a persisted database — real version would sync to their actual CRM.
- Gallery/hero images are curated stock photography standing in for their real project photography.
