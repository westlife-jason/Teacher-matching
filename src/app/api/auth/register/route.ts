import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("올바른 이메일을 입력하세요"),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
  name: z.string().min(1, "이름을 입력하세요"),
  role: z.enum(["TEACHER", "CENTER"]),
  // Teacher fields
  subjects: z.string().optional(),
  location: z.string().optional(),
  hourlyRate: z.string().optional(),
  experience: z.string().optional(),
  bio: z.string().optional(),
  // Center fields
  centerName: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ error: "이미 사용 중인 이메일입니다." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role,
        ...(data.role === "TEACHER" && {
          teacher: {
            create: {
              subjects: data.subjects
                ? data.subjects.split(",").map((s) => s.trim()).filter(Boolean)
                : [],
              location: data.location || null,
              hourlyRate: data.hourlyRate ? parseInt(data.hourlyRate) : null,
              experience: data.experience ? parseInt(data.experience) : null,
              bio: data.bio || null,
            },
          },
        }),
        ...(data.role === "CENTER" && {
          center: {
            create: {
              centerName: data.centerName || data.name,
              address: data.address || null,
              description: data.description || null,
            },
          },
        }),
      },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Register error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
