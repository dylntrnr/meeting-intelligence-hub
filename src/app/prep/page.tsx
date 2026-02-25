"use client";

import useSWR from "swr";
import MeetingCard from "@/components/MeetingCard";
import { Meeting } from "@/lib/types";
import { Card } from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PrepHubPage() {
  const { data, error, isLoading } = useSWR<{
    meetings: Meeting[];
    prepReadyIds: string[];
  }>("/api/calendar?days=3", fetcher, { refreshInterval: 5 * 60 * 1000 });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prep Queue</h1>
        <p className="text-sm text-textSecondary">
          Upcoming meetings that need prep.
        </p>
      </div>

      {error && (
        <Card className="text-sm text-textSecondary">
          Calendar unavailable — check API config.
        </Card>
      )}

      {isLoading && (
        <Card className="text-sm text-textSecondary">Loading meetings…</Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {(data?.meetings || []).map((meeting) => (
          <MeetingCard
            key={meeting.id}
            meeting={meeting}
            hasPrep={(data?.prepReadyIds || []).includes(meeting.id)}
            hasOpenItems={false}
          />
        ))}
      </div>
    </div>
  );
}
