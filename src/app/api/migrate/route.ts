import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS meetings (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        start_time TIMESTAMPTZ NOT NULL,
        end_time TIMESTAMPTZ NOT NULL,
        attendees JSONB DEFAULT '[]',
        prep_generated_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS action_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        meeting_id TEXT REFERENCES meetings(id) ON DELETE CASCADE,
        task TEXT NOT NULL,
        owner TEXT NOT NULL,
        due_date DATE,
        priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
        status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'done')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_action_items_status ON action_items(status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_action_items_due_date ON action_items(due_date);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_action_items_meeting_id ON action_items(meeting_id);`;

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Migration failed", details: (error as Error).message },
      { status: 500 }
    );
  }
}
