import { NextRequest, NextResponse } from "next/server";
import { getEventById, getRecentEventsWithAttendee } from "@/lib/google-calendar";
import { getContactByEmail } from "@/lib/google-contacts";
import { getEmailsWithPerson, getRecentMentions } from "@/lib/google-gmail";
import { mapEventToMeeting } from "@/lib/meeting";
import { getOpenAIClient } from "@/lib/openai";
import { MeetingPrepContext, PrepAttendeeContext } from "@/lib/types";
import { sql } from "@vercel/postgres";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await getEventById(params.id);
    if (!event) {
      return NextResponse.json(
        { error: "Calendar unavailable — check API config" },
        { status: 503 }
      );
    }

    const meeting = mapEventToMeeting(event);
    try {
      await sql`
        INSERT INTO meetings (id, title, start_time, end_time, attendees, prep_generated_at)
        VALUES (
          ${meeting.id},
          ${meeting.title},
          ${meeting.startTime},
          ${meeting.endTime},
          ${JSON.stringify(meeting.attendees)},
          NOW()
        )
        ON CONFLICT (id)
        DO UPDATE SET prep_generated_at = NOW();
      `;
    } catch (error) {
      // Ignore DB errors to allow prep to load without persistence
    }
    const attendeeContexts: PrepAttendeeContext[] = await Promise.all(
      meeting.attendees.map(async (attendee) => {
        const [contact, emails, recentEvents] = await Promise.all([
          getContactByEmail(attendee.email),
          getEmailsWithPerson(attendee.email, 3),
          getRecentEventsWithAttendee(attendee.email, 45),
        ]);

        const lastMeetingEvent = (recentEvents || [])
          .filter((evt) => evt.id !== meeting.id)
          .sort((a, b) =>
            (b.start?.dateTime || b.start?.date || "").localeCompare(
              a.start?.dateTime || a.start?.date || ""
            )
          )[0];

        const mentionQuery = `newer_than:7d ("${meeting.title}" OR "${
          attendee.name || attendee.email
        }")`;
        const recentMentions = (await getRecentMentions(mentionQuery, 3)) || [];

        return {
          ...attendee,
          name: contact?.name || attendee.name,
          company: contact?.company,
          title: contact?.title,
          linkedIn: contact?.linkedIn,
          lastEmails: emails || [],
          lastMeeting: lastMeetingEvent ? mapEventToMeeting(lastMeetingEvent) : undefined,
          recentMentions,
        };
      })
    );

    const recentEvents = (
      await Promise.all(
        meeting.attendees.map((attendee) =>
          getRecentEventsWithAttendee(attendee.email, 30)
        )
      )
    )
      .flat()
      .filter(Boolean)
      .map((event) => mapEventToMeeting(event!))
      .filter((event, index, arr) => arr.findIndex((e) => e.id === event.id) === index)
      .slice(0, 6);

    let aiBriefing: string | undefined;
    let aiError: string | undefined;

    const openai = getOpenAIClient();
    if (openai) {
      const prompt = [
        `Meeting title: ${meeting.title}`,
        `Attendees: ${meeting.attendees.map((a) => `${a.name} (${a.email})`).join(", ")}`,
        `Location/link: ${meeting.location || meeting.meetingLink || "N/A"}`,
        `Description: ${meeting.description || "N/A"}`,
        `Recent context: ${attendeeContexts
          .map((a) => `${a.name}: ${a.lastEmails[0]?.subject || "No emails"}`)
          .join(" | ")}`,
      ].join("\n");

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a meeting assistant. Write a 3-5 sentence briefing for the host.",
          },
          { role: "user", content: prompt },
        ],
      });
      aiBriefing = completion.choices[0]?.message?.content || undefined;
    } else {
      aiError = "AI briefing unavailable — add OPENAI_API_KEY";
    }

    const payload: MeetingPrepContext = {
      meeting,
      attendees: attendeeContexts,
      recentEvents,
      aiBriefing,
      aiError,
    };

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to build prep context" },
      { status: 500 }
    );
  }
}
