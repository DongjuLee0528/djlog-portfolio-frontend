/**
 * 애니메이션 타이밍 및 지연시간 상수
 * UI 애니메이션과 사용자 인터페이스의 타이밍을 일관되게 관리합니다.
 */

/** 애니메이션과 UI 요소의 타이밍 관련 상수들 */
export const ANIMATION_TIMING = {
  /** 히어로 섹션의 3D 모델 로딩 타임아웃 - 5초 후 폴백 UI 표시 */
  HERO_TEXT_ROTATION: 5000,
  /** 토스트 알림의 자동 닫힘 시간 - 4초 후 자동으로 사라짐 */
  TOAST_DURATION: 4000,
} as const;