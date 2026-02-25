import { google } from "googleapis";
import { getOAuthClient } from "@/lib/google-auth";

const calendarId = "primary";

export async function getUpcomingEvents(days: number = 2) {
  const client = getOAuthClient(process.env.GOOGLE_REFRESH_TOKEN_WORK);
  if (!client) return null;

  const calendar = google.calendar({ version: "v3", auth: client });
  const now = new Date();
  const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const response = await calendar.events.list({
    calendarId,
    timeMin: now.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 50,
  });

  return response.data.items || [];
}

export async function getEventById(eventId: string) {
  const client = getOAuthClient(process.env.GOOGLE_REFRESH_TOKEN_WORK);
  if (!client) return null;
  const calendar = google.calendar({ version: "v3", auth: client });
  const response = await calendar.events.get({
    calendarId,
    eventId,
  });
  return response.data;
}

export async function getRecentEventsWithAttendee(email: string, days: number = 30) {
  const client = getOAuthClient(process.env.GOOGLE_REFRESH_TOKEN_WORK);
  if (!client) return null;
  const calendar = google.calendar({ version: "v3", auth: client });
  const now = new Date();
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const response = await calendar.events.list({
    calendarId,
    timeMin: start.toISOString(),
    timeMax: now.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 20,
    q: email,
  });
  return response.data.items || [];
}
