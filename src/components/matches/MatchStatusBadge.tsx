import { MatchStatus } from "@prisma/client";

const statusConfig: Record<MatchStatus, { label: string; className: string }> = {
  PENDING: { label: "대기 중", className: "bg-yellow-100 text-yellow-700" },
  ACCEPTED: { label: "수락됨", className: "bg-green-100 text-green-700" },
  REJECTED: { label: "거절됨", className: "bg-red-100 text-red-700" },
  CANCELLED: { label: "취소됨", className: "bg-gray-100 text-gray-600" },
};

export function MatchStatusBadge({ status }: { status: MatchStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
