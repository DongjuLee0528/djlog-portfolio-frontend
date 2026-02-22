import config from '../src/config';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * 중앙화된 API 클라이언트
 * - Base URL 자동 적용
 * - 인증 헤더 자동 추가
 * - 에러 핸들링 및 401 처리
 */
export const apiClient = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const token = localStorage.getItem('adminToken');
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // FormData를 보낼 때는 Content-Type을 브라우저가 설정하게 해야 함
  if (options.body instanceof FormData) {
    delete defaultHeaders['Content-Type'];
  }

  const response = await fetch(`${config.API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  // 401 Unauthorized 처리 (토큰 만료 등)
  if (response.status === 401) {
    localStorage.removeItem('adminToken');
    window.dispatchEvent(new Event('authChange')); // Navbar 업데이트
    window.location.href = '/login'; // 로그인 페이지로 리다이렉트
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  // 응답 내용이 없으면(204 No Content 등) null 반환
  if (response.status === 204) {
    return null as unknown as T;
  }

  return response.json();
};
