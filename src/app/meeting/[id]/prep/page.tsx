"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import AttendeeCard from "@/components/AttendeeCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MeetingPrepContext } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PrepPage() {
  const params = useParams<{ id: string }>();
  const { data, error, isLoading } = useSWR<MeetingPrepContext>(
    `/api/meeting/${params.id}/prep`,
    fetcher
  );

  const copyBriefing = () => {
    if (data?.aiBriefing) {
      navigator.clipboard.writeText(data.aiBriefing);
    }
  };

  if (error) {
    return (
      <Card className="text-sm text-textSecondary">
        Prep unavailable — check API config.
      </Card>
    );
  }

  if (isLoading || !data) {
    return <Card className="text-sm text-textSecondary">Loading prep…</Card>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prep Brief</h1>
        <p className="text-sm text-textSecondary">
          Context for {data.meeting.title}
        </p>
      </div>

      <Card className="space-y-4">
        <h2 className="text-xl font-semibold">Meeting Overview</h2>
        <div className="text-sm text-textSecondary">
          <p>
            <span className="text-textPrimary">Time:</span>{" "}
            {new Date(data.meeting.startTime).toLocaleString()} –{" "}
            {new Date(data.meeting.endTime).toLocaleTimeString()}
          </p>
          <p>
            <span className="text-textPrimary">Location:</span>{" "}
            {data.meeting.location || data.meeting.meetingLink || "TBD"}
          </p>
          <p className="mt-3 whitespace-pre-line text-textPrimary">
            {data.meeting.description || "No agenda provided."}
          </p>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Attendees</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {data.attendees.map((attendee) => (
            <AttendeeCard key={attendee.email} attendee={attendee} />
          ))}
        </div>
      </div>

      <Card className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Context</h2>
        <div className="text-sm text-textSecondary">
          {data.recentEvents.length ? (
            <ul className="space-y-2">
              {data.recentEvents.map((event) => (
                <li key={event.id} className="text-textPrimary">
                  {event.title} · {new Date(event.startTime).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent events with these attendees.</p>
          )}
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Quick Briefing</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => window.print()}>
              Export to PDF
            </Button>
            <Button size="sm" variant="primary" onClick={copyBriefing}>
              Copy Briefing
            </Button>
          </div>
        </div>
        {data.aiBriefing ? (
          <p className="text-sm text-textPrimary whitespace-pre-line">
            {data.aiBriefing}
          </p>
        ) : (
          <p className="text-sm text-textSecondary">
            {data.aiError || "AI briefing unavailable."}
          </p>
        )}
      </Card>
    </div>
  );
}
