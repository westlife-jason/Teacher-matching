import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const centerData = [
  { id: 119, center: "현대백화점", region: "서울", branch: "가든파이브점", address: "서울특별시 송파구 충민로 66 아울렛관" },
  { id: 120, center: "현대백화점", region: "서울", branch: "더 현대 서울", address: "서울 영등포구 여의대로 108" },
  { id: 121, center: "현대백화점", region: "서울", branch: "목동점", address: "서울특별시 양천구 목동동로 257" },
  { id: 122, center: "현대백화점", region: "서울", branch: "무역센터점", address: "서울 강남구 테헤란로 517" },
  { id: 123, center: "현대백화점", region: "서울", branch: "미아점", address: "서울특별시 성북구 동소문로 315" },
  { id: 124, center: "현대백화점", region: "서울", branch: "신촌점", address: "서울시 서대문구 신촌로 83" },
  { id: 125, center: "현대백화점", region: "서울", branch: "압구정 본점", address: "서울 강남구 압구정로 165" },
  { id: 126, center: "현대백화점", region: "서울", branch: "천호점", address: "서울 강동구 천호대로 1005" },
  { id: 127, center: "현대백화점", region: "경기", branch: "부천 중동점", address: "경기도 부천시 길주로 180" },
  { id: 128, center: "현대백화점", region: "경기", branch: "일산 킨텍스점", address: "경기도 고양시 일산서구 호수로 817" },
  { id: 129, center: "현대백화점", region: "경기", branch: "판교점", address: "경기도 성남시 분당구 판교역로146번길 20" },
  { id: 130, center: "현대백화점", region: "대구", branch: "더 현대 대구", address: "대구 중구 달구벌대로 2077" },
  { id: 131, center: "아이파크몰", region: "서울", branch: "용산점", address: "서울시 용산구 한강대로 23길 55" },
  { id: 132, center: "AK백화점", region: "경기", branch: "분당점", address: "경기 성남시 분당구 황새울로 360번길 42" },
  { id: 133, center: "AK백화점", region: "경기", branch: "수원점", address: "경기 수원시 팔달구 덕영대로 924" },
  { id: 134, center: "AK백화점", region: "경기", branch: "평택점", address: "경기 평택시 평택로 51" },
  { id: 135, center: "롯데백화점", region: "서울", branch: "본점", address: "서울특별시 중구 남대문로 81" },
  { id: 136, center: "롯데백화점", region: "서울", branch: "강남점", address: "서울특별시 강남구 도곡로 401" },
  { id: 137, center: "롯데백화점", region: "서울", branch: "건대스타시티점", address: "서울특별시 광진구 능동로 92" },
  { id: 138, center: "롯데백화점", region: "서울", branch: "관악점", address: "서울특별시 관악구 봉천로 209" },
  { id: 139, center: "롯데백화점", region: "서울", branch: "김포공항점", address: "서울특별시 강서구 하늘길 38" },
  { id: 140, center: "롯데백화점", region: "서울", branch: "노원점", address: "서울특별시 노원구 동일로 1414" },
  { id: 141, center: "롯데백화점", region: "서울", branch: "미아점", address: "서울특별시 강북구 도봉로62" },
  { id: 142, center: "롯데백화점", region: "서울", branch: "영등포점", address: "서울특별시 영등포구 경인로 846" },
  { id: 143, center: "롯데백화점", region: "서울", branch: "잠실점", address: "서울특별시 송파구 올림픽로 240" },
  { id: 144, center: "롯데백화점", region: "서울", branch: "청량리점", address: "서울특별시 동대문구 왕산로 214" },
  { id: 145, center: "롯데백화점", region: "경기", branch: "구리점", address: "경기도 구리시 경춘로 261" },
  { id: 146, center: "롯데백화점", region: "경기", branch: "동탄점", address: "경기도 화성시 동탄역로 160" },
  { id: 147, center: "롯데백화점", region: "경기", branch: "부천 중동점", address: "경기도 부천시 길주로300" },
  { id: 148, center: "롯데백화점", region: "경기", branch: "분당점", address: "경기도 성남시 분당구 황새울로 200번길 45" },
  { id: 149, center: "롯데백화점", region: "경기", branch: "수원점", address: "경기도 수원시 권선구 세화로134 타임빌라스" },
  { id: 150, center: "롯데백화점", region: "경기", branch: "안산점", address: "경기도 안산시 단원구 고잔1길 12" },
  { id: 151, center: "롯데백화점", region: "인천", branch: "인천점", address: "인천광역시 미추홀구 연남로35" },
  { id: 152, center: "롯데백화점", region: "경기", branch: "일산점", address: "경기도 고양시 일산동구 중앙로 1283" },
  { id: 153, center: "롯데백화점", region: "경기", branch: "평촌점", address: "경기도 안양시 동안구 시민대로 180" },
  { id: 154, center: "롯데몰", region: "서울", branch: "김포공항점", address: "서울특별시 강서구 하늘길 38" },
  { id: 155, center: "롯데몰", region: "경기", branch: "광명점", address: "경기도 광명시 일직로 17" },
  { id: 156, center: "롯데몰", region: "경기", branch: "수원 타임빌라스", address: "경기도 수원시 권선구 세화로134" },
  { id: 157, center: "신세계백화점", region: "서울", branch: "본점", address: "서울특별시 중구 남대문시장10길 2" },
  { id: 158, center: "신세계백화점", region: "서울", branch: "강남점", address: "서울특별시 서초구 신반포로 176" },
  { id: 159, center: "신세계백화점", region: "서울", branch: "타임스퀘어점", address: "서울특별시 영등포구 영등포동 4가" },
  { id: 160, center: "신세계백화점", region: "경기", branch: "수지 사우스시티", address: "경기도 용인시 수지구 포은대로 536" },
  { id: 161, center: "신세계백화점", region: "경기", branch: "스타필드 하남점", address: "경기도 하남시 미사대로 750" },
  { id: 162, center: "신세계백화점", region: "경기", branch: "의정부점", address: "경기 의정부시 평화로 525" },
  { id: 163, center: "NC 뉴코아", region: "서울", branch: "강남점", address: "서울특별시 서초구 잠원로 51" },
  { id: 164, center: "NC 뉴코아", region: "서울", branch: "송파점", address: "서울 송파구 충민로 66" },
  { id: 165, center: "NC 뉴코아", region: "경기", branch: "부천점", address: "경기 부천시 원미구 송내대로 239" },
  { id: 166, center: "NC 뉴코아", region: "경기", branch: "분당 야탑점", address: "경기 성남시 분당구 야탑로81번길 11" },
  { id: 167, center: "NC 뉴코아", region: "전남", branch: "순천점", address: "전남 순천시 비봉2길 22" },
  { id: 168, center: "NC 뉴코아", region: "경기", branch: "평촌점", address: "경기도 안양시 동안구 동안로 119" },
  { id: 169, center: "롯데마트", region: "서울", branch: "송파점", address: "서울 송파구 중대로 80" },
  { id: 170, center: "롯데마트", region: "서울", branch: "양평점", address: "서울 영등포구 선유로 138-0" },
  { id: 171, center: "롯데마트", region: "서울", branch: "영등포점", address: "서울 영등포구 영중로 125" },
  { id: 172, center: "롯데마트", region: "서울", branch: "은평점", address: "서울 은평구 통일로 1050" },
  { id: 173, center: "롯데마트", region: "서울", branch: "중계점", address: "서울 노원구 노원로 330" },
  { id: 174, center: "롯데마트", region: "경기", branch: "고양점", address: "경기 고양시 덕양구 충장로 150" },
  { id: 175, center: "롯데마트", region: "경기", branch: "광교점", address: "경기도 수원시 영통구 센트럴 타운로85" },
  { id: 176, center: "롯데마트", region: "경기", branch: "구리점", address: "경기 구리시 동구릉로136번길 57" },
  { id: 177, center: "롯데마트", region: "경기", branch: "권선점", address: "경기 수원시 권선구 동수원로 232" },
  { id: 178, center: "롯데마트", region: "경기", branch: "김포한강", address: "경기 김포시 김포한강2로 41" },
  { id: 179, center: "롯데마트", region: "경기", branch: "동두천", address: "경기 동두천시 평화로2169번길 21" },
  { id: 180, center: "롯데마트", region: "경기", branch: "수지점", address: "경기 용인시 수지구 성복2로 38" },
  { id: 181, center: "롯데마트", region: "경기", branch: "시흥배곧점", address: "경기 시흥시 서울대학로278번길 67" },
  { id: 182, center: "롯데마트", region: "경기", branch: "신갈점", address: "경기 용인시 기흥구 중부대로 375" },
  { id: 183, center: "롯데마트", region: "경기", branch: "안산점", address: "경기 안산시 상록구 항가울로 422" },
  { id: 184, center: "롯데마트", region: "경기", branch: "안성점", address: "경기 안성시 공도읍 서동대로 4478" },
  { id: 185, center: "롯데마트", region: "경기", branch: "오산점", address: "경기 오산시 경기대로 271" },
  { id: 186, center: "롯데마트", region: "경기", branch: "의왕점", address: "경기 의왕시 계원대학로 7" },
  { id: 187, center: "롯데마트", region: "경기", branch: "이천점", address: "경기 이천시 구만리로 191" },
  { id: 188, center: "롯데마트", region: "경기", branch: "평택점", address: "경기 평택시 평택5로 30" },
  { id: 189, center: "이마트", region: "서울", branch: "가든5점", address: "서울 송파구 충민로 10" },
  { id: 190, center: "이마트", region: "서울", branch: "구로점", address: "서울특별시 구로구 디지털로32길 43" },
  { id: 191, center: "이마트", region: "서울", branch: "명일점", address: "서울 강동구 고덕로 276" },
  { id: 192, center: "이마트", region: "서울", branch: "신도림점", address: "서울 구로구 새말로 97" },
  { id: 193, center: "이마트", region: "서울", branch: "양천점", address: "서울 양천구 오목로 299" },
  { id: 194, center: "이마트", region: "서울", branch: "월계점", address: "서울 노원구 마들로3길 15" },
  { id: 195, center: "이마트", region: "서울", branch: "은평점", address: "서울 은평구 은평로 111" },
  { id: 196, center: "이마트", region: "서울", branch: "중랑점", address: "서울 중랑구 동일로 932" },
  { id: 197, center: "이마트", region: "서울", branch: "청계천점", address: "서울 중구 청계천로 400" },
  { id: 198, center: "이마트", region: "서울", branch: "하월곡점", address: "서울 성북구 종암로 167" },
  { id: 199, center: "이마트", region: "경기", branch: "고잔점", address: "경기 안산시 단원구 원포공원1로 46" },
  { id: 200, center: "이마트", region: "경기", branch: "과천점", address: "경기도 과천시 별양상가2로 20" },
  { id: 201, center: "이마트", region: "경기", branch: "광교점", address: "경기도 수원시 영통구 광교로 191" },
  { id: 202, center: "이마트", region: "경기", branch: "김포한강점", address: "경기도 김포시 김포한강7로 71" },
  { id: 203, center: "이마트", region: "경기", branch: "남양주점", address: "경기 남양주시 늘을2로 27" },
  { id: 204, center: "이마트", region: "경기", branch: "다산점", address: "경기 남양주시 도농로 24" },
  { id: 205, center: "이마트", region: "경기", branch: "동탄점", address: "경기 화성시 동탄중앙로 376" },
  { id: 206, center: "이마트", region: "경기", branch: "별내점", address: "경기 남양주시 순화궁로 167" },
  { id: 207, center: "이마트", region: "경기", branch: "봉담점", address: "경기 화성시 봉담읍 효행로 278" },
  { id: 208, center: "이마트", region: "경기", branch: "분당점", address: "경기 성남 분당구 불정로 134" },
  { id: 209, center: "이마트", region: "경기", branch: "서수원점", address: "경기 수원시 권선구 수인로 291" },
  { id: 210, center: "이마트", region: "경기", branch: "성남점", address: "경기 성남시 수정구 수정로 201" },
  { id: 211, center: "이마트", region: "경기", branch: "소하점", address: "경기 광명시 소하로 97" },
  { id: 212, center: "이마트", region: "경기", branch: "수지점", address: "경기 용인시 수지구 수지로 203" },
  { id: 213, center: "이마트", region: "경기", branch: "안성점", address: "경기 안성시 중앙로 246" },
  { id: 214, center: "이마트", region: "경기", branch: "양주점", address: "경기 양주시 평화로 1713" },
  { id: 215, center: "이마트", region: "경기", branch: "오산점", address: "경기 오산시 경기대로 181" },
  { id: 216, center: "이마트", region: "경기", branch: "운정점", address: "경기 파주시 한울로 123" },
  { id: 217, center: "이마트", region: "경기", branch: "의정부점", address: "경기도 의정부시 민락로 210" },
  { id: 218, center: "이마트", region: "경기", branch: "이천점", address: "경기도 이천시 이섭대천로 1440-50" },
  { id: 219, center: "이마트", region: "경기", branch: "중동점", address: "경기도 부천시 석천로 188" },
  { id: 220, center: "이마트", region: "경기", branch: "진접점", address: "경기 남양주시 진접읍 금강로유연들1길 154" },
  { id: 221, center: "이마트", region: "경기", branch: "포천점", address: "경기 포천시 호국로 915" },
  { id: 222, center: "이마트", region: "경기", branch: "풍산점", address: "경기 고양시 일산동구 무궁화로 237" },
  { id: 223, center: "이마트", region: "경기", branch: "하남점", address: "경기 하남시 덕풍서로 70" },
  { id: 224, center: "이마트", region: "경기", branch: "흥덕점", address: "경기 용인시 기흥구 흥덕중앙로 60" },
  { id: 225, center: "이마트", region: "경기", branch: "부천스타필드", address: "경기도 부천시 옥길로 1" },
  { id: 226, center: "이마트", region: "경기", branch: "안성스타필드", address: "경기도 안성시 공도읍 서동대로 3930-39" },
  { id: 227, center: "이마트", region: "경기", branch: "위례스타필드", address: "경기도 하남시 위례대로 200" },
  { id: 228, center: "이마트", region: "경기", branch: "김포 트레이더스", address: "경기도 김포시 김포대로 715" },
  { id: 229, center: "이마트", region: "경기", branch: "동탄 트레이더스", address: "경기 화성시 동탄대로 451" },
  { id: 230, center: "이마트", region: "경기", branch: "수원 트레이더스", address: "경기도 수원시 영통구 삼성로 2" },
  { id: 231, center: "이마트", region: "경기", branch: "일산 트레이더스", address: "경기도 고양시 일산서구 킨텍스로 171" },
  { id: 232, center: "이마트", region: "인천", branch: "검단점", address: "인천 서구 서곶로 754" },
  { id: 233, center: "이마트", region: "인천", branch: "동인천점", address: "인천 중구 인중로 134" },
  { id: 234, center: "이마트", region: "인천", branch: "부천점", address: "경기 부천시 소사구 부천로 1" },
  { id: 235, center: "세이브존", region: "경기", branch: "광명점", address: "경기 광명시 철망산로 87" },
  { id: 236, center: "세이브존", region: "경기", branch: "성남점", address: "경기 성남시 수정구 산성대로 337" },
];

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  // 테스트용 선생님 계정
  await prisma.user.upsert({
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

  await prisma.user.upsert({
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

  // 문화센터 118개 삽입
  let created = 0;
  for (const c of centerData) {
    const email = `center-${c.id}@friending.com`;
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: hashedPassword,
        name: `${c.center} ${c.branch}`,
        role: Role.CENTER,
        center: {
          create: {
            centerName: `${c.center} ${c.branch}`,
            address: c.address,
            description: `${c.region} ${c.center} ${c.branch} 문화센터`,
          },
        },
      },
    });
    created++;
    if (created % 20 === 0) console.log(`  ${created}/118 완료...`);
  }

  console.log(`\n시드 완료: 강사 2명, 문화센터 ${created}개`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
