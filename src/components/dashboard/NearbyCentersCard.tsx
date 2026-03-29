import { prisma } from "@/lib/prisma";
import { geocodeAddress, haversineDistance } from "@/lib/geocoding";
import { MapPin, Train, Bus, Footprints, Building2, Navigation } from "lucide-react";

type TransportMode = "walk" | "bus" | "subway";

interface TransportOption {
  mode: TransportMode;
  label: string;
  minutesMin: number;
  minutesMax: number;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

const WALK_STYLE  = { bgColor: "bg-emerald-50", textColor: "text-emerald-700", borderColor: "border-emerald-200" };
const BUS_STYLE   = { bgColor: "bg-blue-50",    textColor: "text-blue-700",    borderColor: "border-blue-200"    };
const SUBWAY_STYLE = { bgColor: "bg-violet-50", textColor: "text-violet-700",  borderColor: "border-violet-200"  };

function getTransportOptions(distanceKm: number): TransportOption[] {
  const walkMin   = Math.max(3, Math.round(distanceKm * 13));
  const busMin    = Math.round(distanceKm * 3 + 5);
  const subwayMin = Math.round(distanceKm * 1.8 + 8);

  const walk:   TransportOption = { mode: "walk",   label: "도보",   minutesMin: walkMin,   minutesMax: walkMin + 2,   ...WALK_STYLE };
  const bus:    TransportOption = { mode: "bus",    label: "버스",   minutesMin: busMin,    minutesMax: busMin + 5,    ...BUS_STYLE };
  const subway: TransportOption = { mode: "subway", label: "지하철", minutesMin: subwayMin, minutesMax: subwayMin + 5, ...SUBWAY_STYLE };

  if (distanceKm < 1.0)  return [walk, bus, subway]; // 3가지 모두
  if (distanceKm < 5.0)  return [bus, subway];        // 버스 + 지하철
  return [subway];                                     // 지하철만
}

function TransportIcon({ mode, className }: { mode: TransportMode; className?: string }) {
  if (mode === "walk")   return <Footprints className={className} />;
  if (mode === "bus")    return <Bus className={className} />;
  return <Train className={className} />;
}

function formatDistance(km: number) {
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;
}

interface NearbyCenter {
  id: string;
  centerName: string;
  address: string | null;
  distanceKm: number;
  transports: TransportOption[];
}

async function getNearbyCentersForTeacher(
  teacherLocation: string,
  limit = 3
): Promise<{ centers: NearbyCenter[]; location: string } | null> {
  const coords = await geocodeAddress(teacherLocation);
  if (!coords) return null;

  const allCenters = await prisma.cultureCenter.findMany({
    where: { latitude: { not: null }, longitude: { not: null } },
    select: { id: true, centerName: true, address: true, latitude: true, longitude: true },
  });

  const centers = allCenters
    .map((c) => {
      const distanceKm = haversineDistance(coords.lat, coords.lon, c.latitude!, c.longitude!);
      return { id: c.id, centerName: c.centerName, address: c.address, distanceKm, transports: getTransportOptions(distanceKm) };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);

  return { centers, location: teacherLocation };
}

const RANK_STYLES = ["bg-amber-400 text-white", "bg-gray-300 text-gray-700", "bg-orange-300 text-white"];
const BAR_COLORS  = ["bg-amber-400", "bg-gray-300", "bg-orange-300"];

export async function NearbyCentersCard({ teacherUserId }: { teacherUserId: string }) {
  const teacher = await prisma.teacher.findUnique({
    where: { userId: teacherUserId },
    select: { location: true },
  });

  if (!teacher?.location) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 rounded-full p-2"><Building2 className="w-5 h-5 text-blue-600" /></div>
          <h2 className="text-lg font-bold text-gray-900">주변 문화센터 추천</h2>
        </div>
        <p className="text-sm text-gray-400">프로필에 활동 지역을 입력하면 주변 문화센터를 추천해 드립니다.</p>
      </div>
    );
  }

  const result = await getNearbyCentersForTeacher(teacher.location);

  if (!result || result.centers.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 rounded-full p-2"><Building2 className="w-5 h-5 text-blue-600" /></div>
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
          <div className="bg-blue-100 rounded-full p-2"><Building2 className="w-5 h-5 text-blue-600" /></div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">주변 문화센터 추천</h2>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />{location} 기준
            </p>
          </div>
        </div>
        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">TOP 3</span>
      </div>

      {/* 센터 목록 */}
      <div className="space-y-4">
        {centers.map((center, idx) => {
          const barWidth = maxDist > 0 ? (center.distanceKm / maxDist) * 100 : 0;
          return (
            <div key={center.id} className="relative border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all bg-gray-50/50">
              <div className="flex items-start gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${RANK_STYLES[idx]}`}>
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  {/* 센터명 + 거리 */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 text-sm truncate">{center.centerName}</p>
                    <span className="text-sm font-bold text-blue-600 flex-shrink-0">{formatDistance(center.distanceKm)}</span>
                  </div>
                  {/* 주소 */}
                  {center.address && (
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 flex-shrink-0" />{center.address}
                    </p>
                  )}
                  {/* 거리 바 */}
                  <div className="mt-2 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${BAR_COLORS[idx]}`} style={{ width: `${Math.max(barWidth, 8)}%` }} />
                  </div>
                  {/* 이동수단 목록 */}
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {center.transports.map((t) => (
                      <div key={t.mode} className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${t.bgColor} ${t.textColor} ${t.borderColor}`}>
                          <TransportIcon mode={t.mode} className="w-3.5 h-3.5" />
                          {t.label}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-0.5">
                          <Navigation className="w-3 h-3 text-gray-400" />
                          {t.minutesMin}~{t.minutesMax}분
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">* 이동 시간은 평균 소요 시간 기준 추정치입니다.</p>
    </div>
  );
}
