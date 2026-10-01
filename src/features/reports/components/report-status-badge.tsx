import { STATUS_LABEL, type Status } from "@/lib/types";

const COLOR: Record<Status, string> = {
  submitted: "bg-amber-100 text-amber-800",
  spv_approved: "bg-blue-100 text-blue-800",
  final: "bg-green-100 text-green-800",
};

export function ReportStatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${COLOR[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
