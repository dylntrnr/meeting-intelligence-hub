"use client";

import { ActionItem } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import PriorityBadge from "@/components/PriorityBadge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ActionItemRowProps = {
  item: ActionItem;
  onUpdate: (item: ActionItem) => void;
  onToggleComplete?: (item: ActionItem) => void;
  isFocused?: boolean;
  onFocus?: (item: ActionItem) => void;
};

export default function ActionItemRow({
  item,
  onUpdate,
  onToggleComplete,
  isFocused,
  onFocus,
}: ActionItemRowProps) {
  const overdue =
    item.dueDate && new Date(item.dueDate) < new Date() && item.status !== "done";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onFocus?.(item)}
      onKeyDown={(event) => {
        if (event.key === "Enter") onFocus?.(item);
      }}
      className={cn(
        "grid grid-cols-1 gap-3 rounded-2xl border border-white/5 bg-white/2 p-4 text-sm md:grid-cols-[2.5fr_1.2fr_1fr_1fr_1fr]",
        isFocused && "ring-2 ring-accent/40",
        overdue && "border-danger/40"
      )}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={item.status === "done"}
          onChange={() => onToggleComplete?.(item)}
          className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-accent focus:ring-accent/40"
        />
        <Input
          value={item.task}
          onChange={(event) => onUpdate({ ...item, task: event.target.value })}
          className="text-sm"
        />
      </div>
      <Input
        value={item.owner}
        onChange={(event) => onUpdate({ ...item, owner: event.target.value })}
      />
      <Input
        type="date"
        value={item.dueDate ? item.dueDate.slice(0, 10) : ""}
        onChange={(event) => onUpdate({ ...item, dueDate: event.target.value })}
      />
      <select
        value={item.priority}
        onChange={(event) =>
          onUpdate({ ...item, priority: event.target.value as ActionItem["priority"] })
        }
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-textPrimary"
      >
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select
        value={item.status}
        onChange={(event) =>
          onUpdate({ ...item, status: event.target.value as ActionItem["status"] })
        }
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-textPrimary"
      >
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <div className="md:col-span-5 flex flex-wrap gap-2">
        <StatusBadge status={item.status} />
        <PriorityBadge priority={item.priority} />
        {overdue && <span className="text-xs text-danger">Overdue</span>}
      </div>
    </div>
  );
}
