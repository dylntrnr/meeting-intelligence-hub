import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(request: NextRequest) {
  const meetingId = request.nextUrl.searchParams.get("meetingId");
  const status = request.nextUrl.searchParams.get("status");

  try {
    const conditions: string[] = [];
    const values: string[] = [];

    if (meetingId) {
      values.push(meetingId);
      conditions.push(`meeting_id = $${values.length}`);
    }
    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const query = `SELECT * FROM action_items ${whereClause} ORDER BY due_date ASC NULLS LAST`;
    const result = await sql.query(query, values);
    const actionItems = result.rows.map((row) => ({
      id: row.id,
      meetingId: row.meeting_id,
      task: row.task,
      owner: row.owner,
      dueDate: row.due_date,
      priority: row.priority,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json({ actionItems });
  } catch (error) {
    return NextResponse.json(
      { error: "Database unavailable — using local fallback" },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const { meetingId, task, owner, dueDate, priority } = body || {};

  if (!meetingId || !task || !owner) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const result = await sql`
      INSERT INTO action_items (meeting_id, task, owner, due_date, priority)
      VALUES (${meetingId}, ${task}, ${owner}, ${dueDate || null}, ${priority || "medium"})
      RETURNING *;
    `;
    const row = result.rows[0];
    return NextResponse.json({
      actionItem: {
        id: row.id,
        meetingId: row.meeting_id,
        task: row.task,
        owner: row.owner,
        dueDate: row.due_date,
        priority: row.priority,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Database unavailable — using local fallback" },
      { status: 503 }
    );
  }
}
