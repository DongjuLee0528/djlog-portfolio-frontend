import React, { Component, ReactNode } from 'react';
import { COLORS, ERROR_MESSAGES } from '../../src/constants';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center p-8">
            <div className={`text-6xl mb-4 text-[${COLORS.error}]`} role="img" aria-label="오류">
              😵
            </div>
            <h2 className={`text-2xl font-bold text-[${COLORS.text}] mb-2`}>
              앗! 문제가 발생했습니다
            </h2>
            <p className={`text-[${COLORS.muted}] mb-6`}>
              {ERROR_MESSAGES.GENERIC}
            </p>
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

    return this.props.children;
  }
}