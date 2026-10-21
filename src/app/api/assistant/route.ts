import { NextRequest, NextResponse } from "next/server";
import { callGeminiGenerate } from "@/lib/gemini";
import { BrandingProject, ChatMessage } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { messages, projectContext } = (await req.json()) as {
      messages: ChatMessage[];
      projectContext?: Partial<BrandingProject>;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required." }, { status: 400 });
    }

    const customApiKey = req.headers.get("x-gemini-key") || undefined;
    const latestUserMessage = messages[messages.length - 1].content;

    const brandName = projectContext?.selectedWinnerName || projectContext?.name || "the brand";
    const industry = projectContext?.industry || "Modern Business";
    const idea = projectContext?.businessIdea || "an innovative product or service";
    const audience = projectContext?.targetAudience || "forward-thinking consumers";

    const systemPrompt = `You are Spark, the brilliant AI Brand Strategist and Creative Director for BrandSpark.
You are actively consulting on a branding project with the following live context:
- Project Name / Chosen Brand: "${brandName}"
- Industry: "${industry}"
- Core Business Idea: "${idea}"
- Target Audience: "${audience}"
- Personality: "${projectContext?.personality || "Innovative & Trustworthy"}"

Provide sharp, practical, insightful branding advice. If the user asks for names, slogans, identity adjustments, or comparison insights, give punchy, actionable recommendations formatted with markdown bullets, bold highlights, and clear rationales. Keep your tone encouraging, sophisticated, and concise.`;

    // Try Gemini API
    const geminiReply = await callGeminiGenerate(
      `User request: "${latestUserMessage}"\n\nRecent context: ${JSON.stringify(
        messages.slice(-4).map((m) => `${m.role}: ${m.content}`)
      )}`,
      {
        customApiKey,
        systemInstruction: systemPrompt,
        temperature: 0.75,
      }
    );

    if (geminiReply && geminiReply.trim().length > 0) {
      const suggestions = getActionSuggestions(latestUserMessage);
      return NextResponse.json({
        success: true,
        reply: geminiReply,
        actionSuggestions: suggestions,
      });
    }

    // Algorithmic intelligent branding consultant fallback
    const fallbackReply = generateFallbackAssistantResponse(latestUserMessage, {
      brandName,
      industry,
      idea,
      audience,
    });

    return NextResponse.json({
      success: true,
      reply: fallbackReply.text,
      actionSuggestions: fallbackReply.suggestions,
    });
  } catch (err) {
    console.error("Spark Assistant error:", err);
    return NextResponse.json({ error: "Failed to generate assistant response." }, { status: 500 });
  }
}

function getActionSuggestions(userMsg: string): string[] {
  const lower = userMsg.toLowerCase();
  if (lower.includes("name") || lower.includes("shorter")) {
    return ["Generate 5 premium names", "Check .com domain availability", "Compare top 3 names"];
  }
  if (lower.includes("slogan") || lower.includes("tagline")) {
    return ["Make it more humorous", "Give me an ultra-minimalist slogan", "Create emotional tagline"];
  }
  if (lower.includes("color") || lower.includes("palette")) {
    return ["Generate luxury obsidian palette", "Show high-contrast accessible colors", "Apply to live mockup"];
  }
  return ["Generate more premium names", "Suggest a punchy slogan", "Create luxury brand identity", "Compare shortlisted names"];
}

function generateFallbackAssistantResponse(
  userMsg: string,
  ctx: { brandName: string; industry: string; idea: string; audience: string }
): { text: string; suggestions: string[] } {
  const query = userMsg.toLowerCase();

  if (query.includes("shorter") || query.includes("short")) {
    return {
      text: `To make **${ctx.brandName}** more concise, we should aim for 4–6 characters and 1–2 syllables. This dramatically minimizes phonotactic friction.\n\nHere are 3 refined, ultra-punchy variations for **${ctx.industry}**:\n\n1. **${ctx.brandName.slice(0, 4)}o** — Crisp, vowel-ending neologism with instant mobile recall.\n2. **Velo${ctx.brandName.slice(0, 3)}** — Rooted in velocity, ideal for fast-moving ${ctx.audience}.\n3. **${ctx.brandName.slice(0, 3)}ix** — Sharp tech suffix that sounds decisive and modern.\n\nWould you like me to verify domain availability for one of these?`,
      suggestions: ["Check .com availability", "Add to comparison list", "Generate matching slogans"],
    };
  }

  if (query.includes("slogan") || query.includes("tagline")) {
    return {
      text: `For **${ctx.brandName}** in the **${ctx.industry}** space, here are three high-impact directions:\n\n- **Authority / B2B:** *"The Smarter Standard for Modern ${ctx.industry}."*\n- **Emotional:** *"Engineered for what matters most."*\n- **Minimalist:** *"Simply Better."*\n\nWhich emotional chord do you want your audience to feel when they first hear it?`,
      suggestions: ["Use 'The Smarter Standard'", "Make it funnier", "Generate luxury slogan"],
    };
  }

  if (query.includes("luxury") || query.includes("premium")) {
    return {
      text: `A true luxury brand identity for **${ctx.brandName}** requires restraint, deliberate negative space, and understated typography.\n\n**Strategic Blueprint:**\n- **Color Palette:** Midnight Onyx (#09090B), Champagne Warm Cream (#F5F0E6), and Burnished Gold (#C5A059).\n- **Typography:** Refined High-Contrast Serif for headlines paired with clean geometric grotesque for body copy.\n- **Tone of Voice:** Quiet confidence, avoidance of exclamation marks, and focus on provenance and craft.`,
      suggestions: ["Apply luxury color palette", "Generate luxury slogans", "Open Brand Identity Studio"],
    };
  }

  if (query.includes("compare")) {
    return {
      text: `When comparing your shortlisted brand names, evaluate them across these four pillars:\n\n1. **Phonetic Friction:** Can someone spell it correctly after hearing it once in a noisy room?\n2. **Linguistic Elasticity:** Does the name allow you to expand beyond your initial product offering?\n3. **Domain & Trademark Cleanliness:** Is the .com, .io, or .ai clear of high-litigation trademarks?\n4. **Emotional Valence:** Does it evoke prestige, trust, or excitement for ${ctx.audience}?\n\nJump into the **Brand Comparison** tab to review your matrix side-by-side!`,
      suggestions: ["Open Comparison Table", "Check .com domains", "Select final winner"],
    };
  }

  return {
    text: `I'm analyzing **${ctx.brandName}** for the **${ctx.industry}** market.\n\nYour focus on "${ctx.idea}" targets **${ctx.audience}**. To build a category-defining brand, every touchpoint from your phonetic rhythm to your color harmony should tell a unified story.\n\nHow can I help elevate your project right now?`,
    suggestions: ["Generate more premium names", "Suggest a better slogan", "Create a luxury brand identity", "Compare shortlisted names"],
  };
}
