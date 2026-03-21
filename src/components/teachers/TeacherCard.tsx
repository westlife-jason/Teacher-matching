import Link from "next/link";
import { MapPin, Clock, User } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface TeacherCardProps {
  teacher: {
    id: string;
    subjects: string[];
    location: string | null;
    hourlyRate: number | null;
    experience: number | null;
    available: boolean;
    user: { name: string; image: string | null };
  };
}

export function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    <Link href={`/teachers/${teacher.id}`} className="block">
      <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-blue-300 transition-all">
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{teacher.user.name}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {teacher.subjects.slice(0, 3).map((subject) => (
                <span
                  key={subject}
                  className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium"
                >
                  {subject}
                </span>
              ))}
              {teacher.subjects.length > 3 && (
                <span className="text-gray-400 text-xs">+{teacher.subjects.length - 3}</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          {teacher.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{teacher.location}</span>
            </div>
          )}
          {teacher.experience !== null && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>경력 {teacher.experience}년</span>
            </div>
          )}
          {teacher.hourlyRate !== null && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-blue-600">
                {formatCurrency(teacher.hourlyRate)} / 시간
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            teacher.available
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}>
            {teacher.available ? "매칭 가능" : "매칭 불가"}
          </span>
          <span className="text-blue-600 text-sm font-medium">프로필 보기 →</span>
        </div>
      </div>
    </Link>
  );
}
