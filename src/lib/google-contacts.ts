import { google } from "googleapis";
import { getOAuthClient } from "@/lib/google-auth";

export async function getContactByEmail(email: string) {
  const client = getOAuthClient(process.env.GOOGLE_REFRESH_TOKEN_WORK);
  if (!client) return null;

  const people = google.people({ version: "v1", auth: client });
  try {
    const response = await people.people.searchContacts({
      query: email,
      readMask: "names,emailAddresses,organizations,urls",
      pageSize: 1,
    });

    const result = response.data.results?.[0]?.person;
    if (!result) return null;
    const name = result.names?.[0]?.displayName;
    const org = result.organizations?.[0];
    const linkedIn = result.urls?.find((url) =>
      url.value?.toLowerCase().includes("linkedin")
    )?.value;

    return {
      name,
      email,
      company: org?.name,
      title: org?.title,
      linkedIn: linkedIn || undefined,
    };
  } catch (error) {
    return null;
  }
}
