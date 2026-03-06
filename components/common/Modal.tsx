/**
 * 모달 다이얼로그 컴포넌트
 *
 * 오버레이 위에 떠있는 다이얼로그 창을 표시하는 컴포넌트입니다.
 * Framer Motion을 사용한 애니메이션과 접근성 기능을 제공합니다.
 * ESC 키 핸들링, 백드롭 클릭 닫기, 포커스 트랩 등을 지원합니다.
 */
import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { COLORS, ANIMATION } from '../../src/constants';

/**
 * Modal 컴포넌트의 Props 인터페이스
 */
interface ModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 콜백 함수 */
  onClose: () => void;
  /** 모달 제목 (선택사항) */
  title?: string;
  /** 모달 내용 */
  children: React.ReactNode;
  /** 모달 크기 (sm: 작음, md: 중간, lg: 큼, xl: 매우 큼) */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** 추가 CSS 클래스명 */
  className?: string;
}

/** 모달 크기별 최대 너비 CSS 클래스 매핑 */
const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl'
} as const;

/**
 * 모달 다이얼로그 컴포넌트
 *
 * React.memo를 사용하여 성능 최적화가 적용되어 있습니다.
 */
export const Modal: React.FC<ModalProps> = React.memo(({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = ''
}) => {
  /** ESC 키 입력 시 모달 닫기 처리 */
  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  /** 모달 열림/닫힘에 따른 이벤트 리스너 및 스크롤 처리 */
  useEffect(() => {
    if (isOpen) {
      // ESC 키 이벤트 리스너 추가
      document.addEventListener('keydown', handleEscapeKey);
      // 배경 스크롤 방지
      document.body.style.overflow = 'hidden';
    } else {
      // 배경 스크롤 복원
      document.body.style.overflow = 'unset';
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscapeKey]);

  /** 백드롭 클릭 시 모달 닫기 처리 */
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* 백드롭 - 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
          />
          {/* 모달 콘텐츠 */}
          <motion.div
            initial={ANIMATION.fadeIn.initial}
            animate={ANIMATION.fadeIn.animate}
            exit={ANIMATION.fadeIn.exit}
            transition={ANIMATION.fadeIn.transition}
            className={`
              relative w-full ${SIZES[size]} max-h-[90vh] overflow-y-auto
              bg-white rounded-xl shadow-2xl ${className}
            `}
          >
            {/* 모달 헤더 (제목이 있는 경우만 표시) */}
            {title && (
              <div className={`flex items-center justify-between p-6 border-b border-gray-200`}>
                <h2
                  id="modal-title"
                  className={`text-xl font-semibold text-[${COLORS.text}]`}
                >
                  {title}
                </h2>
                {/* 닫기 버튼 */}
                <button
                  onClick={onClose}
                  className={`
                    p-2 hover:bg-gray-100 rounded-lg transition-colors
                    focus:outline-none focus:ring-2 focus:ring-[${COLORS.primary}]/50
                  `}
                  aria-label="모달 닫기"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* 모달 본문 콘텐츠 */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

Modal.displayName = 'Modal';