import { NextRequest, NextResponse } from "next/server";
import { getEmailsWithPerson } from "@/lib/google-gmail";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  const limitParam = request.nextUrl.searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : 5;

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    const emails = await getEmailsWithPerson(email, limit);
    if (!emails) {
      return NextResponse.json(
        { error: "Email context unavailable — check API config" },
        { status: 503 }
      );
    }
    return NextResponse.json({ emails });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load emails" }, { status: 500 });
  }
}
