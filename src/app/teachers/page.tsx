import { prisma } from "@/lib/prisma";
import { TeacherCard } from "@/components/teachers/TeacherCard";
import { TeacherSearchForm } from "@/components/teachers/TeacherSearchForm";

interface SearchParams {
  subject?: string;
  location?: string;
  maxRate?: string;
}

export default async function TeachersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const teachers = await prisma.teacher.findMany({
    where: {
      available: true,
      ...(searchParams.subject && {
        subjects: { has: searchParams.subject },
      }),
      ...(searchParams.location && {
        location: { contains: searchParams.location, mode: "insensitive" },
      }),
      ...(searchParams.maxRate && {
        hourlyRate: { lte: parseInt(searchParams.maxRate) },
      }),
    },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">선생님 찾기</h1>
        <p className="text-gray-600">원하는 과목, 지역, 강사료로 선생님을 검색하세요.</p>
      </div>

      <TeacherSearchForm initialValues={searchParams} />

      <div className="mt-8">
        {teachers.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">검색 조건에 맞는 선생님이 없습니다.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{teachers.length}명의 선생님</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher) => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
