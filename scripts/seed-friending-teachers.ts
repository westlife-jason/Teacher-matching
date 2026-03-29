/**
 * Friending 강사 프로필 → DB 시드 스크립트
 * 실행: npx ts-node --project tsconfig.scripts.json scripts/seed-friending-teachers.ts
 */
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const TEACHERS = [
  { id: 6,  name: "Mercy Nobleza",           location: "경기도 남양주시",          subjects: ["English Teaching Kids"],                                                             experience: 0  },
  { id: 7,  name: "David Pierre Esposito",    location: "서울 용산구",              subjects: ["Conversation", "Business English"],                                                   experience: 2  },
  { id: 8,  name: "Esther Cho",               location: "경기도 광명시",            subjects: ["Conversation", "Trip English"],                                                       experience: 3  },
  { id: 9,  name: "Hendrik Langeveldt",       location: "부산 해운대구",            subjects: ["Conversation", "Business English", "English for Specific Purposes"],                  experience: 33 },
  { id: 10, name: "Jayson Sernadilla",        location: "전라북도 전주시 완산구",   subjects: ["English Conversation", "General ESL", "Daily life English", "Business English", "IELTS speaking", "TOEIC speaking"], experience: 15 },
  { id: 11, name: "Olivia Gaynor",            location: "서울 영등포구",            subjects: ["Conversation", "Kids"],                                                               experience: 3  },
  { id: 12, name: "RUCHITA M",               location: "경기도 고양시 덕양구",     subjects: ["Business English", "Conversation", "Beginner", "Grammar"],                           experience: 1  },
  { id: 14, name: "Agata Lugowska",           location: "경기도 안산시 단원구",     subjects: ["Business"],                                                                           experience: 7  },
  { id: 15, name: "Jenny Jackson-Smith",      location: "경기도 안양시 동안구",     subjects: ["Conversation", "Phonics"],                                                            experience: 20 },
  { id: 16, name: "Anastasiia Bragina",       location: "경기도 수원시",            subjects: ["Kindergarten", "Elementary school"],                                                  experience: 8  },
  { id: 17, name: "Lily Hajar Hanouche",      location: "경상남도 사천시",          subjects: ["Preschool", "Primary", "Teens", "Adults", "Seniors"],                                experience: 8  },
  { id: 19, name: "Jenny Gwak",               location: "충청북도 충주시",          subjects: ["Conversation", "Phonics", "Shadowing"],                                               experience: 2  },
  { id: 20, name: "EEMAAN MAJIET",            location: "서울 용산구",              subjects: ["Daily Conversation", "Literature", "University", "Business English"],                 experience: 4  },
  { id: 21, name: "Roman Kim",               location: "광주 광산구",              subjects: ["Conversation games", "Reading"],                                                       experience: null },
  { id: 22, name: "Aliya Kamaliyeva",         location: "경기도 용인시 기흥구",     subjects: ["Kids"],                                                                               experience: 2  },
  { id: 23, name: "Nadjibullo Zuxurzoda",     location: "서울 서초구",              subjects: ["Kids", "Teens", "Adults", "Conversational", "SAT"],                                  experience: 5  },
  { id: 24, name: "Aniya Schwoerer",          location: "부산 기장군",              subjects: ["Adult Conversation Class"],                                                           experience: 5  },
  { id: 25, name: "Georgia Angie Neame",      location: "부산 서구",                subjects: ["Kids", "Conversation", "Academic English"],                                           experience: 6  },
  { id: 26, name: "Katrina Mariz Perez",      location: "경기도 시흥시",            subjects: ["Conversation"],                                                                       experience: 4  },
  { id: 27, name: "Valentina Cebotari",       location: "경기도 수원시 장안구",     subjects: ["Conversational", "Teenagers", "Adults", "Elementary school students"],               experience: 2  },
  { id: 28, name: "Mendia (Valeria) Kim",     location: "대전 유성구",              subjects: ["English"],                                                                            experience: 13 },
  { id: 31, name: "Ruby Arteaga",             location: "서울 구로구",              subjects: ["English"],                                                                            experience: 4  },
  { id: 32, name: "Emanuela Camelia Lecu",    location: "서울 동작구",              subjects: ["Conversations", "Kids", "Business English"],                                          experience: 13 },
  { id: 34, name: "Bryan Eller",              location: "경기도 용인시 기흥구",     subjects: ["Conversation", "Business English"],                                                   experience: 13 },
  { id: 35, name: "Carlos Ribeiro",           location: "경기도 파주시",            subjects: ["Conversation", "Kids"],                                                               experience: 15 },
  { id: 37, name: "Justin Howe",              location: "부산 부산진구",            subjects: ["Conversation", "Business English", "Adults", "History", "Creative Writing"],         experience: 15 },
  { id: 38, name: "Joseph Kang",              location: "경기도 용인시 수지구",     subjects: ["English conversation", "Academic English", "Business English"],                       experience: 15 },
  { id: 40, name: "Kate Kim",                 location: "경기도 용인시 수지구",     subjects: ["Conversations for adults"],                                                           experience: 12 },
  { id: 41, name: "Melika Sarmadi",           location: "경기도 평택시",            subjects: ["Conversation", "English"],                                                            experience: 2  },
  { id: 43, name: "Peter Pho",               location: "서울 광진구",              subjects: ["Conversational", "Grammar", "Elementary students", "Adults"],                         experience: 16 },
  { id: 45, name: "Brian Fortune",            location: "서울 성동구",              subjects: ["Conversation", "Business English", "Presentations", "Grammar", "Writing"],           experience: 19 },
  { id: 46, name: "Kelcy Williams",           location: "서울 강서구",              subjects: ["English"],                                                                            experience: 8  },
  { id: 47, name: "Derrick Smith",            location: "경상남도 거제시",          subjects: ["Elementary School Kids"],                                                             experience: 26 },
  { id: 48, name: "Sean Min-kyu Park",        location: "경기도 용인시 기흥구",     subjects: ["Conversation", "Grammar English"],                                                    experience: 11 },
  { id: 49, name: "Subin Lee",               location: "경기도 광명시",            subjects: ["Elementary", "Middle school"],                                                        experience: 5  },
  { id: 50, name: "Mikyoung Cho",             location: "경기도 남양주시",          subjects: ["Conversation", "Grammar"],                                                            experience: 20 },
  { id: 52, name: "Lola Mae Kim",             location: "경기도 군포시",            subjects: ["Conversational", "Business", "General Information"],                                 experience: 2  },
  { id: 53, name: "NOSHIN MUSTAFA MOU",       location: "서울 관악구",              subjects: ["Business English"],                                                                   experience: 3  },
  { id: 56, name: "Sabine Etienne",           location: "경기도 용인시 수지구",     subjects: ["Conversational Speaking", "Test Prep", "Reading", "Listening", "English Language Curriculum"], experience: 8 },
];

async function main() {
  const hashedPassword = await bcrypt.hash("friending2024!", 10);
  let created = 0;
  let skipped = 0;

  for (const t of TEACHERS) {
    const email = `teacher${t.id}@friending.com`;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      skipped++;
      console.log(`SKIP: ${t.name} (${email})`);
      continue;
    }

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: t.name,
        role: Role.TEACHER,
        teacher: {
          create: {
            bio: `${t.name} is an experienced English teacher based in ${t.location}.`,
            subjects: t.subjects,
            location: t.location,
            experience: t.experience ?? null,
            available: true,
          },
        },
      },
    });

    created++;
    console.log(`OK: ${t.name} → ${t.location}`);
  }

  console.log(`\n완료: ${created}명 추가, ${skipped}명 건너뜀`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
