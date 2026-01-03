// 프로젝트 데이터를 위한 타입 정의
export interface Project {
  id: number; // 프로젝트 고유 ID
  title: string; // 프로젝트 제목
  category?: string; // 프로젝트 카테고리 (Web App, Dashboard 등)
  status?: 'Published' | 'Draft'; // 게시 상태
  description: string; // 프로젝트 설명
  tags: string[]; // 사용된 기술 스택 배열 (메인 페이지용)
  link?: string; // 프로젝트 링크 URL (메인 페이지용)
  image?: string; // 프로젝트 이미지 URL (선택사항)
  
  // 상세 정보 및 관리자용 필드
  githubLinks?: { label: string; url: string }[]; // 다중 GitHub 링크
  demoLink?: string; // 데모 링크
  qna?: { question: string; answer: string }[]; // Q&A 데이터
}

// 네비게이션 메뉴 아이템을 위한 타입 정의
export interface NavItem {
  label: string; // 메뉴 레이블명
  href: string; // 링크 URL
}
