"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MatchStatus } from "@prisma/client";

interface MatchActionsProps {
  matchId: string;
  status: MatchStatus;
  role: string;
}

export function MatchActions({ matchId, status, role }: MatchActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (status !== "PENDING") return null;

  async function updateStatus(newStatus: string) {
    setLoading(true);
    await fetch(`/api/matches/${matchId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
    setLoading(false);
  }

  if (role === "TEACHER") {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => updateStatus("ACCEPTED")}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          수락
        </button>
        <button
          onClick={() => updateStatus("REJECTED")}
          disabled={loading}
          className="border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          거절
        </button>
      </div>
    );
  }

  if (role === "CENTER") {
    return (
      <button
        onClick={() => updateStatus("CANCELLED")}
        disabled={loading}
        className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        취소
      </button>
    );
  }

  return null;
}
