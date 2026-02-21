// 환경 변수 및 전역 설정 관리
const config = {
  // API 기본 URL
  // .env 파일에 VITE_API_URL이 있으면 사용하고, 없으면 빈 문자열(현재 도메인의 프록시 사용) 또는 로컬 주소 사용
  API_URL: import.meta.env.VITE_API_URL || '',
};

export default config;