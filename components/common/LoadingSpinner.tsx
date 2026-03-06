/**
 * 로딩 스피너 컴포넌트
 *
 * 사용자에게 로딩 상태를 시각적으로 표시하는 컴포넌트입니다.
 * 다양한 크기와 커스텀 메시지를 지원하며, 접근성을 고려한 설계가 적용되어 있습니다.
 */
import React from 'react';
import { COLORS } from '../../src/constants';

/**
 * LoadingSpinner 컴포넌트의 Props 인터페이스
 */
interface LoadingSpinnerProps {
  /** 로딩 메시지 텍스트 (기본값: "로딩 중...") */
  message?: string;
  /** 스피너 크기 (sm: 작음, md: 중간, lg: 큼) */
  size?: 'sm' | 'md' | 'lg';
  /** 추가 CSS 클래스명 */
  className?: string;
}

/** 스피너 크기별 CSS 클래스 매핑 */
const SIZES = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16'
} as const;

/**
 * 로딩 스피너 컴포넌트
 *
 * 회전하는 원형 애니메이션과 함께 로딩 메시지를 표시합니다.
 * React.memo를 사용하여 성능 최적화가 적용되어 있습니다.
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(({
  message = "로딩 중...",
  size = 'md',
  className = ''
}) => {
  const spinnerSize = SIZES[size];

  return (
    <div className={`flex justify-center items-center ${className}`} role="status" aria-live="polite">
      {/* 회전하는 스피너 애니메이션 */}
      <div
        className={`${spinnerSize} border-4 border-[${COLORS.primary}]/30 border-t-[${COLORS.primary}] rounded-full animate-spin`}
        aria-hidden="true"
      />
      {/* 로딩 메시지 텍스트 */}
      {message && (
        <span className={`ml-3 text-[${COLORS.text}]/60`} aria-label={message}>
          {message}
        </span>
      )}
      {/* 스크린 리더용 숨김 텍스트 */}
      <span className="sr-only">{message}</span>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';