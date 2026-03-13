/**
 * 404 페이지 컴포넌트 - 존재하지 않는 경로로 접근했을 때 표시
 *
 * 사용자가 존재하지 않는 URL로 접근했을 때 표시되는 에러 페이지입니다.
 * 친화적인 메시지와 함께 홈 페이지로 돌아갈 수 있는 버튼을 제공합니다.
 * 시각적으로 명확한 에러 표시와 접근성을 고려한 ARIA 레이블을 포함합니다.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 404 에러 페이지 컴포넌트
 *
 * @returns 404 에러 메시지와 홈 링크가 포함된 페이지 JSX
 */
const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-6">
      <main role="main" aria-label="페이지를 찾을 수 없음">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500">
            <AlertTriangle size={40} aria-hidden="true" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-[#222222] mb-3" role="alert">Page Not Found</h1>
        <p className="text-[#333333]/60 mb-8 text-lg">
          죄송합니다. 요청하신 페이지를 찾을 수 없습니다.<br />
          주소를 다시 확인해주세요.
        </p>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#222222] text-white rounded-full font-medium hover:bg-black transition-colors shadow-lg shadow-black/10"
          aria-label="홈 페이지로 돌아가기"
        >
          <Home size={18} aria-hidden="true" />
          홈으로 돌아가기
        </button>
      </motion.div>
      </main>
    </div>
  );
};

export default NotFound;