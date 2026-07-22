# InterioArty: Redesign + AI Chatbot Demo

Pitch demo built for InterioArty (interioarty.com), a Pune interior design studio. Redesigned marketing site + an AI chatbot ("Arty") that qualifies leads and streams them into a live mini CRM.

## What's in here

- `index.html` / `css/style.css` / `js/main.js` / `js/interactive.js`: redesigned homepage. One flat color throughout (white, near-black, greys only), Public Sans, weight-based hierarchy inspired by rolex.com. Real interactions instead of static content: a drag-to-compare slider (`js/interactive.js`) and a testimonial carousel, plus Lenis + GSAP ScrollTrigger smooth scroll on the hero.
- `js/chatbot.js`: floating chat widget ("Arty"). Calls `/api/chat`, extracts phone/email/name from the conversation, and broadcasts captured leads.
- `api/chat.js`: Vercel serverless function. Proxies to Groq (`llama-3.3-70b-versatile`) for low-latency answers, grounded in InterioArty's real services/pricing/process via a system prompt. Falls back to a scripted response if `GROQ_API_KEY` isn't set, so the site never breaks without a key.
- `api/summarize-lead.js`: a second Groq call (JSON mode) that reads the full transcript and extracts structured fields (project type, BHK, budget, timeline, plain-English summary) once a lead is captured.
- `crm.html` / `js/crm.js`: live "Lead Inbox" dashboard. Listens for leads via `BroadcastChannel` + `localStorage`, renders them instantly, then patches in the AI summary once it resolves. Click a row to expand the full detail and transcript.

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

1. Open the homepage: let the hero + scroll motion breathe for a few seconds before talking.
2. Scroll through Collections (four service modules), then let the VR section's drag-to-compare slider speak for itself: it's the single most tangible proof of the VR pitch.
3. Scroll the Featured Project narrative and the Client Voices carousel.
4. Click the chat launcher, ask "How much does interior design cost?" and "Tell me about the VR walkthrough": show instant, accurate answers.
5. Give the bot a name and phone number in the conversation.
6. Open `/crm.html` in a second tab: show the lead land live with the toast notification, then click the row to reveal the AI-written summary and full transcript. This is the "reply speed" fix, made visible.
7. Close with the roadmap: same AI receptionist wired into WhatsApp + Instagram DMs, plus real CRM integration. This demo proves the concept works before we build the full integration.

## Known scope boundaries (be upfront about these if asked)

- WhatsApp/Instagram automation is **not** live-wired in this demo (needs WhatsApp Business API approval + compliance review): positioned as Phase 2.
- The "CRM" here is a same-browser live demo (BroadcastChannel + localStorage), not a persisted database: real version would sync to their actual CRM.
- Gallery/hero images are curated stock photography standing in for their real project photography.
