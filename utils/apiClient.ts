/**
 * API 클라이언트 유틸리티 - 통합된 HTTP 요청 처리
 *
 * 모든 API 호출에 대한 중앙화된 관리를 제공하며,
 * 인증, 에러 핸들링, 공통 헤더 설정을 자동으로 처리합니다.
 */

import config from '../src/config';

/**
 * API 요청 옵션 인터페이스
 * fetch API의 RequestInit을 확장하여 커스텀 헤더를 추가할 수 있도록 합니다.
 */
interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * 중앙화된 API 클라이언트
 *
 * 주요 기능:
 * - Base URL 자동 적용
 * - 인증 토큰 헤더 자동 추가
 * - 401 Unauthorized 응답 자동 처리
 * - FormData 요청 시 Content-Type 자동 조정
 * - 에러 응답 정규화
 *
 * @template T - 응답 데이터의 타입
 * @param endpoint - API 엔드포인트 경로 (예: '/api/projects')
 * @param options - fetch API 옵션 (method, body, headers 등)
 * @returns API 응답 데이터
 * @throws API 에러 또는 네트워크 에러 시 Error를 throw
 */
export const apiClient = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  // localStorage에서 관리자 인증 토큰 가져오기
  const token = localStorage.getItem('adminToken');

  // 기본 HTTP 헤더 설정
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 토큰이 있으면 Authorization 헤더에 Bearer 토큰 추가
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // FormData를 보낼 때는 Content-Type을 브라우저가 자동 설정하도록 해야 함
  // (multipart/form-data 경계 설정을 위해)
  if (options.body instanceof FormData) {
    delete defaultHeaders['Content-Type'];
  }

  // API 요청 실행
  const response = await fetch(`${config.API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers, // 사용자 정의 헤더가 기본 헤더보다 우선
    },
  });

  // 401 Unauthorized 응답 처리 (토큰 만료, 인증 실패 등)
  if (response.status === 401) {
    localStorage.removeItem('adminToken'); // 만료된 토큰 제거
    window.dispatchEvent(new Event('authChange')); // Navbar 컴포넌트 로그인 상태 업데이트
    window.location.href = '/login'; // 로그인 페이지로 강제 리다이렉트
    throw new Error('Unauthorized');
  }

  // 기타 HTTP 에러 응답 처리
  if (!response.ok) {
    // 에러 응답에서 메시지 추출 시도
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  // 204 No Content 응답 처리 (삭제 성공 등)
  if (response.status === 204) {
    return null as unknown as T;
  }

  // 정상 응답 JSON 파싱하여 반환
  return response.json();
};
