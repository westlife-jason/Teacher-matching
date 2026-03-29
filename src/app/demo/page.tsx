import { prisma } from "@/lib/prisma";
import { MatchingDemo } from "@/components/demo/MatchingDemo";
import { Zap } from "lucide-react";

export default async function DemoPage() {
  const teachers = await prisma.teacher.findMany({
    where: { available: true },
    select: {
      id: true,
      location: true,
      subjects: true,
      experience: true,
      user: { select: { name: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
          <Zap className="w-3.5 h-3.5" />
          관리자 실험 모드 — 로그인 불필요
        </div>
        <h1 className="text-3xl font-bold text-gray-900">문화센터 최적 거리 매칭</h1>
        <p className="text-gray-500 mt-2">
          강사를 선택하면 활동 지역 기준으로 가장 가까운 문화센터 3곳을 거리·이동수단·소요시간과 함께 보여줍니다.
        </p>
      </div>

      <MatchingDemo teachers={teachers} />

      <p className="text-xs text-gray-400 text-center mt-8">
        * 이동 시간은 평균 속도 기준 추정치입니다 (도보 4km/h · 버스 20km/h · 지하철 35km/h)
      </p>
    </div>
  );
}
