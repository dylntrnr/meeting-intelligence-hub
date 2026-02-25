import { Badge } from "@/components/ui/badge";

const priorityMap: Record<
  string,
  { label: string; variant: "default" | "success" | "warning" | "danger" }
> = {
  high: { label: "High", variant: "danger" },
  medium: { label: "Medium", variant: "warning" },
  low: { label: "Low", variant: "success" },
};

export default function PriorityBadge({ priority }: { priority: string }) {
  const config = priorityMap[priority] || priorityMap.medium;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
