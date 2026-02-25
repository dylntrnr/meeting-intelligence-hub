import { Mail } from "lucide-react";
import { PrepAttendeeContext } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type AttendeeCardProps = {
  attendee: PrepAttendeeContext;
};

export default function AttendeeCard({ attendee }: AttendeeCardProps) {
  return (
    <Card className="space-y-4">
      <div>
        <h4 className="text-base font-semibold">{attendee.name}</h4>
        <p className="text-sm text-textSecondary">{attendee.email}</p>
        {(attendee.title || attendee.company) && (
          <p className="text-sm text-textSecondary">
            {[attendee.title, attendee.company].filter(Boolean).join(" · ")}
          </p>
        )}
        {attendee.linkedIn && (
          <a
            href={attendee.linkedIn}
            className="text-xs text-accent underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        )}
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-textSecondary">
          Recent emails
        </p>
        <div className="mt-2 space-y-2 text-sm">
          {attendee.lastEmails.length ? (
            attendee.lastEmails.map((email) => (
              <div key={email.id || email.subject} className="flex gap-2">
                <Mail size={16} className="mt-0.5 text-textSecondary" />
                <div>
                  <p className="text-textPrimary">{email.subject}</p>
                  <p className="text-xs text-textSecondary">{email.date}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-textSecondary">No recent emails.</p>
          )}
        </div>
      </div>

      {attendee.lastMeeting && (
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-textSecondary">
            Last meeting
          </p>
          <Badge variant="accent" className="mt-2">
            {attendee.lastMeeting.title}
          </Badge>
        </div>
      )}
    </Card>
  );
}
