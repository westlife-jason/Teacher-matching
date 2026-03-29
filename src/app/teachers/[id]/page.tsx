import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import { geocodeAddress, haversineDistance } from "@/lib/geocoding";
import { MapPin, Clock, DollarSign, User, Building2 } from "lucide-react";
import { MatchRequestButton } from "@/components/matches/MatchRequestButton";

async function getNearbyCenters(location: string, limit = 5) {
  const teacherCoords = await geocodeAddress(location);
  if (!teacherCoords) return null;

  const centers = await prisma.cultureCenter.findMany({
    where: { latitude: { not: null }, longitude: { not: null } },
    select: {
      id: true,
      centerName: true,
      address: true,
      latitude: true,
      longitude: true,
    },
  });

  return centers
    .map((c) => ({
      ...c,
      distanceKm: haversineDistance(
        teacherCoords.lat, teacherCoords.lon,
        c.latitude!, c.longitude!
      ),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

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
  const nearbyCenters = teacher.location
    ? await getNearbyCenters(teacher.location)
    : null;

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

          {/* 주변 문화센터 추천 */}
          {nearbyCenters && nearbyCenters.length > 0 && (
            <div className="border-t pt-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                활동 지역 주변 문화센터
                <span className="text-sm font-normal text-gray-400">({teacher.location} 기준)</span>
              </h2>
              <div className="grid gap-3">
                {nearbyCenters.map((center, idx) => (
                  <div
                    key={center.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{center.centerName}</p>
                        {center.address && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {center.address}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 flex-shrink-0 ml-4">
                      {center.distanceKm < 1
                        ? `${Math.round(center.distanceKm * 1000)}m`
                        : `${center.distanceKm.toFixed(1)}km`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {nearbyCenters === null && teacher.location && (
            <div className="border-t pt-6 mb-6">
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                위치 정보를 이용할 수 없어 주변 센터를 표시할 수 없습니다.
              </p>
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
