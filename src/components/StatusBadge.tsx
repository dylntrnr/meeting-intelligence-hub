import { Badge } from "@/components/ui/badge";

const statusMap: Record<
  string,
  { label: string; variant: "default" | "success" | "warning" | "accent" }
> = {
  open: { label: "Open", variant: "warning" },
  in_progress: { label: "In Progress", variant: "accent" },
  done: { label: "Done", variant: "success" },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = statusMap[status] || statusMap.open;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
