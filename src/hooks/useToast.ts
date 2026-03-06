/**
 * Toast 알림 시스템을 위한 커스텀 훅
 *
 * react-hot-toast 라이브러리를 래핑하여 일관된 토스트 알림 인터페이스를 제공합니다.
 * 성공, 에러, 로딩, Promise 처리 등 다양한 토스트 유형을 지원하며,
 * 프로젝트 전체에서 통일된 스타일과 동작을 보장합니다.
 */
import toast, { ToastOptions } from 'react-hot-toast';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, LOADING_MESSAGES, ANIMATION_TIMING } from '../constants';

/**
 * useToast 훅이 반환하는 메서드들의 인터페이스
 */
interface ToastHook {
  /** 성공 메시지 토스트를 표시하는 함수 */
  success: (message?: string, options?: ToastOptions) => void;
  /** 에러 메시지 토스트를 표시하는 함수 */
  error: (message?: string, options?: ToastOptions) => void;
  /** 로딩 메시지 토스트를 표시하고 토스트 ID를 반환하는 함수 */
  loading: (message?: string, options?: ToastOptions) => string;
  /** 특정 토스트 또는 모든 토스트를 닫는 함수 */
  dismiss: (toastId?: string) => void;
  /** Promise 상태에 따라 자동으로 토스트를 관리하는 함수 */
  promise: <T>(
    promise: Promise<T>,
    messages: {
      /** 로딩 상태 메시지 */
      loading: string;
      /** 성공 상태 메시지 (문자열 또는 데이터를 받아 문자열을 반환하는 함수) */
      success: string | ((data: T) => string);
      /** 에러 상태 메시지 (문자열 또는 에러를 받아 문자열을 반환하는 함수) */
      error: string | ((error: any) => string);
    },
    options?: ToastOptions
  ) => Promise<T>;
}

/** 토스트 알림의 기본 스타일 및 옵션 설정 */
const defaultOptions: ToastOptions = {
  duration: ANIMATION_TIMING.TOAST_DURATION, // 4초 후 자동 닫힘
  position: 'top-right', // 화면 우상단에 표시
  style: {
    background: '#fff',
    color: '#333',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    padding: '12px 16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },
};

/**
 * Toast 알림을 관리하는 커스텀 훅
 *
 * @returns ToastHook 객체 - 다양한 토스트 메서드들을 포함
 */
export const useToast = (): ToastHook => {
  /**
   * 성공 메시지 토스트를 표시합니다
   * @param message 표시할 성공 메시지 (기본값: 프로젝트 저장 성공 메시지)
   * @param options 추가 토스트 옵션
   */
  const success = (message: string = SUCCESS_MESSAGES.PROJECT_SAVED, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options });
  };

  /**
   * 에러 메시지 토스트를 표시합니다
   * @param message 표시할 에러 메시지 (기본값: 일반 에러 메시지)
   * @param options 추가 토스트 옵션
   */
  const error = (message: string = ERROR_MESSAGES.GENERIC, options?: ToastOptions) => {
    toast.error(message, { ...defaultOptions, ...options });
  };

  /**
   * 로딩 메시지 토스트를 표시합니다
   * @param message 표시할 로딩 메시지 (기본값: '처리 중...')
   * @param options 추가 토스트 옵션
   * @returns 토스트 ID (나중에 dismiss할 때 사용)
   */
  const loading = (message: string = LOADING_MESSAGES.DEFAULT, options?: ToastOptions): string => {
    return toast.loading(message, { ...defaultOptions, ...options });
  };

  /**
   * 특정 토스트를 닫거나 모든 토스트를 닫습니다
   * @param toastId 닫을 토스트의 ID (생략 시 모든 토스트를 닫음)
   */
  const dismiss = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  /**
   * Promise의 상태에 따라 자동으로 토스트를 관리합니다
   * 로딩 → 성공/에러 상태에 따라 토스트가 자동으로 업데이트됩니다
   * @param promise 처리할 Promise 객체
   * @param messages 각 상태별 메시지 설정
   * @param options 추가 토스트 옵션
   * @returns 원본 Promise (체이닝 가능)
   */
  const promise = <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: ToastOptions
  ): Promise<T> => {
    return toast.promise(
      promise,
      messages,
      { ...defaultOptions, ...options }
    );
  };

  // 모든 토스트 메서드를 포함하는 객체 반환
  return {
    success,
    error,
    loading,
    dismiss,
    promise,
  };
};