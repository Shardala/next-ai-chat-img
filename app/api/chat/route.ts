/* eslint-disable @typescript-eslint/no-explicit-any */

import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { getDateNow } from '@/app/helpers/common';
import { noResponse, sayHello } from '@/app/consts';

export const runtime = 'nodejs';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const dateNow = getDateNow();

  try {
    const { messages } = await req.json();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages?.map((m: any) => ({ role: m.role, content: m.content })) ?? [
        { role: "user", content: sayHello, date: dateNow }
      ],
      temperature: 0.5
    });

    const reply = completion.choices[0]?.message?.content ?? noResponse;

    return NextResponse.json({ reply });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
