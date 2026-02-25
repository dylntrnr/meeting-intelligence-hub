import { Badge } from "@/components/ui/badge";

type StatsBarProps = {
  open: number;
  dueToday: number;
  overdue: number;
};

export default function StatsBar({ open, dueToday, overdue }: StatsBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="accent">{open} open</Badge>
      <Badge variant="warning">{dueToday} due today</Badge>
      <Badge variant="danger">{overdue} overdue</Badge>
    </div>
  );
}
