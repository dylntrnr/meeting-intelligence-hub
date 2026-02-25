import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";

function extractJsonArray(text: string) {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch (error) {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const notes = body?.notes as string | undefined;
  const attendees = body?.attendees as string[] | undefined;

  if (!notes) {
    return NextResponse.json({ error: "Missing notes" }, { status: 400 });
  }

  const openai = getOpenAIClient();
  if (!openai) {
    return NextResponse.json(
      { error: "OpenAI unavailable — add OPENAI_API_KEY" },
      { status: 503 }
    );
  }

  const today = new Date();
  const defaultDue = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const prompt = [
    `Attendees: ${attendees?.join(", ") || "Unknown"}`,
    `Meeting notes:\n${notes}`,
  ].join("\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a meeting assistant. Extract action items from these meeting notes. Return a JSON array of { task, owner, dueDate, priority }. Owner should be one of the attendees or 'Dylan' if unclear. If no due date mentioned, use a date 7 days from today.",
      },
      { role: "user", content: prompt },
    ],
  });

  const content = completion.choices[0]?.message?.content || "[]";
  const parsed = extractJsonArray(content);

  if (!parsed) {
    return NextResponse.json(
      {
        error: "Failed to parse action items",
        raw: content,
        defaultDue,
      },
      { status: 500 }
    );
  }

  const actionItems = parsed.map((item: any) => ({
    task: item.task || "Untitled task",
    owner: item.owner || "Dylan",
    dueDate: item.dueDate || defaultDue,
    priority: item.priority || "medium",
    status: "open",
  }));

  return NextResponse.json({ actionItems });
}
