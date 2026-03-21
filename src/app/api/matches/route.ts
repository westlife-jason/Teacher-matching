import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createMatchSchema = z.object({
  teacherId: z.string(),
  subject: z.string().optional(),
  message: z.string().optional(),
  schedule: z.string().optional(),
  salary: z.number().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  let matches;

  if (session.user.role === "TEACHER") {
    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id },
    });
    if (!teacher) return NextResponse.json([]);

    matches = await prisma.matchRequest.findMany({
      where: { teacherId: teacher.id },
      include: {
        teacher: { include: { user: { select: { name: true, email: true } } } },
        center: { include: { user: { select: { name: true, email: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  } else {
    const center = await prisma.cultureCenter.findUnique({
      where: { userId: session.user.id },
    });
    if (!center) return NextResponse.json([]);

    matches = await prisma.matchRequest.findMany({
      where: { centerId: center.id },
      include: {
        teacher: { include: { user: { select: { name: true, email: true } } } },
        center: { include: { user: { select: { name: true, email: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return NextResponse.json(matches);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CENTER") {
    return NextResponse.json({ error: "문화센터 계정만 매칭 신청이 가능합니다." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = createMatchSchema.parse(body);

    const center = await prisma.cultureCenter.findUnique({
      where: { userId: session.user.id },
    });
    if (!center) {
      return NextResponse.json({ error: "센터 정보를 찾을 수 없습니다." }, { status: 404 });
    }

    // 이미 pending 상태의 매칭이 있는지 확인
    const existing = await prisma.matchRequest.findFirst({
      where: {
        teacherId: data.teacherId,
        centerId: center.id,
        status: "PENDING",
      },
    });

    if (existing) {
      return NextResponse.json({ error: "이미 신청한 매칭이 있습니다." }, { status: 400 });
    }

    const match = await prisma.matchRequest.create({
      data: {
        teacherId: data.teacherId,
        centerId: center.id,
        subject: data.subject,
        message: data.message,
        schedule: data.schedule,
        salary: data.salary,
      },
    });

    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Match create error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
