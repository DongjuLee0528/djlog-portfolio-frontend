/**
 * 환경 변수 및 전역 설정 관리
 * 애플리케이션 전체에서 사용되는 설정값들을 중앙화하여 관리합니다.
 * 환경별로 다른 값을 사용해야 하는 설정들을 포함합니다.
 */

/** 애플리케이션 전역 설정 객체 */
const config = {
  /**
   * API 서버의 기본 URL
   *
   * 환경별 설정:
   * - 개발환경: VITE_API_URL 환경변수에서 로드 (예: http://localhost:8000)
   * - 프로덕션: 빈 문자열로 설정하여 현재 도메인의 API 라우트 사용
   * - 프록시 설정: vite.config.ts에서 /api 경로를 백엔드로 프록시
   */
  API_URL: import.meta.env.VITE_API_URL || '',
};

export default config;
