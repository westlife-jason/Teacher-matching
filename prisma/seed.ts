import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  // 테스트용 선생님 계정
  const teacher1 = await prisma.user.upsert({
    where: { email: "teacher1@example.com" },
    update: {},
    create: {
      email: "teacher1@example.com",
      password: hashedPassword,
      name: "김요가",
      role: Role.TEACHER,
      teacher: {
        create: {
          bio: "10년 경력의 요가 & 필라테스 강사입니다.",
          subjects: ["요가", "필라테스"],
          location: "서울 강남구",
          hourlyRate: 50000,
          experience: 10,
          available: true,
        },
      },
    },
  });

  const teacher2 = await prisma.user.upsert({
    where: { email: "teacher2@example.com" },
    update: {},
    create: {
      email: "teacher2@example.com",
      password: hashedPassword,
      name: "이미술",
      role: Role.TEACHER,
      teacher: {
        create: {
          bio: "성인 미술 및 수채화 전문 강사입니다.",
          subjects: ["미술", "수채화", "드로잉"],
          location: "서울 마포구",
          hourlyRate: 40000,
          experience: 5,
          available: true,
        },
      },
    },
  });

  // 테스트용 문화센터 계정
  const center1 = await prisma.user.upsert({
    where: { email: "center1@example.com" },
    update: {},
    create: {
      email: "center1@example.com",
      password: hashedPassword,
      name: "관리자",
      role: Role.CENTER,
      center: {
        create: {
          centerName: "강남 문화센터",
          address: "서울 강남구 테헤란로 123",
          description: "강남 지역 최고의 문화센터",
          phone: "02-1234-5678",
        },
      },
    },
  });

  console.log("Seed data created:", { teacher1, teacher2, center1 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
