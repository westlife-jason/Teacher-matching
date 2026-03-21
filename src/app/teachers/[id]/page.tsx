import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import { MapPin, Clock, DollarSign, User } from "lucide-react";
import { MatchRequestButton } from "@/components/matches/MatchRequestButton";

export default async function TeacherDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const teacher = await prisma.teacher.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });

  if (!teacher) notFound();

  const session = await getServerSession(authOptions);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
          <div className="flex items-start gap-6">
            <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center flex-shrink-0">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{teacher.user.name}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {teacher.subjects.map((subject) => (
                  <span key={subject} className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {teacher.location && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">활동 지역</p>
                  <p className="font-medium">{teacher.location}</p>
                </div>
              </div>
            )}
            {teacher.experience !== null && (
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">경력</p>
                  <p className="font-medium">{teacher.experience}년</p>
                </div>
              </div>
            )}
            {teacher.hourlyRate !== null && (
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">시간당 강사료</p>
                  <p className="font-medium">{formatCurrency(teacher.hourlyRate)}</p>
                </div>
              </div>
            )}
          </div>

          {teacher.bio && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">소개</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{teacher.bio}</p>
            </div>
          )}

          {/* Match Request Button (문화센터만 표시) */}
          {session?.user.role === "CENTER" && (
            <div className="border-t pt-6">
              <MatchRequestButton teacherId={teacher.id} teacherName={teacher.user.name} />
            </div>
          )}

          {!session && (
            <div className="border-t pt-6 text-center">
              <p className="text-gray-600 mb-4">매칭 신청은 문화센터 계정으로 로그인 후 가능합니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
