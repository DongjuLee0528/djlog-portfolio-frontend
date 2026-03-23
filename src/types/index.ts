export type ProjectStatus = 'DRAFT' | 'PUBLISHED';
export interface ProjectLinkItem {
  label: string;
  url: string;
}
export interface ProjectQnaItem {
  question: string;
  answer: string;
  displayOrder?: number;
}

// 프로젝트 데이터를 위한 타입 정의
export interface Project {
  id?: string; // 프로젝트 고유 ID (백엔드 UUID)
  title: string; // 프로젝트 제목
  category?: string; // 프로젝트 카테고리 (Web App, Dashboard 등)
  status?: ProjectStatus; // 게시 상태 (백엔드 enum과 동일)
  description: string; // 프로젝트 설명
  tags: string[]; // 사용된 기술 스택 배열 (메인 페이지용)
  link?: string; // 프로젝트 링크 URL (메인 페이지용)
  image?: string; // 프로젝트 이미지 URL (선택사항)
  
  // 상세 정보 및 관리자용 필드
  links?: ProjectLinkItem[]; // 백엔드 계약 기준 링크 배열
  githubLinks?: ProjectLinkItem[]; // 레거시 호환용 입력 키
  demoLink?: string; // 데모 링크
  qnaList?: ProjectQnaItem[]; // Q&A 데이터 (백엔드 계약 기준)
  qna?: ProjectQnaItem[]; // 레거시 호환용 입력 키
}

// 프로필 데이터를 위한 타입 정의 (자기소개 페이지용)
export interface Profile {
  name: string;
  bio: string; // 짧은 소개
  about: string; // 긴 소개글
  image?: string; // 프로필 사진 URL
  email: string;
  github?: string;

  // 학력
  education: {
    school: string;
    degree: string;
    period: string;
  }[];

  // 성과 (리더십, 수상 등) - 새로 추가됨
  achievements: {
    title: string;
    organization: string;
    description: string;
    period: string;
    category: 'leadership' | 'mentoring' | 'award' | string;
  }[];

  // 자격증
  certificates: {
    name: string;
    issuer: string;
    issueDate: string; // 백엔드 계약 호환을 위해 필드명 통일
  }[];

  // 기술 스택 (카테고리별 분류)
  skills: ProfileSkillGroup[];
}

export interface ProfileSkillGroup {
  category: string; // 예: Frontend, Backend, DevOps
  items: string[]; // 예: ["React", "TypeScript"]
}

export interface ProfileSkillPayloadItem {
  name: string;
  category: string;
  proficiency?: string | number;
}

// 네비게이션 메뉴 아이템을 위한 타입 정의
export interface NavItem {
  label: string; // 메뉴 레이블명
  href: string; // 링크 URL
}
