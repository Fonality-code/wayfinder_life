import { cn } from "@/lib/utils"

export type PackageStatus =
  | "pending"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "exception"
  | "returned"

const STATUS_MAP: Record<
  PackageStatus,
  { label: string; dot: string; text: string; bg: string; ring: string }
> = {
  pending: {
    label: "Pending",
    dot: "bg-gray-400",
    text: "text-gray-700",
    bg: "bg-gray-100",
    ring: "ring-gray-300",
  },
  in_transit: {
    label: "In Transit",
    dot: "bg-blue-500",
    text: "text-blue-700",
    bg: "bg-blue-50",
    ring: "ring-blue-200",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    dot: "bg-purple-500",
    text: "text-purple-700",
    bg: "bg-purple-50",
    ring: "ring-purple-200",
  },
  delivered: {
    label: "Delivered",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
  },
  exception: {
    label: "Exception",
    dot: "bg-rose-500",
    text: "text-rose-700",
    bg: "bg-rose-50",
    ring: "ring-rose-200",
  },
  returned: {
    label: "Returned",
    dot: "bg-amber-500",
    text: "text-amber-800",
    bg: "bg-amber-50",
    ring: "ring-amber-200",
  },
}

interface StatusBadgeProps {
  status?: PackageStatus
  className?: string
  size?: "sm" | "md" | "lg"
}

export function StatusBadge({ status = "in_transit", className, size = "md" }: StatusBadgeProps) {
  const s = STATUS_MAP[status]
  const sizeCls =
    size === "sm"
      ? "text-xs px-2 py-0.5"
      : size === "lg"
      ? "text-sm px-3 py-1.5"
      : "text-sm px-2.5 py-1"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full ring-1 font-medium",
        s.bg,
        s.text,
        s.ring,
        sizeCls,
        className,
      )}
      aria-label={`Status: ${s.label}`}
    >
      <span className={cn("size-2 rounded-full", s.dot)} aria-hidden="true" />
      {s.label}
    </span>
  )
}
