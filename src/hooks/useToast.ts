import toast, { ToastOptions } from 'react-hot-toast';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants';

interface ToastHook {
  success: (message?: string, options?: ToastOptions) => void;
  error: (message?: string, options?: ToastOptions) => void;
  loading: (message?: string, options?: ToastOptions) => string;
  dismiss: (toastId?: string) => void;
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    },
    options?: ToastOptions
  ) => Promise<T>;
}

const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'top-right',
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

export const useToast = (): ToastHook => {
  const success = (message: string = SUCCESS_MESSAGES.PROJECT_SAVED, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options });
  };

  const error = (message: string = ERROR_MESSAGES.GENERIC, options?: ToastOptions) => {
    toast.error(message, { ...defaultOptions, ...options });
  };

  const loading = (message: string = '처리 중...', options?: ToastOptions): string => {
    return toast.loading(message, { ...defaultOptions, ...options });
  };

  const dismiss = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

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

  return {
    success,
    error,
    loading,
    dismiss,
    promise,
  };
};