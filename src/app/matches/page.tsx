import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MatchStatusBadge } from "@/components/matches/MatchStatusBadge";
import { MatchActions } from "@/components/matches/MatchActions";
import { formatDateTime, formatCurrency } from "@/lib/utils";

export default async function MatchesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const isTeacher = session.user.role === "TEACHER";
  let matches: Awaited<ReturnType<typeof prisma.matchRequest.findMany>> = [];

  if (isTeacher) {
    const teacher = await prisma.teacher.findUnique({ where: { userId: session.user.id } });
    if (teacher) {
      matches = await prisma.matchRequest.findMany({
        where: { teacherId: teacher.id },
        include: {
          teacher: { include: { user: { select: { name: true, email: true } } } },
          center: { include: { user: { select: { name: true, email: true } } } },
        },
        orderBy: { createdAt: "desc" },
      });
    }
  } else {
    const center = await prisma.cultureCenter.findUnique({ where: { userId: session.user.id } });
    if (center) {
      matches = await prisma.matchRequest.findMany({
        where: { centerId: center.id },
        include: {
          teacher: { include: { user: { select: { name: true, email: true } } } },
          center: { include: { user: { select: { name: true, email: true } } } },
        },
        orderBy: { createdAt: "desc" },
      });
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">매칭 관리</h1>
        <p className="text-gray-600 mt-1">매칭 신청 현황을 확인하고 관리하세요.</p>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-xl">
          <p className="text-gray-500 text-lg">아직 매칭 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {isTeacher
                        ? `${(match as any).center.centerName}`
                        : `${(match as any).teacher.user.name} 선생님`}
                    </h3>
                    <MatchStatusBadge status={match.status} />
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(match.createdAt)}
                  </p>
                </div>
                <MatchActions matchId={match.id} status={match.status} role={session.user.role} />
              </div>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                {match.subject && (
                  <div>
                    <p className="text-gray-500">수업 과목</p>
                    <p className="font-medium">{match.subject}</p>
                  </div>
                )}
                {match.schedule && (
                  <div>
                    <p className="text-gray-500">수업 일정</p>
                    <p className="font-medium">{match.schedule}</p>
                  </div>
                )}
                {match.salary && (
                  <div>
                    <p className="text-gray-500">제안 강사료</p>
                    <p className="font-medium">{formatCurrency(match.salary)}/시간</p>
                  </div>
                )}
              </div>

              {match.message && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                  {match.message}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
