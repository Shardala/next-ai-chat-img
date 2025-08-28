/* eslint-disable @typescript-eslint/no-explicit-any */

import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { getDateNow } from '@/app/helpers/common';
import { missingImage, noResponse, whatsInThisImage } from '@/app/consts';

export const runtime = 'nodejs';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const dateNow = getDateNow();

  try {
    const { imageBase64, prompt } = await req.json();

    if (!imageBase64) return NextResponse.json({ error: missingImage }, { status: 400 });

    const messages: any = [
      {
        role: "user",
        content: [
          { type: "text", text: prompt || whatsInThisImage },
          { type: "image_url", image_url: { url: imageBase64 } },
        ],
        date: dateNow
      },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages
    });

    const reply = completion.choices[0]?.message?.content ?? noResponse;

    return NextResponse.json({ reply });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
