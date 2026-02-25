"use client";

import { ActionItem } from "@/lib/types";
import ActionItemRow from "@/components/ActionItemRow";

type ActionItemsTableProps = {
  items: ActionItem[];
  onUpdate: (item: ActionItem) => void;
  onToggleComplete: (item: ActionItem) => void;
  focusedId?: string;
  onFocus?: (item: ActionItem) => void;
};

export default function ActionItemsTable({
  items,
  onUpdate,
  onToggleComplete,
  focusedId,
  onFocus,
}: ActionItemsTableProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ActionItemRow
          key={item.id || item.clientId || `${item.meetingId}-${item.task}`}
          item={item}
          onUpdate={onUpdate}
          onToggleComplete={onToggleComplete}
          isFocused={focusedId === item.id || focusedId === item.clientId}
          onFocus={onFocus}
        />
      ))}
    </div>
  );
}
