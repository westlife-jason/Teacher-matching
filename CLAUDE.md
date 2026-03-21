# Teacher-matching — Claude Code 프로젝트

## 프로젝트 개요
강사(Teacher)와 문화센터(CultureCenter)를 연결하는 매칭 플랫폼.
- **강사**: 프로필 등록, 과목/경력/위치 정보 제공, 매칭 수락·거절
- **문화센터**: 강사 검색, 매칭 신청, 메시지 발송

## 작업 디렉토리
```
로컬  : C:\Users\백성현\Teacher-matching
서버  : /home/user/Teacher-matching
```
> 변경 후 항상 `git push` → 로컬에서 `git pull` 로 동기화

## 기술 스택
| 영역 | 기술 |
|---|---|
| 프레임워크 | Next.js 14 (App Router) + TypeScript |
| 데이터베이스 | PostgreSQL + Prisma ORM |
| 인증 | NextAuth.js v4 (Credentials Provider) |
| 스타일 | Tailwind CSS + tailwind-merge + clsx |
| 유효성 검사 | Zod |
| 아이콘 | lucide-react |

## 주요 명령어
```bash
npm run dev          # 개발 서버 (localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint
npx tsc --noEmit     # 타입 체크

npm run db:generate  # Prisma Client 재생성
npm run db:migrate   # 마이그레이션 실행
npm run db:push      # 스키마 → DB 직접 반영 (dev용)
npm run db:studio    # Prisma Studio (DB GUI)
npm run db:seed      # 시드 데이터 삽입
```

## 프로젝트 구조
```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   # NextAuth 핸들러
│   │   ├── auth/register/route.ts        # 회원가입 POST
│   │   ├── teachers/route.ts             # 강사 목록 GET / 프로필 POST
│   │   ├── matches/route.ts              # 매칭 신청 GET/POST
│   │   ├── matches/[id]/route.ts         # 매칭 상태 변경 PATCH/DELETE
│   │   └── messages/route.ts             # 메시지 GET/POST
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/page.tsx
│   ├── teachers/
│   │   ├── page.tsx                      # 강사 목록 + 검색
│   │   └── [id]/page.tsx                 # 강사 상세
│   ├── matches/page.tsx
│   ├── messages/page.tsx
│   ├── layout.tsx
│   ├── page.tsx                          # 홈
│   ├── globals.css
│   └── providers.tsx                     # SessionProvider
├── components/
│   ├── layout/Navbar.tsx
│   ├── teachers/
│   │   ├── TeacherCard.tsx
│   │   └── TeacherSearchForm.tsx
│   ├── matches/
│   │   ├── MatchActions.tsx
│   │   ├── MatchRequestButton.tsx
│   │   └── MatchStatusBadge.tsx
│   └── messages/
│       └── MessageList.tsx
├── lib/
│   ├── auth.ts                           # NextAuth 설정
│   ├── prisma.ts                         # Prisma 싱글톤
│   └── utils.ts
└── types/
    └── index.ts

prisma/
├── schema.prisma
└── seed.ts
```

## DB 스키마 요약
```
User          id, email, password, name, role(TEACHER|CENTER), image
  └─ Teacher  id, userId, bio, subjects[], location, hourlyRate, experience, available, phone
  └─ CultureCenter  id, userId, centerName, address, description, phone, website

MatchRequest  id, teacherId, centerId, status(PENDING|ACCEPTED|REJECTED|CANCELLED),
              subject, message, schedule, salary

Message       id, senderId, receiverId, content, read
```

## 환경 변수 (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/teacher_matching"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```
> `.env` 는 `.gitignore` 에 포함 — `.env.example` 참고

## 코딩 원칙
- TypeScript strict 모드
- Zod로 API 입력값 검증
- Prisma로 타입 안전한 DB 쿼리
- Server Components 우선, 인터랙션 필요 시 `"use client"`
- API route: 인증 필요 시 `getServerSession(authOptions)` 으로 세션 확인

## 보조 도구
### parse_teacher.py (강사 HTML 파서)
Friending 강사 모달 HTML → 구조화된 텍스트/JSON/CSV 변환 도구.
```bash
python parse_teacher.py 파일명.txt          # 단일 파싱
python parse_teacher.py *.txt --json        # JSON 저장
python parse_teacher.py --dir ./html --csv  # 폴더 일괄 → CSV
```
위치: 프로젝트 루트 외부 (`/home/user/parse_teacher.py`)

## Git 워크플로우
```bash
git add -p                        # 변경 파일 스테이징
git commit -m "feat: 설명"
git push -u origin claude/<세션ID>  # Claude Code 작업 브랜치
# 로컬에서: git pull origin main
```
브랜치 네이밍: `claude/<작업내용>-<세션ID>`
