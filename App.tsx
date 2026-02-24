// 메인 App 컴포넌트 - 애플리케이션의 최상위 컴포넌트
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// 페이지 컴포넌트 import
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Login from './pages/Login';
import Admin from './pages/Admin';
import About from './pages/About';
import NotFound from './pages/NotFound';

// 스크롤 복원 컴포넌트
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="bg-[#F7F7F7] min-h-screen text-[#333333] selection:bg-[#4A90E2] selection:text-white">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            {/* 404 페이지 라우트 (가장 마지막에 위치) */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;