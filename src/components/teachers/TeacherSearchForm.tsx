"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

interface TeacherSearchFormProps {
  initialValues?: {
    subject?: string;
    location?: string;
    maxRate?: string;
  };
}

export function TeacherSearchForm({ initialValues = {} }: TeacherSearchFormProps) {
  const router = useRouter();
  const [subject, setSubject] = useState(initialValues.subject || "");
  const [location, setLocation] = useState(initialValues.location || "");
  const [maxRate, setMaxRate] = useState(initialValues.maxRate || "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (subject) params.set("subject", subject);
    if (location) params.set("location", location);
    if (maxRate) params.set("maxRate", maxRate);
    router.push(`/teachers?${params.toString()}`);
  }

  function handleReset() {
    setSubject("");
    setLocation("");
    setMaxRate("");
    router.push("/teachers");
  }

  return (
    <form onSubmit={handleSearch} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">수업 과목</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="예: 요가, 미술"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">활동 지역</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="예: 강남, 마포"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">최대 강사료 (원/시간)</label>
          <input
            type="number"
            value={maxRate}
            onChange={(e) => setMaxRate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="예: 50000"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Search className="w-4 h-4" />
          검색
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          초기화
        </button>
      </div>
    </form>
  );
}
