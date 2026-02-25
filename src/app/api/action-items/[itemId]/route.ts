import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  const body = await request.json().catch(() => null);
  const fields = body || {};

  const updates: string[] = [];
  const values: any[] = [];
  const keys = ["status", "owner", "dueDate", "priority", "task"];

  keys.forEach((key) => {
    if (fields[key] !== undefined) {
      values.push(fields[key]);
      const column = key === "dueDate" ? "due_date" : key;
      updates.push(`${column} = $${values.length}`);
    }
  });

  if (!updates.length) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  values.push(params.itemId);

  try {
    const query = `UPDATE action_items SET ${updates.join(
      ", "
    )}, updated_at = NOW() WHERE id = $${
      values.length
    } RETURNING *;`;
    const result = await sql.query(query, values);
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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    await sql`DELETE FROM action_items WHERE id = ${params.itemId};`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Database unavailable — using local fallback" },
      { status: 503 }
    );
  }
}
