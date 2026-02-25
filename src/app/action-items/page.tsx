"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import ActionItemsTable from "@/components/ActionItemsTable";
import StatsBar from "@/components/StatsBar";
import { ActionItem } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return { status: response.status, data };
};

const localKey = "meeting-hub-action-items";

export default function ActionItemsPage() {
  const [items, setItems] = useState<ActionItem[]>([]);
  const [useLocal, setUseLocal] = useState(false);
  const [grouped, setGrouped] = useState(true);
  const [focusedId, setFocusedId] = useState<string | undefined>(undefined);
  const [filters, setFilters] = useState({
    owner: "",
    status: "",
    priority: "",
    dueFrom: "",
    dueTo: "",
  });

  const { data } = useSWR("/api/action-items", fetcher);

  useEffect(() => {
    if (!data) return;
    if (data.status === 503) {
      const local = localStorage.getItem(localKey);
      if (local) {
        setItems(JSON.parse(local));
      }
      setUseLocal(true);
      return;
    }
    setItems(data.data.actionItems || []);
  }, [data]);

  useEffect(() => {
    if (useLocal) {
      localStorage.setItem(localKey, JSON.stringify(items));
    }
  }, [items, useLocal]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "c" && focusedId) {
        const target = items.find(
          (item) => item.id === focusedId || item.clientId === focusedId
        );
        if (target) {
          toggleComplete(target);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [focusedId, items, toggleComplete]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.owner && !item.owner.toLowerCase().includes(filters.owner.toLowerCase()))
        return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.priority && item.priority !== filters.priority) return false;
      if (filters.dueFrom && item.dueDate && item.dueDate < filters.dueFrom) return false;
      if (filters.dueTo && item.dueDate && item.dueDate > filters.dueTo) return false;
      return true;
    });
  }, [items, filters]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const open = items.filter((item) => item.status !== "done").length;
    const dueToday = items.filter(
      (item) => item.dueDate === today && item.status !== "done"
    ).length;
    const overdue = items.filter(
      (item) =>
        item.dueDate && item.dueDate < today && item.status !== "done"
    ).length;
    return { open, dueToday, overdue };
  }, [items]);

  const updateItem = useCallback(
    async (item: ActionItem) => {
      setItems((prev) =>
        prev.map((prevItem) => (prevItem.id === item.id ? item : prevItem))
      );
      if (useLocal || !item.id) return;
      await fetch(`/api/action-items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: item.status,
          owner: item.owner,
          dueDate: item.dueDate,
          priority: item.priority,
          task: item.task,
        }),
      });
    },
    [useLocal]
  );

  const toggleComplete = useCallback(
    (item: ActionItem) => {
      updateItem({
        ...item,
        status: item.status === "done" ? "open" : "done",
      });
    },
    [updateItem]
  );

  const groupedItems = useMemo(() => {
    if (!grouped) return { All: filteredItems };
    return filteredItems.reduce<Record<string, ActionItem[]>>((acc, item) => {
      const key = item.meetingId || "Unknown meeting";
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [filteredItems, grouped]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Action Items</h1>
          <p className="text-sm text-textSecondary">
            Track tasks across all meetings.
          </p>
        </div>
        <StatsBar {...stats} />
      </div>

      {useLocal && (
        <Card className="text-sm text-warning">
          Database unavailable — using localStorage fallback.
        </Card>
      )}

      <Card className="grid gap-3 md:grid-cols-5">
        <Input
          placeholder="Filter by owner"
          value={filters.owner}
          onChange={(event) => setFilters({ ...filters, owner: event.target.value })}
        />
        <select
          value={filters.status}
          onChange={(event) => setFilters({ ...filters, status: event.target.value })}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-textPrimary"
        >
          <option value="">All status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select
          value={filters.priority}
          onChange={(event) => setFilters({ ...filters, priority: event.target.value })}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-textPrimary"
        >
          <option value="">All priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <Input
          type="date"
          value={filters.dueFrom}
          onChange={(event) => setFilters({ ...filters, dueFrom: event.target.value })}
        />
        <Input
          type="date"
          value={filters.dueTo}
          onChange={(event) => setFilters({ ...filters, dueTo: event.target.value })}
        />
      </Card>

      <div className="flex gap-2">
        <Button
          variant={grouped ? "primary" : "secondary"}
          size="sm"
          onClick={() => setGrouped(true)}
        >
          Grouped
        </Button>
        <Button
          variant={!grouped ? "primary" : "secondary"}
          size="sm"
          onClick={() => setGrouped(false)}
        >
          Flat list
        </Button>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedItems).map(([group, groupItems]) => (
          <div key={group} className="space-y-3">
            {grouped && (
              <h2 className="text-sm uppercase tracking-[0.3em] text-textSecondary">
                {group}
              </h2>
            )}
            <ActionItemsTable
              items={groupItems}
              onUpdate={updateItem}
              onToggleComplete={toggleComplete}
              focusedId={focusedId}
              onFocus={(item) => setFocusedId(item.id || item.clientId)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
