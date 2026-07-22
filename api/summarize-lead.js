const SUMMARY_PROMPT = `You are a CRM assistant reading a transcript between a website visitor and Arty, InterioArty's AI design consultant. Extract what the visitor actually said into structured fields. Never invent details that weren't mentioned — use null for anything not discussed.

Respond with ONLY a JSON object in this exact shape:
{
  "name": string or null,
  "phone": string or null,
  "email": string or null,
  "projectType": one of "Full Home", "Modular Interior", "Office", "Renovation", or null,
  "bhk": string or null (e.g. "2BHK", "3BHK"),
  "budget": string or null (whatever the visitor implied or stated, e.g. "Above 10L", "12-15L"),
  "timeline": string or null (urgency or move-in timeline if mentioned),
  "summary": a 1-2 sentence plain-English summary of what this visitor wants, written for a busy salesperson to skim
}`;

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

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'messages array required' });
      return;
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      res.status(200).json({
        name: null,
        phone: null,
        email: null,
        projectType: null,
        bhk: null,
        budget: null,
        timeline: null,
        summary: 'AI summary unavailable in demo mode — see the raw transcript below.',
      });
      return;
    }

    const transcript = messages.map((m) => `${m.role === 'user' ? 'Visitor' : 'Arty'}: ${m.content}`).join('\n');

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SUMMARY_PROMPT },
          { role: 'user', content: transcript },
        ],
        temperature: 0.2,
        max_tokens: 350,
        response_format: { type: 'json_object' },
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      res.status(502).json({ error: 'LLM upstream error', detail: errText });
      return;
    }

    const data = await groqRes.json();
    const raw = data.choices?.[0]?.message?.content || '{}';

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { summary: raw.slice(0, 200) };
    }

    res.status(200).json({
      name: parsed.name ?? null,
      phone: parsed.phone ?? null,
      email: parsed.email ?? null,
      projectType: parsed.projectType ?? null,
      bhk: parsed.bhk ?? null,
      budget: parsed.budget ?? null,
      timeline: parsed.timeline ?? null,
      summary: parsed.summary ?? null,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', detail: String(err) });
  }
};
