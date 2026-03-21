import Link from "next/link";
import { Search, Users, MessageSquare, CheckCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            선생님과 문화센터를
            <br />
            <span className="text-blue-200">스마트하게 연결합니다</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            검증된 강사를 찾는 문화센터, 좋은 기회를 찾는 선생님.
            지금 바로 매칭을 시작하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/teachers"
              className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              선생님 찾기
            </Link>
            <Link
              href="/auth/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              지금 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            왜 Teacher Matching인가요?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">간편한 검색</h3>
              <p className="text-gray-600">
                과목, 위치, 경력으로 딱 맞는 선생님을 빠르게 찾을 수 있습니다.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">검증된 강사</h3>
              <p className="text-gray-600">
                경력과 전문성이 검증된 강사들과 안심하고 계약하세요.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">직접 소통</h3>
              <p className="text-gray-600">
                플랫폼 내 메시지로 직접 소통하고 조건을 협의하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            이용 방법
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* 문화센터 */}
            <div>
              <h3 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2">
                <span className="bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">센</span>
                문화센터의 경우
              </h3>
              <div className="space-y-4">
                {[
                  "센터 계정으로 가입",
                  "원하는 과목/조건으로 선생님 검색",
                  "마음에 드는 선생님에게 매칭 신청",
                  "선생님 수락 후 메시지로 세부 협의",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* 선생님 */}
            <div>
              <h3 className="text-xl font-bold text-green-700 mb-6 flex items-center gap-2">
                <span className="bg-green-700 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">사</span>
                선생님의 경우
              </h3>
              <div className="space-y-4">
                {[
                  "강사 계정으로 가입",
                  "프로필 및 수업 과목 등록",
                  "문화센터의 매칭 신청 확인",
                  "수락 후 조건 협의 및 계약",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-blue-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-blue-100 mb-8 text-lg">
            무료로 가입하고 최고의 매칭을 경험해보세요.
          </p>
          <Link
            href="/auth/register"
            className="bg-white text-blue-700 px-10 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors inline-block"
          >
            무료 회원가입
          </Link>
        </div>
      </section>
    </div>
  );
}
