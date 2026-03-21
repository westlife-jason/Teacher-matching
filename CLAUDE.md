# Teacher-matching Project

## 프로젝트 개요
선생님(강사)과 문화센터를 연결하는 매칭 플랫폼 웹사이트.

- **선생님**: 프로필 등록, 수업 과목/경력/위치 정보 제공, 매칭 수락/거절
- **문화센터**: 선생님 검색, 매칭 신청, 계약 관리

## 기술 스택
- **프레임워크**: Next.js 14 (App Router) + TypeScript
- **데이터베이스**: PostgreSQL + Prisma ORM
- **인증**: NextAuth.js (Credentials Provider)
- **스타일링**: Tailwind CSS
- **유효성 검사**: Zod

## 작업 디렉토리
이 프로젝트의 모든 작업은 `/home/user/Teacher-matching` (또는 Windows: `C:\Users\백성현\Teacher-matching`) 디렉토리 내에서 이루어집니다.

## 주요 명령어
```bash
# 개발 서버 실행
npm run dev

# 데이터베이스 마이그레이션
npx prisma migrate dev

# Prisma Studio (DB GUI)
npx prisma studio

# 빌드
npm run build

# 타입 체크
npx tsc --noEmit
```

## 프로젝트 구조
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # NextAuth 설정
│   │   ├── teachers/      # 선생님 CRUD
│   │   ├── matches/       # 매칭 요청 관리
│   │   └── messages/      # 메시지 API
│   ├── auth/              # 로그인/회원가입 페이지
│   ├── teachers/          # 선생님 목록 및 프로필
│   ├── dashboard/         # 대시보드 (선생님/센터별)
│   ├── matches/           # 매칭 관리
│   └── messages/          # 메시지함
├── components/            # 재사용 UI 컴포넌트
├── lib/                   # 유틸리티 (prisma, auth, utils)
└── types/                 # TypeScript 타입 정의
prisma/
└── schema.prisma          # DB 스키마
```

## 사용자 역할
- `TEACHER`: 강사 (프로필 생성, 매칭 수락/거절)
- `CENTER`: 문화센터 (선생님 검색, 매칭 신청)

## 환경 변수 (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/teacher_matching"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## 개발 원칙
- TypeScript strict 모드 사용
- Zod로 입력값 검증
- Prisma로 타입 안전한 DB 쿼리
- Server Components 우선, 필요 시 Client Components 사용
