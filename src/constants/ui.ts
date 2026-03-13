/**
 * UI 관련 상수 정의
 * 전체 애플리케이션에서 사용되는 색상, 타이포그래피, 레이아웃 관련 상수들을 정의합니다.
 */

/** 애플리케이션 전체에서 사용되는 색상 팔레트 */
export const COLORS = {
  /** 주요 브랜드 색상 - 버튼, 링크, 강조 요소에 사용 */
  primary: '#4A90E2',
  /** 보조 색상 - 텍스트, 헤더, 다크 요소에 사용 */
  secondary: '#222222',
  /** 기본 텍스트 색상 */
  text: '#333333',
  /** 메인 배경 색상 - 페이지 전체 배경 */
  background: '#F7F7F7',
  /** 보조 배경 색상 - 카드, 모달 등의 배경 */
  backgroundSecondary: '#FFFFFF',
  /** 비활성화된 텍스트나 부가 정보에 사용되는 회색 */
  muted: '#888888',
  /** 액센트 색상 - 하이라이트나 호버 상태에 사용 */
  accent: '#E8F4FD',
  /** 에러, 실패 상태를 나타내는 빨간색 */
  error: '#DC3545',
  /** 성공, 완료 상태를 나타내는 초록색 */
  success: '#28A745',
  /** 경고, 주의 상태를 나타내는 노란색 */
  warning: '#FFC107',
} as const;

/** 반응형 타이포그래피 클래스 정의 */
export const TYPOGRAPHY = {
  /** 메인 히어로 섹션의 큰 제목에 사용되는 스타일 */
  hero: 'text-4xl md:text-5xl lg:text-6xl font-bold',
  /** 섹션 제목에 사용되는 스타일 */
  heading: 'text-2xl md:text-3xl font-bold',
  /** 서브 제목이나 카드 제목에 사용되는 스타일 */
  subheading: 'text-xl md:text-2xl font-semibold',
  /** 기본 본문 텍스트 스타일 */
  body: 'text-base',
  /** 부가 정보나 캡션에 사용되는 작은 텍스트 */
  small: 'text-sm',
  /** 매우 작은 텍스트 - 법적 고지, 메타 정보 등에 사용 */
  tiny: 'text-xs',
} as const;

/** 레이아웃 및 간격 관련 유틸리티 클래스 */
export const SPACING = {
  /** 페이지 컨테이너의 최대 너비와 좌우 패딩 */
  container: 'max-w-7xl mx-auto px-6 lg:px-8',
  /** 섹션 간 수직 간격 - 상하 패딩 */
  section: 'py-16 lg:py-24',
  /** 카드나 박스 내부 패딩 */
  card: 'p-6 lg:p-8',
} as const;

/** Framer Motion 애니메이션 variants 정의 */
export const ANIMATION = {
  /** 페이드인 효과 - 아래에서 위로 나타나는 애니메이션 */
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 }
  },
  /** 슬라이드인 효과 - 좌에서 우로 나타나는 애니메이션 */
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 }
  },
  /** 컨테이너 애니메이션 - 자식 요소들을 순차적으로 애니메이션 */
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  /** 리스트 아이템 애니메이션 - container와 함께 사용 */
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }
} as const;

/** Tailwind CSS 브레이크포인트와 일치하는 화면 크기 정의 */
export const BREAKPOINTS = {
  /** 소형 디바이스 (모바일 세로) */
  sm: '640px',
  /** 중형 디바이스 (태블릿 세로) */
  md: '768px',
  /** 대형 디바이스 (태블릿 가로, 소형 노트북) */
  lg: '1024px',
  /** 초대형 디바이스 (데스크톱) */
  xl: '1280px',
  /** 초초대형 디바이스 (대형 데스크톱) */
  '2xl': '1536px',
} as const;