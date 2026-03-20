/**
 * 메인 App 컴포넌트 - 애플리케이션의 최상위 컴포넌트
 *
 * React Router를 사용한 라우팅 설정과 전역 레이아웃을 담당합니다.
 * 에러 바운더리, 토스트 알림, 페이지 전환 애니메이션 등을 포함합니다.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './components/common';
import TestNavigator from './components/TestNavigator';

// 페이지 컴포넌트 import
import Home from './pages/Home';
import HomeOptimized from './pages/Home-optimized';
import ProjectDetail from './pages/ProjectDetail';
import Login from './pages/Login';
import Admin from './pages/Admin';
import About from './pages/About';
import NotFound from './pages/NotFound';

/**
 * 페이지 변경 시 스크롤 위치를 최상단으로 복원하는 컴포넌트
 * React Router의 페이지 전환 시 스크롤 위치가 유지되는 것을 방지합니다.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

/**
 * 메인 애플리케이션 컴포넌트
 *
 * @returns 전체 애플리케이션의 라우터와 레이아웃이 구성된 JSX
 */
function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <div className="bg-[#F7F7F7] min-h-screen text-[#333333] selection:bg-[#4A90E2] selection:text-white">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/optimized" element={<HomeOptimized />} />
              <Route path="/about" element={<About />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </div>
        <TestNavigator />
        <Toaster />
      </Router>
    </ErrorBoundary>
  );
}

export default App;