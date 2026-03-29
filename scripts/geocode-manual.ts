/**
 * Nominatim 실패 10개 — 수동 좌표 삽입
 * 실행: npx tsx scripts/geocode-manual.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const manualCoords: Record<string, { lat: number; lon: number }> = {
  "롯데백화점 분당점":     { lat: 37.3861, lon: 127.1228 },
  "롯데백화점 수원점":     { lat: 37.2666, lon: 127.0044 },
  "롯데백화점 안산점":     { lat: 37.3205, lon: 126.8312 },
  "롯데몰 수원 타임빌라스": { lat: 37.2666, lon: 127.0044 },
  "롯데마트 고양점":       { lat: 37.6292, lon: 126.8500 },
  "이마트 김포한강점":     { lat: 37.6397, lon: 126.7102 },
  "이마트 봉담점":         { lat: 37.2130, lon: 126.9747 },
  "이마트 운정점":         { lat: 37.6936, lon: 126.8017 },
  "이마트 진접점":         { lat: 37.7249, lon: 127.2014 },
  "이마트 부천점":         { lat: 37.4677, lon: 126.8082 },
};

async function main() {
  for (const [centerName, coords] of Object.entries(manualCoords)) {
    const result = await prisma.cultureCenter.updateMany({
      where: { centerName, latitude: null },
      data: { latitude: coords.lat, longitude: coords.lon },
    });
    console.log(`${centerName}: ${result.count > 0 ? "✓" : "이미 처리됨"}`);
  }

  const total = await prisma.cultureCenter.count();
  const withCoords = await prisma.cultureCenter.count({ where: { latitude: { not: null } } });
  console.log(`\n최종: ${withCoords}/${total}개 좌표 완료`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
