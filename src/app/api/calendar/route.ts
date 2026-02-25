import { NextRequest, NextResponse } from "next/server";
import { getUpcomingEvents } from "@/lib/google-calendar";
import { mapEventToMeeting } from "@/lib/meeting";
import { sql } from "@vercel/postgres";

export async function GET(request: NextRequest) {
  const daysParam = request.nextUrl.searchParams.get("days");
  const days = daysParam ? Number(daysParam) : 2;

  try {
    const events = await getUpcomingEvents(days);
    if (!events) {
      return NextResponse.json(
        { error: "Calendar unavailable — check API config" },
        { status: 503 }
      );
    }
    const meetings = events.map(mapEventToMeeting);
    let prepReadyIds: string[] = [];

    try {
      const ids = meetings.map((meeting) => meeting.id);
      if (ids.length) {
        const result = await sql.query(
          "SELECT id FROM meetings WHERE id = ANY($1::text[]) AND prep_generated_at IS NOT NULL",
          [ids]
        );
        prepReadyIds = result.rows.map((row) => row.id);
      }
    } catch (error) {
      prepReadyIds = [];
    }

    return NextResponse.json({ meetings, prepReadyIds });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load calendar" },
      { status: 500 }
    );
  }
}
