/**
 * React 에러 경계(Error Boundary) 컴포넌트
 *
 * 자식 컴포넌트에서 발생하는 JavaScript 에러를 포착하고 처리하는 컴포넌트입니다.
 * 에러 발생 시 폴백 UI를 표시하거나 재시도 기능을 제공합니다.
 * 프로덕션 환경에서 사용자 경험을 향상시키고 전체 앱이 크래시되는 것을 방지합니다.
 */
import React, { Component, ReactNode } from 'react';
import { COLORS, ERROR_MESSAGES } from '../../src/constants';

/**
 * ErrorBoundary 컴포넌트의 상태 인터페이스
 */
interface ErrorBoundaryState {
  /** 에러 발생 여부 */
  hasError: boolean;
  /** 발생한 에러 객체 (선택사항) */
  error?: Error;
}

/**
 * ErrorBoundary 컴포넌트의 Props 인터페이스
 */
interface ErrorBoundaryProps {
  /** 래핑할 자식 컴포넌트들 */
  children: ReactNode;
  /** 에러 발생 시 표시할 커스텀 폴백 UI (선택사항) */
  fallback?: ReactNode;
  /** 에러 발생 시 실행할 콜백 함수 (로깅 등에 사용) */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * React 에러 경계 클래스 컴포넌트
 *
 * 클래스 컴포넌트로 구현되어야 하는 React의 에러 경계 기능을 제공합니다.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * 에러 발생 시 상태를 업데이트하는 정적 메서드
   * @param error 발생한 에러 객체
   * @returns 업데이트된 상태 객체
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  /**
   * 에러 포착 시 실행되는 라이프사이클 메서드
   * 에러 로깅 및 외부 콜백 실행을 담당합니다.
   * @param error 발생한 에러 객체
   * @param errorInfo React 에러 정보 (컴포넌트 스택 등)
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 외부에서 제공된 에러 핸들러 실행
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * 에러 상태를 리셋하여 재시도를 처리하는 메서드
   */
  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  /**
   * 컴포넌트 렌더링 메서드
   * 에러 상태에 따라 폴백 UI 또는 일반 자식 컴포넌트를 렌더링합니다.
   */
  render() {
    if (this.state.hasError) {
      // 커스텀 폴백 UI가 제공된 경우 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 UI 렌더링
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center p-8">
            {/* 에러 아이콘 */}
            <div className={`text-6xl mb-4 text-[${COLORS.error}]`} role="img" aria-label="오류">
              😵
            </div>
            {/* 에러 제목 */}
            <h2 className={`text-2xl font-bold text-[${COLORS.text}] mb-2`}>
              앗! 문제가 발생했습니다
            </h2>
            {/* 에러 설명 */}
            <p className={`text-[${COLORS.muted}] mb-6`}>
              {ERROR_MESSAGES.GENERIC}
            </p>
            {/* 재시도 버튼 */}
            <button
              onClick={this.handleRetry}
              className={`px-6 py-3 bg-[${COLORS.primary}] text-white rounded-lg hover:bg-[${COLORS.primary}]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[${COLORS.primary}]/50`}
            >
              다시 시도
            </button>
          </div>
        </div>
      );
    }

    // 에러가 없으면 일반 자식 컴포넌트 렌더링
    return this.props.children;
  }
}