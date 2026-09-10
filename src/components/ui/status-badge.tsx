import { cn } from "@/lib/utils";
import { Badge } from "./badge";

export function StatusBadge({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return <Badge className={cn("shrink-0 border-transparent", className)}>{label}</Badge>;
}