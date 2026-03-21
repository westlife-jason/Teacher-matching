import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, MessageSquare, CheckCircle, Clock } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const isTeacher = session.user.role === "TEACHER";

  let stats = { pending: 0, accepted: 0, messages: 0 };

  if (isTeacher) {
    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id },
    });
    if (teacher) {
      const [pending, accepted, unreadMessages] = await Promise.all([
        prisma.matchRequest.count({ where: { teacherId: teacher.id, status: "PENDING" } }),
        prisma.matchRequest.count({ where: { teacherId: teacher.id, status: "ACCEPTED" } }),
        prisma.message.count({ where: { receiverId: session.user.id, read: false } }),
      ]);
      stats = { pending, accepted, messages: unreadMessages };
    }
  } else {
    const center = await prisma.cultureCenter.findUnique({
      where: { userId: session.user.id },
    });
    if (center) {
      const [pending, accepted, unreadMessages] = await Promise.all([
        prisma.matchRequest.count({ where: { centerId: center.id, status: "PENDING" } }),
        prisma.matchRequest.count({ where: { centerId: center.id, status: "ACCEPTED" } }),
        prisma.message.count({ where: { receiverId: session.user.id, read: false } }),
      ]);
      stats = { pending, accepted, messages: unreadMessages };
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          안녕하세요, {session.user.name}님!
        </h1>
        <p className="text-gray-600 mt-1">
          {isTeacher ? "강사" : "문화센터"} 계정으로 로그인하셨습니다.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 rounded-full p-3">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">대기 중인 매칭</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">수락된 매칭</p>
              <p className="text-2xl font-bold text-gray-900">{stats.accepted}</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">읽지 않은 메시지</p>
              <p className="text-2xl font-bold text-gray-900">{stats.messages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-6">
        {!isTeacher && (
          <Link href="/teachers" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">선생님 찾기</h3>
                <p className="text-sm text-gray-500">원하는 조건의 강사를 검색하세요</p>
              </div>
            </div>
          </Link>
        )}
        <Link href="/matches" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 rounded-full p-3">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">매칭 관리</h3>
              <p className="text-sm text-gray-500">매칭 신청 현황을 확인하세요</p>
            </div>
          </div>
        </Link>
        <Link href="/messages" className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 rounded-full p-3">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">메시지함</h3>
              <p className="text-sm text-gray-500">대화 내역을 확인하세요</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
