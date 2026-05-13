import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { image } = await req.json();

  // Define a single scenario structure
  const InterpretationSchema = z.object({
    title: z.string().describe("A short title, e.g., 'Scenario A: Annoyed' or 'Scenario B: Just Busy'"),
    vibe: z.string().describe("The overall mood of the chat in this scenario"),
    hidden_meaning: z.string().describe("What they are actually saying in this scenario"),
    red_flags: z.array(z.string()).describe("Any passive-aggressive or mean parts in this scenario"),
    encouraging_quote: z.string().describe("A short, uplifting, and validating sentence to support the user emotionally in this scenario."),
    replies: z.object({
      shield: z.string().describe("A boundary-setting, safe response"),
      bridge: z.string().describe("An empathetic, connecting, or vulnerable response"),
      suit: z.string().describe("A professional, detached, or neutral response")
    })
  });

  const result = await generateObject({
    model: google('gemini-2.5-flash'),
    schema: z.object({
      confidence_score: z.number().min(0).max(100).describe("Confidence rating from 0 to 100"),
      reasoning: z.string().describe("A one-sentence explanation of why you gave this score"),
      interpretations: z.array(InterpretationSchema).min(1).max(2).describe("Provide 1 interpretation if highly confident. Provide 2 distinctly different interpretations if the text is ambiguous or confidence is below 60.")
    }),
    messages: [
      {
        role: 'user',
        content: [
          { 
            type: 'text', 
            text: `You are an expert in linguistics, emotional intelligence, neurodiversity-aware communication, and anxiety-sensitive analysis.

Your task:
1. Read the chat screenshot **in the same language** that appears in the screenshot.
2. Evaluate Confidence: If the text is clear, give a high confidence score (80-100) and provide ONE interpretation. If the text is short, ambiguous, or lacks context, give a low score (0-60) and provide TWO distinct interpretations (e.g., Scenario A: Negative/Upset, Scenario B: Neutral/Busy).
3. For each interpretation, identify the vibe, hidden meaning, and any red flags.
4. For each interpretation, craft three distinct replies (shield, bridge, suit) that match that specific scenario.
5. For each interpretation, write ONE short, highly empathetic 'encouraging_quote' that validates the user's feelings and boosts their confidence based on the chat.
6. **ALWAYS** output everything in the EXACT language used in the screenshot.

Now, analyze the chat.` 
          },
          { type: 'image', image: image.split(',')[1] },
        ],
      },
    ],
  });

  return Response.json(result.object);
}