import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  const { product, context, profile, mode, products } = await request.json();

  const profileText = profile
    ? `User taste profile:
- Preferred styles: ${profile.styles || "not specified"}
- Preferred brands: ${profile.brands || "not specified"}
- Cultural references: ${profile.references || "not specified"}
- Lifestyle: ${profile.lifestyle || "not specified"}`
    : "";

  let prompt;

  if (mode === "compare" && products) {
    prompt = `You are a neutral shopping advisor. Be concise and direct.

${profileText}

Compare these products:
${products.map((p, i) => `Product ${i + 1}: ${p}`).join("\n")}
${context ? `Context: ${context}` : ""}

Respond in exactly this format:

[VERDICT]
One sentence on which to pick and why.

[COMPARISON]
| Factor | ${products.map((_, i) => `Product ${i + 1}`).join(" | ")} |
|--------|${products.map(() => "------").join("|")}|
| Price | ... | ... |
| Quality | ... | ... |
| Style Fit | ... | ... |
| Best For | ... | ... |

[WINNER]
2-3 sentences. Clear recommendation. If taste profile provided, factor in style fit.

[WHERE_TO_BUY]
- Best platform: where to find these products at best price
- Better timing: when to buy for discounts
- Search tip: keywords to find dupes or similar quality at lower price`;

  } else {
    prompt = `You are a neutral shopping advisor. Be concise — max 2 sentences per section.

${profileText}

Analyze: ${product}
${context ? `Context: ${context}` : ""}

Respond in exactly this format:

[VALUE]
1-2 sentences on price vs quality.

[BEST_FOR]
1-2 sentences on who this suits best.

[RED_FLAGS]
- flag 1
- flag 2
- flag 3 (max 3 bullets)

[ALTERNATIVES]
- Alternative 1 ($price) - one reason
- Alternative 2 ($price) - one reason
- Alternative 3 ($price) - one reason

[STYLE_FIT]
${profileText ? "2-3 sentences on style fit based on taste profile, skin tone, body type. Then suggest: specific shoes, bag, and lip color that would complete this look." : "No taste profile provided — suggest setting one up for personalized style analysis."}

[VERDICT]
1-2 sentences. Direct recommendation.

[WHERE_TO_BUY]
- Best platform: where to find this product at best price (e.g. SSENSE, Mytheresa, Net-a-Porter, department store sale)
- Better timing: when to buy for discounts (e.g. end of season, Black Friday, sale periods)
- Search tip: keywords to find dupes or similar quality at lower price`;
  }

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  return Response.json({ result: message.content[0].text });
}