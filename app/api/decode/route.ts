import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { image } = await req.json();

  const result = await generateObject({
    model: google('gemini-2.5-flash'),
    schema: z.object({
      vibe: z.string().describe("The overall mood of the chat"),
      hidden_meaning: z.string().describe("What they are actually saying"),
      red_flags: z.array(z.string()).describe("Any passive-aggressive or mean parts"),
      replies: z.object({
        shield: z.string().describe("A boundary-setting, safe response"),
        bridge: z.string().describe("An empathetic, connecting, or vulnerable response"),
        suit: z.string().describe("A professional, detached, or neutral response")
      }),
    }),
    messages: [
      {
        role: 'user',
        content: [
          { 
            type: 'text', 
            text: `You are an expert in linguistics, emotional intelligence, neurodiversity-aware communication, and anxiety-sensitive analysis.

Your task:
1. Read the chat screenshot (provided as an image) **in the same language** that appears in the screenshot.
2. Identify:
   • The overall **vibe** / emotional temperature of the exchange.
   • Any **hidden meaning** – what is really being communicated beneath the surface.
   • **Red flags** – passive-aggressive, dismissive, hostile, or otherwise concerning utterances.
   • **Power dynamics** – who is exerting influence, who is being marginalized, any status or authority cues.
   • **Neurodiversity considerations** – look for atypical phrasing, literal vs. figurative language, need for predictability, sensory-overload hints, communication style mismatches, etc.
   • **Anxiety indicators** – hedging, excessive apologizing, catastrophizing, requests for reassurance, physiological-type metaphors, avoidance, etc.
3. Based on the above, craft three distinct reply styles that a responder could use:
   • **shield** – a boundary-setting, safe reply that protects the speaker’s wellbeing while respecting neurodivergent communication needs.
   • **bridge** – an empathetic, connecting, or vulnerable reply that invites openness and validates feelings.
   • **suit** – a professional, detached, or neutral reply suitable for workplace or formal contexts.
4. **ALWAYS** output your analysis and the three replies in the EXACT language used in the screenshot. Do not default to English unless the screenshot is in English.

Now, analyze the chat.` 
          },
          { type: 'image', image: image.split(',')[1] },
        ],
      },
    ],
  });

  return Response.json(result.object);
}