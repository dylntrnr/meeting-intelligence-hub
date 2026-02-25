"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import ActionItemsTable from "@/components/ActionItemsTable";
import { ActionItem, MeetingPrepContext } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DebriefPage() {
  const params = useParams<{ id: string }>();
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const { data } = useSWR<MeetingPrepContext>(
    `/api/meeting/${params.id}/prep`,
    fetcher
  );

  const extractItems = async () => {
    setLoading(true);
    setStatus(null);
    const response = await fetch(`/api/meeting/${params.id}/extract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notes,
        attendees: data?.meeting.attendees.map((a) => a.name || a.email),
      }),
    });

    const result = await response.json();
    if (response.ok) {
      setItems(
        result.actionItems.map((item: any, index: number) => ({
          ...item,
          meetingId: params.id,
          status: "open",
          clientId: `${params.id}-${Date.now()}-${index}`,
        }))
      );
    } else {
      setStatus(result.error || "Failed to extract action items");
    }
    setLoading(false);
  };

  const saveItems = async () => {
    setLoading(true);
    setStatus(null);
    const saved: ActionItem[] = [];
    let failed = false;
    for (const item of items) {
      const response = await fetch("/api/action-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const result = await response.json();
      if (response.ok) {
        saved.push({
          ...item,
          id: result.actionItem.id,
        });
      } else {
        failed = true;
      }
    }
    setItems(saved);
    setLoading(false);
    setStatus(failed ? "Some items failed to save." : "Saved action items.");
  };

  const copyToSlack = () => {
    const lines = items.map(
      (item) =>
        `• ${item.task} — ${item.owner} (due ${item.dueDate || "TBD"})`
    );
    navigator.clipboard.writeText(lines.join("\n"));
    setStatus("Copied to clipboard.");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Debrief</h1>
        <p className="text-sm text-textSecondary">
          Paste meeting notes and extract action items.
        </p>
      </div>

      <Card className="space-y-4">
        <Textarea
          rows={10}
          placeholder="Paste your meeting notes here..."
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            onClick={extractItems}
            disabled={loading || !notes}
          >
            Extract Action Items
          </Button>
          <Button
            variant="secondary"
            onClick={saveItems}
            disabled={loading || !items.length}
          >
            Save Action Items
          </Button>
          <Button
            variant="ghost"
            onClick={copyToSlack}
            disabled={!items.length}
          >
            Copy to Slack
          </Button>
        </div>
        {status && <p className="text-sm text-textSecondary">{status}</p>}
      </Card>

      {items.length > 0 && (
        <ActionItemsTable
          items={items}
          onUpdate={(item) =>
            setItems((prev) =>
              prev.map((prevItem) =>
                prevItem.clientId === item.clientId ? item : prevItem
              )
            )
          }
          onToggleComplete={(item) =>
            setItems((prev) =>
              prev.map((prevItem) =>
                prevItem.clientId === item.clientId
                  ? {
                      ...prevItem,
                      status: prevItem.status === "done" ? "open" : "done",
                    }
                  : prevItem
              )
            )
          }
        />
      )}
    </div>
  );
}
