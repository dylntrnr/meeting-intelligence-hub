import { calendar_v3 } from "googleapis";
import { Attendee, Meeting } from "@/lib/types";

export function mapEventToMeeting(event: calendar_v3.Schema$Event): Meeting {
  const attendees: Attendee[] =
    event.attendees?.map((attendee) => ({
      name: attendee.displayName || attendee.email || "Unknown",
      email: attendee.email || "",
    })) || [];

  const startTime = event.start?.dateTime || event.start?.date || new Date().toISOString();
  const endTime = event.end?.dateTime || event.end?.date || new Date().toISOString();

  return {
    id: event.id || "",
    title: event.summary || "Untitled meeting",
    startTime,
    endTime,
    location: event.location || undefined,
    description: event.description || undefined,
    attendees,
    meetingLink:
      event.hangoutLink ||
      event.conferenceData?.entryPoints?.find((point) => point.uri)?.uri ||
      undefined,
  };
}
