// 프로젝트 데이터를 위한 타입 정의
export interface Project {
  id: number; // 프로젝트 고유 ID
  title: string; // 프로젝트 제목
  category?: string; // 프로젝트 카테고리 (Web App, Dashboard 등)
  status?: 'Published' | 'Draft'; // 게시 상태
  description: string; // 프로젝트 설명
  tags: string[]; // 사용된 기술 스택 배열 (메인 페이지용)
  image?: string; // 프로젝트 이미지 URL (선택사항)
  
  // 통합된 링크 관리 필드
  links?: { 
    label: string; // 링크 이름 (예: GitHub, Live Demo, API Docs)
    url: string; // 링크 주소
    description?: string; // 링크에 대한 간단한 설명 (선택사항)
  }[];

  qna?: { question: string; answer: string }[]; // Q&A 데이터
}

// 프로필 데이터를 위한 타입 정의 (자기소개 페이지용)
export interface Profile {
  name: string;
  role: string;
  bio: string; // 짧은 소개
  about: string; // 긴 소개글 (Markdown 지원 가능하도록)
  image?: string; // 프로필 사진 URL
  email: string;
  github?: string;
  // linkedin 필드 삭제됨
  
  // 학력
  education: {
    school: string;
    degree: string;
    period: string;
  }[];
  
  // 자격증
  certificates: {
    name: string;
    issuer: string;
    date: string;
  }[];
  
  // 기술 스택 (카테고리별 분류)
  skills: {
    category: string; // 예: Frontend, Backend, DevOps
    items: string[]; // 예: ["React", "TypeScript"]
  }[];
}

// 네비게이션 메뉴 아이템을 위한 타입 정의
export interface NavItem {
  label: string; // 메뉴 레이블명
  href: string; // 링크 URL
}
