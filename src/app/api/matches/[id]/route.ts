import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { status } = await req.json();

  if (!["ACCEPTED", "REJECTED", "CANCELLED"].includes(status)) {
    return NextResponse.json({ error: "올바르지 않은 상태값입니다." }, { status: 400 });
  }

  const match = await prisma.matchRequest.findUnique({
    where: { id: params.id },
    include: {
      teacher: true,
      center: true,
    },
  });

  if (!match) {
    return NextResponse.json({ error: "매칭 요청을 찾을 수 없습니다." }, { status: 404 });
  }

  // 권한 확인: 선생님만 수락/거절, 센터만 취소
  if (session.user.role === "TEACHER") {
    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }
    if (match.teacher.userId !== session.user.id) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }
  } else if (session.user.role === "CENTER") {
    if (status !== "CANCELLED") {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }
    if (match.center.userId !== session.user.id) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }
  }

  const updated = await prisma.matchRequest.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json(updated);
}
