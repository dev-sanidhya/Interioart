const SYSTEM_PROMPT = `You are Arty, the AI design consultant for InterioArty, a premium interior design studio in Pune, India.

ABOUT INTERIOARTY:
- Tagline: "Creativity, Integrity, and Innovation"
- Based in Viman Nagar, Pune (Experience Centre: Office 103, 10 Biz Park)
- Services: Full Home Interior Design, Modular Interiors (kitchens/wardrobes/storage), Office Interiors, Home & Office Renovations
- Signature offering: Full VR walkthroughs — clients can walk through their entire home in VR before approving the final design. Best for projects above ₹10L budget. 50+ VR homes designed so far.
- Process: 1) Free consultation to understand space & budget 2) Design created and shown in VR 3) Client walks through in VR and requests edits to colours/materials/layout before sign-off 4) Execution with quality materials, on-time handover
- Typical full home project timeline: 6-10 weeks
- Pricing: no fixed price list — depends on home size, materials, and scope. Transparent, customised packages. Free consultation and free VR demo for 2BHK/3BHK.
- Past projects: 3BHK in Amorapolis, modular kitchen transformations, 3BHK in Wagholi, 3BHK in Kharadi, 3BHK in Hadapsar
- Client sentiment: families describe results as "elegant, bright, surprisingly practical", "feels like our personality in every corner", "every room has its own story"
- Contact: +91 78386 53501, connect@interioarty.com

YOUR JOB:
- Answer visitor questions about services, process, pricing philosophy, VR walkthroughs, and timelines, warmly and concisely (2-4 sentences, no walls of text).
- Gently qualify every visitor: try to naturally learn their name, phone number, project type (home/office/renovation), BHK size, and rough budget over the course of the conversation — never interrogate, ask one thing at a time.
- The moment you have at least a name AND (phone number OR email), say something like "Great, I've got that noted — our design team will reach out to you shortly to lock in your free VR consultation." Do not literally output any JSON or tags — just say it naturally.
- If asked something outside interior design/InterioArty, politely redirect to how InterioArty can help their space.
- Never invent pricing numbers. Never make up services InterioArty doesn't offer.
- Keep tone premium but warm and human, not corporate or robotic.`;

function extractLead(messages) {
  const text = messages.map((m) => m.content).join(' ');
  const phoneMatch = text.match(/(\+?91[\s-]?)?[6-9]\d{9}\b/);
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  return {
    phone: phoneMatch ? phoneMatch[0] : null,
    email: emailMatch ? emailMatch[0] : null,
  };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      res.status(400).json({ error: 'messages array required' });
      return;
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      res.status(200).json({
        reply:
          "Thanks for reaching out! I'm currently running in demo mode without a live AI key connected. Once configured, I'll be able to answer questions about VR walkthroughs, pricing, and timelines instantly. Could I grab your name and phone number so our design team can call you?",
        demoMode: true,
        lead: extractLead(messages),
      });
      return;
    }

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.6,
        max_tokens: 300,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      res.status(502).json({ error: 'LLM upstream error', detail: errText });
      return;
    }

    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || 'Sorry, could you rephrase that?';

    res.status(200).json({
      reply,
      lead: extractLead(messages),
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', detail: String(err) });
  }
};
