/**
 * Nominatim(OpenStreetMap)으로 문화센터 주소 → 위도/경도 변환
 * 실행: npx tsx scripts/geocode-centers.ts
 *
 * - 초당 1건 제한 준수 (Nominatim 정책)
 * - 실패한 항목은 건너뛰고 마지막에 요약 출력
 * - 이미 좌표가 있는 항목은 스킵 (재실행 안전)
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function geocode(address: string): Promise<{ lat: number; lon: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=kr`;
  const res = await fetch(url, {
    headers: { "User-Agent": "teacher-matching-app/1.0" },
  });
  if (!res.ok) return null;
  const data = await res.json() as Array<{ lat: string; lon: string }>;
  if (!data.length) return null;
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const centers = await prisma.cultureCenter.findMany({
    where: { latitude: null, address: { not: null } },
    select: { id: true, centerName: true, address: true },
  });

  console.log(`좌표 미설정 센터: ${centers.length}개\n`);

  let success = 0;
  let fail = 0;
  const failed: string[] = [];

  for (let i = 0; i < centers.length; i++) {
    const c = centers[i];
    process.stdout.write(`[${i + 1}/${centers.length}] ${c.centerName} ... `);

    const result = await geocode(c.address!);
    if (result) {
      await prisma.cultureCenter.update({
        where: { id: c.id },
        data: { latitude: result.lat, longitude: result.lon },
      });
      console.log(`✓ (${result.lat.toFixed(4)}, ${result.lon.toFixed(4)})`);
      success++;
    } else {
      console.log(`✗ 실패`);
      failed.push(`${c.centerName} (${c.address})`);
      fail++;
    }

    // Nominatim 정책: 초당 1건
    await sleep(1100);
  }

  console.log(`\n완료: 성공 ${success}개, 실패 ${fail}개`);
  if (failed.length) {
    console.log("\n실패 목록:");
    failed.forEach((f) => console.log(`  - ${f}`));
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
