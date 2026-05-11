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
          { type: 'text', text: "Analyze this chat screenshot. Be honest and help me read between the lines. ALWAYS write your analysis and replies in the same language that is used in the screenshot." },
          { type: 'image', image: image.split(',')[1] },
        ],
      },
    ],
  });

  return Response.json(result.object);
}