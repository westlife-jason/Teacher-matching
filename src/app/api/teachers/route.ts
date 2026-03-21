import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject");
  const location = searchParams.get("location");
  const maxRate = searchParams.get("maxRate");

  const teachers = await prisma.teacher.findMany({
    where: {
      available: true,
      ...(subject && { subjects: { has: subject } }),
      ...(location && { location: { contains: location, mode: "insensitive" } }),
      ...(maxRate && { hourlyRate: { lte: parseInt(maxRate) } }),
    },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(teachers);
}
