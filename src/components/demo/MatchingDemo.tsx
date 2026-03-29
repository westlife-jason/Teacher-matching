"use client";

import { useState } from "react";
import {
  MapPin, Building2, Footprints, Bus, Train,
  Navigation, ChevronRight, Loader2, Users
} from "lucide-react";

type TransportMode = "walk" | "bus" | "subway";

interface TransportOption {
  mode: TransportMode;
  label: string;
  minutesMin: number;
  minutesMax: number;
  bg: string;
  text: string;
  border: string;
}

interface Teacher {
  id: string;
  location: string | null;
  subjects: string[];
  experience: number | null;
  user: { name: string };
}

interface NearbyCenter {
  id: string;
  centerName: string;
  address: string | null;
  distanceKm: number;
}

interface ApiResponse {
  teacherLocation: string;
  centers: NearbyCenter[];
}

function getTransportOptions(distanceKm: number): TransportOption[] {
  const walkMin   = Math.max(3, Math.round(distanceKm * 13));
  const busMin    = Math.round(distanceKm * 3 + 5);
  const subwayMin = Math.round(distanceKm * 1.8 + 8);

  const walk:   TransportOption = { mode: "walk",   label: "도보",   minutesMin: walkMin,   minutesMax: walkMin + 2,   bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" };
  const bus:    TransportOption = { mode: "bus",    label: "버스",   minutesMin: busMin,    minutesMax: busMin + 5,    bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200"    };
  const subway: TransportOption = { mode: "subway", label: "지하철", minutesMin: subwayMin, minutesMax: subwayMin + 5, bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200"  };

  if (distanceKm < 1.0) return [walk, bus, subway]; // 3가지 모두
  if (distanceKm < 5.0) return [bus, subway];        // 버스 + 지하철
  return [subway];                                    // 지하철만
}

function TransportIcon({ mode, className }: { mode: TransportMode; className?: string }) {
  if (mode === "walk") return <Footprints className={className} />;
  if (mode === "bus")  return <Bus className={className} />;
  return <Train className={className} />;
}

function formatDist(km: number) {
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;
}

const RANK_BADGE = ["bg-amber-400 text-white", "bg-gray-300 text-gray-700", "bg-orange-300 text-white"];
const BAR_COLOR  = ["bg-amber-400", "bg-gray-300", "bg-orange-300"];

export function MatchingDemo({ teachers }: { teachers: Teacher[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(teacher: Teacher) {
    if (!teacher.location) {
      setSelectedId(teacher.id);
      setResult(null);
      setError("이 강사는 활동 지역 정보가 없습니다.");
      return;
    }
    setSelectedId(teacher.id);
    setResult(null);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/teachers/${teacher.id}/nearby-centers?limit=3`);
      if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
      const data: ApiResponse = await res.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  const selected = teachers.find((t) => t.id === selectedId);
  const maxDist = result ? Math.max(...result.centers.map((c) => c.distanceKm)) : 0;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* 왼쪽: 강사 목록 */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-blue-100 rounded-full p-1.5"><Users className="w-4 h-4 text-blue-600" /></div>
          <h2 className="font-bold text-gray-900">강사 선택</h2>
          <span className="text-xs text-gray-400 ml-auto">클릭하면 매칭 결과가 표시됩니다</span>
        </div>
        <div className="space-y-2">
          {teachers.map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelect(t)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${
                selectedId === t.id
                  ? "border-blue-400 bg-blue-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-blue-200 hover:bg-gray-50"
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {t.user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{t.user.name}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {t.location && (
                    <span className="text-xs text-gray-500 flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" />{t.location}
                    </span>
                  )}
                  {t.subjects.slice(0, 2).map((s) => (
                    <span key={s} className="text-xs bg-gray-100 text-gray-600 rounded px-1.5 py-0.5">{s}</span>
                  ))}
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-colors ${selectedId === t.id ? "text-blue-500" : "text-gray-300"}`} />
            </button>
          ))}
        </div>
      </div>

      {/* 오른쪽: 매칭 결과 */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-indigo-100 rounded-full p-1.5"><Building2 className="w-4 h-4 text-indigo-600" /></div>
          <h2 className="font-bold text-gray-900">최적 매칭 문화센터</h2>
          {result && (
            <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 ml-auto">
              {result.teacherLocation} 기준
            </span>
          )}
        </div>

        {!selectedId && (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
            <Building2 className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">강사를 선택하면</p>
            <p className="text-sm">주변 문화센터가 표시됩니다</p>
          </div>
        )}

        {loading && (
          <div className="h-64 flex flex-col items-center justify-center border border-gray-200 rounded-xl">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
            <p className="text-sm text-gray-500">{selected?.location} 주변 검색 중...</p>
          </div>
        )}

        {error && !loading && (
          <div className="h-32 flex items-center justify-center border border-red-200 bg-red-50 rounded-xl">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {result && !loading && (
          <div className="space-y-3">
            {result.centers.map((center, idx) => {
              const transports = getTransportOptions(center.distanceKm);
              const barPct = maxDist > 0 ? (center.distanceKm / maxDist) * 100 : 0;
              return (
                <div key={center.id} className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${RANK_BADGE[idx]}`}>
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-gray-900 text-sm truncate">{center.centerName}</p>
                        <span className="text-sm font-bold text-blue-600 flex-shrink-0">{formatDist(center.distanceKm)}</span>
                      </div>
                      {center.address && (
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 flex-shrink-0" />{center.address}
                        </p>
                      )}
                      {/* 거리 바 */}
                      <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className={`h-full rounded-full ${BAR_COLOR[idx]}`} style={{ width: `${Math.max(barPct, 6)}%` }} />
                      </div>
                      {/* 이동수단 목록 */}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {transports.map((t) => (
                          <div key={t.mode} className="flex items-center gap-1.5">
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${t.bg} ${t.text} ${t.border}`}>
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

            {/* 범례 */}
            <div className="flex gap-3 pt-1 justify-center flex-wrap">
              {[
                { mode: "walk"   as TransportMode, label: "도보 (<1km)",   bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
                { mode: "bus"    as TransportMode, label: "버스 (<5km)",   bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200"    },
                { mode: "subway" as TransportMode, label: "지하철",         bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200"  },
              ].map((item) => (
                <span key={item.mode} className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${item.bg} ${item.text} ${item.border}`}>
                  <TransportIcon mode={item.mode} className="w-3 h-3" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
