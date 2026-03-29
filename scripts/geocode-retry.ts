/**
 * 실패한 18개 항목 수정된 주소로 재시도
 * 실행: npx tsx scripts/geocode-retry.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 센터명 → 수정된 주소
const fixedAddresses: Record<string, string> = {
  "현대백화점 가든파이브점": "서울 송파구 충민로 66",
  "아이파크몰 용산점": "서울 용산구 한강대로23길 55",
  "AK백화점 분당점": "경기 성남시 분당구 황새울로360번길 42",
  "롯데백화점 미아점": "서울 강북구 도봉로 62",
  "롯데백화점 부천 중동점": "경기 부천시 길주로 300",
  "롯데백화점 분당점": "경기 성남시 분당구 황새울로200번길 45",
  "롯데백화점 수원점": "경기 수원시 권선구 세화로 134",
  "롯데백화점 안산점": "경기 안산시 단원구 고잔1길 12",
  "롯데백화점 인천점": "인천 미추홀구 연남로 35",
  "롯데몰 수원 타임빌라스": "경기 수원시 권선구 세화로 134",
  "롯데마트 고양점": "경기 고양시 덕양구 충장로 150",
  "롯데마트 광교점": "경기 수원시 영통구 광교중앙로 248",
  "롯데마트 동두천": "경기 동두천시 평화로 2169",
  "이마트 김포한강점": "경기 김포시 김포한강7로 71",
  "이마트 봉담점": "경기 화성시 봉담읍 효행로 278",
  "이마트 운정점": "경기 파주시 한울로 123",
  "이마트 진접점": "경기 남양주시 진접읍 진접로",
  "이마트 부천점": "경기 부천시 소사구 부천로 1",
};

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
    where: { latitude: null },
    select: { id: true, centerName: true, address: true },
  });

  console.log(`재시도 대상: ${centers.length}개\n`);

  let success = 0;
  let fail = 0;
  const stillFailed: string[] = [];

  for (const c of centers) {
    const fixedAddress = fixedAddresses[c.centerName] ?? c.address!;
    process.stdout.write(`${c.centerName}\n  주소: ${fixedAddress} ... `);

    const result = await geocode(fixedAddress);
    if (result) {
      await prisma.cultureCenter.update({
        where: { id: c.id },
        data: { latitude: result.lat, longitude: result.lon },
      });
      console.log(`✓ (${result.lat.toFixed(4)}, ${result.lon.toFixed(4)})`);
      success++;
    } else {
      console.log(`✗ 실패`);
      stillFailed.push(c.centerName);
      fail++;
    }
    await sleep(1100);
  }

  console.log(`\n재시도 결과: 성공 ${success}개, 실패 ${fail}개`);
  if (stillFailed.length) {
    console.log("여전히 실패:", stillFailed.join(", "));
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
