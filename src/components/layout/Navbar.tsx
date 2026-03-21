"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-700">
            <GraduationCap className="w-7 h-7" />
            <span>Teacher Matching</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/teachers" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              선생님 찾기
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  대시보드
                </Link>
                <Link href="/matches" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  매칭
                </Link>
                <Link href="/messages" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  메시지
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{session.user.name}</span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-gray-500 hover:text-red-500 text-sm font-medium transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="메뉴 토글"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-3">
            <Link href="/teachers" className="block text-gray-600 hover:text-blue-600 py-2" onClick={() => setIsOpen(false)}>
              선생님 찾기
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="block text-gray-600 hover:text-blue-600 py-2" onClick={() => setIsOpen(false)}>대시보드</Link>
                <Link href="/matches" className="block text-gray-600 hover:text-blue-600 py-2" onClick={() => setIsOpen(false)}>매칭</Link>
                <Link href="/messages" className="block text-gray-600 hover:text-blue-600 py-2" onClick={() => setIsOpen(false)}>메시지</Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="block text-red-500 py-2 w-full text-left">로그아웃</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block text-gray-600 hover:text-blue-600 py-2" onClick={() => setIsOpen(false)}>로그인</Link>
                <Link href="/auth/register" className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-center" onClick={() => setIsOpen(false)}>회원가입</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
