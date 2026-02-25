import Link from "next/link";
import { format } from "date-fns";
import { CalendarClock, Users } from "lucide-react";
import { Meeting } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type MeetingCardProps = {
  meeting: Meeting;
  hasPrep?: boolean;
  hasOpenItems?: boolean;
};

export default function MeetingCard({
  meeting,
  hasPrep,
  hasOpenItems,
}: MeetingCardProps) {
  const start = new Date(meeting.startTime);
  const end = new Date(meeting.endTime);
  const status = hasOpenItems ? "warning" : hasPrep ? "success" : "default";

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{meeting.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-textSecondary">
            <CalendarClock size={16} />
            <span className="font-mono">
              {format(start, "MMM d, h:mm a")} – {format(end, "h:mm a")}
            </span>
            {meeting.location && (
              <Badge variant="accent">{meeting.location}</Badge>
            )}
          </div>
        </div>
        <Badge variant={status} className="text-xs">
          {hasOpenItems ? "Open actions" : hasPrep ? "Prep ready" : "No prep"}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-textSecondary">
        <Users size={16} />
        {meeting.attendees.slice(0, 6).map((attendee) => (
          <span
            key={attendee.email}
            className="rounded-full bg-white/5 px-3 py-1 text-xs text-textPrimary"
          >
            {attendee.name || attendee.email.split("@")[0]}
          </span>
        ))}
        {meeting.attendees.length > 6 && (
          <span className="text-xs">
            +{meeting.attendees.length - 6} more
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href={`/meeting/${meeting.id}/prep`}>
          <Button variant="primary" size="sm">
            Prep 🧠
          </Button>
        </Link>
        <Link href={`/meeting/${meeting.id}/debrief`}>
          <Button variant="secondary" size="sm">
            Debrief 📝
          </Button>
        </Link>
        {meeting.meetingLink && (
          <a
            href={meeting.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-accent underline underline-offset-4"
          >
            Join link
          </a>
        )}
      </div>
    </Card>
  );
}
