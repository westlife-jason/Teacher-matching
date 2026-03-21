"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Building2, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"role" | "info">("role");
  const [role, setRole] = useState<"TEACHER" | "CENTER" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    // Teacher fields
    subjects: "",
    location: "",
    hourlyRate: "",
    experience: "",
    bio: "",
    // Center fields
    centerName: "",
    address: "",
    description: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "회원가입에 실패했습니다.");
      setLoading(false);
    } else {
      router.push("/auth/login?registered=true");
    }
  }

  if (step === "role") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-lg w-full space-y-8">
          <div className="text-center">
            <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">회원가입</h2>
            <p className="mt-2 text-gray-600">어떤 역할로 가입하시겠어요?</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => { setRole("TEACHER"); setStep("info"); }}
              className="bg-white border-2 border-gray-200 hover:border-blue-500 rounded-xl p-8 text-center transition-all group"
            >
              <User className="w-12 h-12 text-gray-400 group-hover:text-blue-500 mx-auto mb-4 transition-colors" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">선생님</h3>
              <p className="text-sm text-gray-500">강사로 활동하고 싶으신가요?</p>
            </button>

            <button
              onClick={() => { setRole("CENTER"); setStep("info"); }}
              className="bg-white border-2 border-gray-200 hover:border-green-500 rounded-xl p-8 text-center transition-all group"
            >
              <Building2 className="w-12 h-12 text-gray-400 group-hover:text-green-500 mx-auto mb-4 transition-colors" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">문화센터</h3>
              <p className="text-sm text-gray-500">강사를 채용하고 싶으신가요?</p>
            </button>
          </div>

          <p className="text-center text-gray-600">
            이미 계정이 있으신가요?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">로그인</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          {role === "TEACHER" ? (
            <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          ) : (
            <Building2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
          )}
          <h2 className="text-3xl font-bold text-gray-900">
            {role === "TEACHER" ? "강사 회원가입" : "문화센터 회원가입"}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                <input name="name" type="text" required value={formData.name} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="홍길동" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input name="email" type="email" required value={formData.email} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="example@email.com" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                <input name="password" type="password" required value={formData.password} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="8자 이상" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
                <input name="passwordConfirm" type="password" required value={formData.passwordConfirm} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="비밀번호 재입력" />
              </div>
            </div>

            {role === "TEACHER" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">수업 과목 (쉼표로 구분)</label>
                  <input name="subjects" type="text" value={formData.subjects} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 요가, 필라테스, 수영" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">활동 지역</label>
                    <input name="location" type="text" value={formData.location} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="서울 강남구" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">시간당 강사료(원)</label>
                    <input name="hourlyRate" type="number" value={formData.hourlyRate} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="50000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">경력(년)</label>
                    <input name="experience" type="number" value={formData.experience} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">자기소개</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="강사 소개를 입력해주세요" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">센터명</label>
                  <input name="centerName" type="text" required value={formData.centerName} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="강남 문화센터" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                  <input name="address" type="text" value={formData.address} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="서울 강남구 테헤란로 123" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">센터 소개</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="센터에 대해 소개해주세요" />
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep("role")}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                이전
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50">
                {loading ? "가입 중..." : "가입하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
