// API 호출 테스트를 위한 네비게이션 컴포넌트
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiTracker } from '../utils/apiCallTracker';

const TestNavigator: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const resetAndNavigate = (path: string) => {
    console.log(`🚀 네비게이션: ${path}로 이동`);
    apiTracker.reset();
    navigate(path);
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-red-500 text-white p-4 rounded-lg shadow-lg space-y-2">
      <div className="text-xs font-bold">🧪 API 호출 테스트</div>
      <div className="text-xs">현재: {location.pathname}</div>
      <div className="flex flex-col space-y-1">
        <button
          onClick={() => resetAndNavigate('/')}
          className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
        >
          Home (/)
        </button>
        <button
          onClick={() => resetAndNavigate('/about')}
          className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
        >
          About (/about)
        </button>
        <button
          onClick={() => apiTracker.reset()}
          className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-xs"
        >
          카운터 리셋
        </button>
      </div>
    </div>
  );
};

export default TestNavigator;