# NEXBOT Portfolio

개인 포트폴리오 웹사이트 프론트엔드입니다.
프로젝트 소개, 기술 스택, 작업물, 관리자 기능을 제공하는 React 기반 SPA입니다.

## Tech Stack

- **Framework**: React 19.2.3
- **Language**: TypeScript
- **Routing**: React Router DOM 6.22.3
- **Animation**: Framer Motion 12.23.26
- **Icons**: Lucide React 0.562.0
- **Build Tool**: Vite 6.2.0
- **Development Server**: Vite Dev Server (Port 3000)

## Features

- **홈페이지**: 개인 소개 및 히어로 섹션
- **About 페이지**: 상세 프로필, 학력, 자격증, 기술 스택
- **프로젝트 목록**: 포트폴리오 프로젝트 showcase
- **프로젝트 상세**: 개별 프로젝트 상세 정보 및 Q&A
- **관리자 기능**: 프로젝트/프로필 관리 (로그인 필요)
- **반응형 UI**: 모바일/데스크톱 최적화
- **애니메이션**: 페이지 전환 및 인터랙션 애니메이션

## Project Structure

```
nexbot-portfolio/
├── components/           # 재사용 컴포넌트
│   ├── Admin.tsx        # 관리자 컴포넌트
│   ├── Contact.tsx      # 연락처 섹션
│   ├── Hero.tsx         # 히어로 섹션
│   ├── Login.tsx        # 로그인 폼
│   ├── Navbar.tsx       # 네비게이션 바
│   ├── ProfileModal.tsx # 프로필 편집 모달
│   ├── ProjectDetail.tsx# 프로젝트 상세 컴포넌트
│   ├── ProjectModal.tsx # 프로젝트 편집 모달
│   ├── Projects.tsx     # 프로젝트 목록
│   └── Stack.tsx        # 기술 스택 컴포넌트
├── pages/               # 라우팅 페이지
│   ├── About.tsx        # About 페이지
│   ├── Admin.tsx        # 관리자 페이지
│   ├── Home.tsx         # 홈 페이지
│   ├── Login.tsx        # 로그인 페이지
│   └── ProjectDetail.tsx# 프로젝트 상세 페이지
├── hooks/               # 커스텀 훅
├── utils/               # 유틸 함수
├── App.tsx              # 메인 앱 컴포넌트
├── index.tsx            # 엔트리 포인트
├── types.ts             # TypeScript 타입 정의
├── vite.config.ts       # Vite 설정
└── package.json         # 의존성 관리
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. 저장소 클론
```bash
git clone <repository-url>
cd nexbot-portfolio
```

2. 의존성 설치
```bash
npm install
```

3. 개발 서버 실행
```bash
npm run dev
```

4. 브라우저에서 `http://localhost:3000` 접속

### Available Scripts

- `npm run dev` - 개발 서버 실행 (포트 3000)
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드된 앱 미리보기

## Routes

- `/` - 홈페이지 (Hero, Projects, Contact)
- `/about` - About 페이지 (프로필, 학력, 자격증, 기술스택)
- `/project/:id` - 프로젝트 상세 페이지
- `/login` - 관리자 로그인
- `/admin` - 관리자 대시보드 (프로젝트/프로필 관리)

## Data Types

### Project Interface
```typescript
interface Project {
  id: number;
  title: string;
  category?: string;
  status?: 'Published' | 'Draft';
  description: string;
  tags: string[];
  link?: string;
  image?: string;
  githubLinks?: { label: string; url: string }[];
  demoLink?: string;
  qna?: { question: string; answer: string }[];
}
```

### Profile Interface
```typescript
interface Profile {
  name: string;
  bio: string;
  about: string;
  image?: string;
  email: string;
  github?: string;
  education: { school: string; degree: string; period: string }[];
  certificates: { name: string; issuer: string; date: string }[];
  skills: { category: string; items: string[] }[];
}
```

## Key Features

### 성능 최적화
- Lazy Loading으로 초기 로딩 속도 개선
- Framer Motion을 통한 부드러운 페이지 전환
- 스크롤 위치 복원 기능

### 관리자 기능
- 프로젝트 CRUD (생성, 읽기, 업데이트, 삭제)
- 프로필 정보 실시간 편집
- 모달 기반 직관적 UI

### 반응형 디자인
- 모바일/태블릿/데스크톱 최적화
- 적응형 레이아웃 및 컴포넌트

