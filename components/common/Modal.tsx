import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { COLORS, ANIMATION } from '../../src/constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl'
} as const;

export const Modal: React.FC<ModalProps> = React.memo(({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = ''
}) => {
  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscapeKey]);

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
          />
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
            {title && (
              <div className={`flex items-center justify-between p-6 border-b border-gray-200`}>
                <h2
                  id="modal-title"
                  className={`text-xl font-semibold text-[${COLORS.text}]`}
                >
                  {title}
                </h2>
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