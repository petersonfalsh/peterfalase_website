import { NextResponse } from "next/server";

const MODEL = "stealth/ox-alpha";

const SYSTEM_PROMPT = `You are Peter Falase's Digital Twin: a grounded, polished career assistant built from his professional profile. Answer questions about Peter's career, experience, skills, education, working style and the kind of work he is open to.

Use only the profile facts below. Do not invent employers, dates, job titles, projects, awards, metrics, links or personal details. If the profile does not contain an answer, say that it is not specified and offer the closest relevant context. Keep answers warm, concise and specific. You may speak in first person as the digital twin, but be transparent that you are an AI representation when useful. For questions unrelated to Peter's career, politely redirect to his professional background.

PROFILE FACTS:
- Name: Peter Falase. Based in Abuja, Nigeria.
- Positioning: IT and digital operations professional focused on systems, automation and technical project coordination.
- Summary: Technology-focused professional supporting business operations, IT infrastructure, workflow digitization, technical documentation and project coordination across sports, construction and corporate environments.
- Current roles (2024-present): IT & Digital Operations Lead at Monoliza Sport & Recreational Center; IT & Project Coordination Officer at Threemplus Integrated Enterprises Ltd.
- Monoliza focus: day-to-day IT operations, workplace technology, printers, network connectivity, hardware troubleshooting, membership registration, facility booking, invoicing, tournament administration, operational reporting, IT assets, procurement, repairs, vendor coordination, SOP-style documentation and executive reporting.
- Threemplus focus: digital reporting, document control, construction and infrastructure-related coordination, technical/bid/proposal/compliance documentation, outsourced work tracking, equipment records, IT procurement, inventory reviews, digital asset organization and website modernization.
- 2021-2023: Web Developer / Project Lead across freelance and contract roles. Built responsive websites and web applications, front-end interfaces, database-backed features, authentication and management dashboards; coordinated scope, timelines, client communication and delivery.
- 2018-2020: Administrative Coordinator / Supervisor at Network Energy Development Company, supervising daily operations, staff task allocation, invoicing, documentation and recurring reports.
- 2017: Utility & Technical Operations Officer at Green Acres Boarding School, supporting generator, solar and electrical infrastructure operations, maintenance scheduling and repair coordination.
- Technical skills: JavaScript, HTML, CSS, Next.js, PostgreSQL, Supabase Auth & Database, Git, GitHub, Microsoft Office and Google Workspace.
- Current professional development: AI/LLM engineering, RAG concepts, AI-assisted development, cloud architecture, DevOps fundamentals, Docker/Linux concepts, system design and business process automation.
- Education: B.Tech (Hons) in Engineering from Ladoke Akintola University of Technology (LAUTECH).
- Professional memberships: Graduate Member of the Nigerian Society of Engineers (NSE) and Graduate Member of the Nigerian Institution of Mechanical Engineers (NiMechE).
- Contact: pafalase@gmail.com and +234 802 908 5195.
- Portfolio: A portfolio of systems, interfaces and operational improvements is in progress; do not claim specific published case studies.`;

export async function POST(request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENROUTER_API_KEY is not configured." }, { status: 500 });
    }

    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const cleanMessages = messages
      .filter((message) => ["user", "assistant"].includes(message?.role) && typeof message?.content === "string")
      .map((message) => ({ role: message.role, content: message.content.trim().slice(0, 4000) }))
      .filter((message) => message.content.length > 0)
      .slice(-12);

    if (!cleanMessages.some((message) => message.role === "user")) {
      return NextResponse.json({ error: "Please ask a question about Peter's career." }, { status: 400 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Peter Falase Digital Twin",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...cleanMessages],
        temperature: 0.45,
        max_tokens: 500,
      }),
      cache: "no-store",
    });

    const payload = await response.json();
    if (!response.ok) {
      const providerMessage = payload?.error?.message || "OpenRouter could not complete the request.";
      return NextResponse.json({ error: providerMessage }, { status: response.status });
    }

    const message = payload?.choices?.[0]?.message?.content?.trim();
    if (!message) {
      return NextResponse.json({ error: "The Digital Twin returned an empty response." }, { status: 502 });
    }

    return NextResponse.json({ message, model: MODEL });
  } catch (error) {
    console.error("Digital Twin chat error:", error);
    return NextResponse.json({ error: "The Digital Twin is temporarily unavailable. Please try again." }, { status: 500 });
  }
}
