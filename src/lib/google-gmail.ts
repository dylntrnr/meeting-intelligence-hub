import { google } from "googleapis";
import { getOAuthClient } from "@/lib/google-auth";

export async function getEmailsWithPerson(email: string, limit: number = 5) {
  const client = getOAuthClient(process.env.GOOGLE_REFRESH_TOKEN_WORK);
  if (!client) return null;

  const gmail = google.gmail({ version: "v1", auth: client });
  const query = `from:${email} OR to:${email}`;

  const listResponse = await gmail.users.messages.list({
    userId: "me",
    q: query,
    maxResults: limit,
  });

  const messages = listResponse.data.messages || [];
  const details = await Promise.all(
    messages.map(async (msg) => {
      const detail = await gmail.users.messages.get({
        userId: "me",
        id: msg.id || "",
        format: "metadata",
        metadataHeaders: ["Subject", "From", "To", "Date"],
      });
      const headers = detail.data.payload?.headers || [];
      return {
        id: msg.id,
        subject: headers.find((h) => h.name === "Subject")?.value || "(no subject)",
        date: headers.find((h) => h.name === "Date")?.value,
        snippet: detail.data.snippet,
        threadId: detail.data.threadId,
      };
    })
  );

  return details;
}

export async function getRecentMentions(query: string, limit: number = 5) {
  const client = getOAuthClient(process.env.GOOGLE_REFRESH_TOKEN_WORK);
  if (!client) return null;
  const gmail = google.gmail({ version: "v1", auth: client });
  const listResponse = await gmail.users.messages.list({
    userId: "me",
    q: query,
    maxResults: limit,
  });

  const messages = listResponse.data.messages || [];
  const details = await Promise.all(
    messages.map(async (msg) => {
      const detail = await gmail.users.messages.get({
        userId: "me",
        id: msg.id || "",
        format: "metadata",
        metadataHeaders: ["Subject", "From", "To", "Date"],
      });
      const headers = detail.data.payload?.headers || [];
      return {
        id: msg.id,
        subject: headers.find((h) => h.name === "Subject")?.value || "(no subject)",
        date: headers.find((h) => h.name === "Date")?.value,
        snippet: detail.data.snippet,
        threadId: detail.data.threadId,
      };
    })
  );

  return details;
}
