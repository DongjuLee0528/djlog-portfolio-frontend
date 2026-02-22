// API 응답 및 요청 관련 타입 정의

// 공통 API 응답 구조
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// 에러 응답 구조
export interface ApiError {
  message: string;
  statusCode: number;
}
