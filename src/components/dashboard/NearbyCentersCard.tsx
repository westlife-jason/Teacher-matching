import { prisma } from "@/lib/prisma";
import { geocodeAddress, haversineDistance } from "@/lib/geocoding";
import { MapPin, Train, Bus, Footprints, Building2, Navigation } from "lucide-react";

type TransportMode = "walk" | "bus" | "subway";

interface TransportInfo {
  mode: TransportMode;
  label: string;
  minutesMin: number;
  minutesMax: number;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

function estimateTransport(distanceKm: number): TransportInfo {
  if (distanceKm < 1.0) {
    // 도보: 4km/h → 15분/km
    const min = Math.max(3, Math.round(distanceKm * 13));
    return {
      mode: "walk",
      label: "도보",
      minutesMin: min,
      minutesMax: min + 2,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-200",
    };
  } else if (distanceKm < 5.0) {
    // 버스: 20km/h + 대기 5분
    const min = Math.round(distanceKm * 3 + 5);
    return {
      mode: "bus",
      label: "버스",
      minutesMin: min,
      minutesMax: min + 5,
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
    };
  } else {
    // 지하철: 35km/h + 이동+대기 8분
    const min = Math.round(distanceKm * 1.8 + 8);
    return {
      mode: "subway",
      label: "지하철",
      minutesMin: min,
      minutesMax: min + 5,
      bgColor: "bg-violet-50",
      textColor: "text-violet-700",
      borderColor: "border-violet-200",
    };
  }
}

function TransportIcon({
  mode,
  className,
}: {
  mode: TransportMode;
  className?: string;
}) {
  if (mode === "walk") return <Footprints className={className} />;
  if (mode === "bus") return <Bus className={className} />;
  return <Train className={className} />;
}

function formatDistance(km: number) {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

interface NearbyCenter {
  id: string;
  centerName: string;
  address: string | null;
  distanceKm: number;
  transport: TransportInfo;
}

async function getNearbyCentersForTeacher(
  teacherLocation: string,
  limit = 3
): Promise<{ centers: NearbyCenter[]; location: string } | null> {
  const coords = await geocodeAddress(teacherLocation);
  if (!coords) return null;

  const allCenters = await prisma.cultureCenter.findMany({
    where: { latitude: { not: null }, longitude: { not: null } },
    select: {
      id: true,
      centerName: true,
      address: true,
      latitude: true,
      longitude: true,
    },
  });

  const centers = allCenters
    .map((c) => {
      const distanceKm = haversineDistance(
        coords.lat,
        coords.lon,
        c.latitude!,
        c.longitude!
      );
      return {
        id: c.id,
        centerName: c.centerName,
        address: c.address,
        distanceKm,
        transport: estimateTransport(distanceKm),
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);

  return { centers, location: teacherLocation };
}

const RANK_STYLES = [
  "bg-amber-400 text-white",
  "bg-gray-300 text-gray-700",
  "bg-orange-300 text-white",
];

const BAR_COLORS = ["bg-amber-400", "bg-gray-300", "bg-orange-300"];

export async function NearbyCentersCard({
  teacherUserId,
}: {
  teacherUserId: string;
}) {
  const teacher = await prisma.teacher.findUnique({
    where: { userId: teacherUserId },
    select: { location: true },
  });

  if (!teacher?.location) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 rounded-full p-2">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">주변 문화센터 추천</h2>
        </div>
        <p className="text-sm text-gray-400">
          프로필에 활동 지역을 입력하면 주변 문화센터를 추천해 드립니다.
        </p>
      </div>
    );
  }

  const result = await getNearbyCentersForTeacher(teacher.location);

  if (!result || result.centers.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 rounded-full p-2">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">주변 문화센터 추천</h2>
        </div>
        <p className="text-sm text-gray-400">주변 문화센터 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const { centers, location } = result;
  const maxDist = Math.max(...centers.map((c) => c.distanceKm));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 rounded-full p-2">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">주변 문화센터 추천</h2>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />
              {location} 기준
            </p>
          </div>
        </div>
        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
          TOP 3
        </span>
      </div>

      {/* 센터 목록 */}
      <div className="space-y-4">
        {centers.map((center, idx) => {
          const t = center.transport;
          const barWidth = maxDist > 0 ? (center.distanceKm / maxDist) * 100 : 0;

          return (
            <div
              key={center.id}
              className="relative border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all bg-gray-50/50"
            >
              {/* 순위 + 이름 행 */}
              <div className="flex items-start gap-3">
                {/* 순위 배지 */}
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${RANK_STYLES[idx]}`}
                >
                  {idx + 1}
                </span>

                <div className="flex-1 min-w-0">
                  {/* 센터명 + 거리 */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {center.centerName}
                    </p>
                    <span className="text-sm font-bold text-blue-600 flex-shrink-0">
                      {formatDistance(center.distanceKm)}
                    </span>
                  </div>

                  {/* 주소 */}
                  {center.address && (
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {center.address}
                    </p>
                  )}

                  {/* 거리 바 */}
                  <div className="mt-2 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${BAR_COLORS[idx]}`}
                      style={{ width: `${Math.max(barWidth, 8)}%` }}
                    />
                  </div>

                  {/* 이동수단 + 시간 */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${t.bgColor} ${t.textColor} ${t.borderColor}`}
                    >
                      <TransportIcon mode={t.mode} className="w-3.5 h-3.5" />
                      {t.label}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-gray-400" />
                      약 {t.minutesMin}~{t.minutesMax}분
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 안내 문구 */}
      <p className="text-xs text-gray-400 mt-4 text-center">
        * 이동 시간은 평균 소요 시간 기준 추정치입니다.
      </p>
    </div>
  );
}
