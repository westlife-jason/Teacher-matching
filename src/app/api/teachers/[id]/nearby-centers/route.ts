import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { geocodeAddress, haversineDistance } from "@/lib/geocoding";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "5");

  const teacher = await prisma.teacher.findUnique({
    where: { id: params.id },
    select: { location: true },
  });

  if (!teacher?.location) {
    return NextResponse.json(
      { error: "강사 위치 정보가 없습니다." },
      { status: 400 }
    );
  }

  // 강사 위치 지오코딩
  const teacherCoords = await geocodeAddress(teacher.location);
  if (!teacherCoords) {
    return NextResponse.json(
      { error: "강사 위치를 지도에서 찾을 수 없습니다." },
      { status: 400 }
    );
  }

  // 좌표가 있는 문화센터 전체 조회
  const centers = await prisma.cultureCenter.findMany({
    where: { latitude: { not: null }, longitude: { not: null } },
    select: {
      id: true,
      centerName: true,
      address: true,
      latitude: true,
      longitude: true,
      user: { select: { id: true } },
    },
  });

  // 거리 계산 후 정렬
  const withDistance = centers
    .map((c) => ({
      id: c.id,
      userId: c.user.id,
      centerName: c.centerName,
      address: c.address,
      distanceKm: haversineDistance(
        teacherCoords.lat, teacherCoords.lon,
        c.latitude!, c.longitude!
      ),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);

  return NextResponse.json({
    teacherLocation: teacher.location,
    centers: withDistance,
  });
}
