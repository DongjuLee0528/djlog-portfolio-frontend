# NexBot Portfolio

개인 포트폴리오 웹사이트로, 프로젝트 소개, 기술 스택, 작업물을 효과적으로 전시하며 관리자가 콘텐츠를 실시간으로 관리할 수 있는 React 기반 웹 애플리케이션입니다.

## 주요 기능

- **포트폴리오 전시**: 프로젝트 목록 및 상세 정보 표시
- **개인 프로필**: 학력, 자격증, 기술 스택 등 개인 정보 표시
- **관리자 대시보드**: 프로젝트와 프로필 정보의 실시간 CRUD 관리
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 환경 지원
- **부드러운 애니메이션**: Framer Motion을 활용한 페이지 전환 효과
- **토스트 알림**: 사용자 피드백을 위한 알림 시스템

## 기술 스택

### Frontend
- **React**: 19.2.3 - 컴포넌트 기반 UI 프레임워크
- **TypeScript**: 5.8.2 - 정적 타입 검사
- **React Router DOM**: 6.22.3 - 클라이언트 사이드 라우팅
- **Framer Motion**: 12.23.26 - 애니메이션 라이브러리
- **React Hot Toast**: 2.6.0 - 토스트 알림
- **Lucide React**: 0.562.0 - 아이콘 라이브러리

### Development & Build
- **Vite**: 6.2.0 - 빌드 도구 및 개발 서버
- **TypeScript**: 정적 타입 시스템

## 프로젝트 구조

```
nexbot-portfolio/
├── components/                 # 재사용 가능한 컴포넌트
│   ├── common/                # 공통 컴포넌트
│   │   ├── ErrorBoundary.tsx  # 에러 경계
│   │   ├── LoadingSpinner.tsx # 로딩 스피너
│   │   └── Modal.tsx          # 모달 컴포넌트
│   ├── Contact.tsx            # 연락처 섹션
│   ├── Hero.tsx              # 히어로 섹션
│   ├── Navbar.tsx            # 네비게이션 바
│   ├── ProfileModal.tsx      # 프로필 편집 모달
│   ├── ProjectModal.tsx      # 프로젝트 편집 모달
│   ├── Projects.tsx          # 프로젝트 목록
│   ├── Stack.tsx             # 기술 스택 섹션
│   └── TestNavigator.tsx     # 테스트 네비게이터
├── pages/                    # 페이지 컴포넌트
│   ├── About.tsx            # 소개 페이지
│   ├── Admin.tsx            # 관리자 페이지
│   ├── Home.tsx             # 홈 페이지
│   ├── Home-optimized.tsx   # 최적화된 홈 페이지
│   ├── Login.tsx            # 로그인 페이지
│   ├── NotFound.tsx         # 404 페이지
│   └── ProjectDetail.tsx    # 프로젝트 상세 페이지
├── src/                     # 소스 코드
│   ├── constants/           # 상수 정의
│   │   ├── contact.ts       # 연락처 정보
│   │   ├── index.ts         # 통합 상수
│   │   ├── messages.ts      # 메시지 상수
│   │   ├── timing.ts        # 타이밍 상수
│   │   └── ui.ts           # UI 상수
│   ├── hooks/              # 커스텀 훅
│   │   ├── useAdmin.ts     # 관리자 기능 훅
│   │   └── useToast.ts     # 토스트 알림 훅
│   ├── types/              # TypeScript 타입 정의
│   │   └── index.ts        # 메인 타입 정의
│   └── config.ts           # 애플리케이션 설정
├── utils/                   # 유틸리티 함수
│   ├── normalize.ts         # 데이터 정규화
│   └── apiCallTracker.ts    # API 호출 추적
├── App.tsx                  # 메인 애플리케이션 컴포넌트
├── index.tsx                # 진입점
├── vite.config.ts           # Vite 설정
├── tsconfig.json           # TypeScript 설정
├── package.json            # 의존성 및 스크립트
├── API_SPEC.md             # 백엔드 API 명세서
└── metadata.json           # 프로젝트 메타데이터
```

## 페이지 구성

- **/** - 홈페이지 (히어로, 프로젝트, 기술 스택, 연락처)
- **/optimized** - 최적화된 홈페이지
- **/about** - 상세 프로필 페이지 (학력, 자격증, 성과)
- **/project/:id** - 개별 프로젝트 상세 페이지
- **/login** - 관리자 로그인
- **/admin** - 관리자 대시보드 (프로젝트/프로필 관리)

## 데이터 타입

### Project
```typescript
interface Project {
  id?: string;
  title: string;
  category?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  description: string;
  tags: string[];
  image?: string;
  githubLinks?: { label: string; url: string }[];
  demoLink?: string;
  qna?: { question: string; answer: string }[];
}
```

### Profile
```typescript
interface Profile {
  name: string;
  bio: string;
  about: string;
  image?: string;
  email: string;
  github?: string;
  education: { school: string; degree: string; period: string }[];
  achievements: { title: string; organization: string; description: string; period: string; category: string }[];
  certificates: { name: string; issuer: string; issueDate: string }[];
  skills: { category: string; items: string[] }[];
}
```

## 설치 및 실행

### 사전 요구사항
- Node.js 16 이상
- npm 또는 yarn

### 설치
```bash
# 저장소 클론
git clone <repository-url>
cd nexbot-portfolio

# 의존성 설치
npm install
```

### 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5173` 접속

### 사용 가능한 스크립트
- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드된 앱 미리보기

## 환경 설정

### 환경 변수
```env
VITE_API_URL=http://localhost:8000  # 백엔드 API URL (개발환경)
```

### API 연동
프론트엔드는 별도의 백엔드 API와 연동됩니다. 백엔드 구현을 위한 상세한 API 명세는 `API_SPEC.md` 파일을 참조하세요.

## 주요 기능 상세

### 성능 최적화
- React.memo를 통한 불필요한 리렌더링 방지
- 컴포넌트 지연 로딩
- API 호출 추적 및 최적화

### 관리자 기능
- JWT 기반 인증 시스템
- 프로젝트 CRUD 관리
- 프로필 정보 실시간 편집
- 모달 기반 직관적 UI

### 사용자 경험
- 부드러운 페이지 전환 애니메이션
- 반응형 디자인 (모바일 퍼스트)
- 접근성 고려 (ARIA 라벨, 키보드 네비게이션)
- 로딩 상태 및 에러 처리

## 배포

프로덕션 빌드:
```bash
npm run build
```

빌드된 파일은 `dist/` 디렉터리에 생성되며, 정적 파일 서버에 배포 가능합니다.

## 라이센스

이 프로젝트는 개인 포트폴리오 목적으로 제작되었습니다.