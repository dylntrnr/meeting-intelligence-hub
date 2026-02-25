export type Attendee = {
  name: string;
  email: string;
  company?: string;
  title?: string;
  linkedIn?: string;
};

export type Meeting = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
  attendees: Attendee[];
  meetingLink?: string;
};

export type EmailContext = {
  id?: string;
  subject: string;
  date?: string;
  snippet?: string;
  threadId?: string;
};

export type PrepAttendeeContext = Attendee & {
  lastEmails: EmailContext[];
  lastMeeting?: Meeting;
  recentMentions: EmailContext[];
};

export type MeetingPrepContext = {
  meeting: Meeting;
  attendees: PrepAttendeeContext[];
  recentEvents: Meeting[];
  aiBriefing?: string;
  aiError?: string;
};

export type ActionItem = {
  id?: string;
  clientId?: string;
  meetingId: string;
  task: string;
  owner: string;
  dueDate?: string;
  priority: "high" | "medium" | "low";
  status: "open" | "in_progress" | "done";
  createdAt?: string;
  updatedAt?: string;
};
