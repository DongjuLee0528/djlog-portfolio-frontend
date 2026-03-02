// 네비게이션 바 컴포넌트 - 웹사이트 상단의 고정 네비게이션
import React, { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { Menu, X, Lock, User } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC = memo(() => {
  // 스크롤 상태 관리 (스크롤 시 네비게이션 스타일 변경용)
  const [isScrolled, setIsScrolled] = useState(false);
  // 모바일 메뉴 열림/닫힘 상태 관리
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // 로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // 스크롤 이벤트 감지하여 네비게이션 스타일 변경 및 로그인 상태 확인
  // 스크롤 핸들러 - useCallback으로 메모이제이션
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  // 로그인 상태 확인 함수 - useCallback으로 메모이제이션
  const checkLoginStatus = useCallback(() => {
    const token = localStorage.getItem('adminToken');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // 커스텀 이벤트 리스너 추가 (로그인/로그아웃 시 Navbar 업데이트를 위해)
    window.addEventListener('authChange', checkLoginStatus);

    checkLoginStatus(); // 초기 로드 시 확인

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('authChange', checkLoginStatus);
    };
  }, [handleScroll, checkLoginStatus]);

  // 네비게이션 메뉴 항목들 - useMemo로 메모이제이션
  const navLinks = useMemo(() => [
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Stack', href: '/#stack' },
    { name: 'Contact', href: '#contact' },
  ], []);

  // 모바일 메뉴 애니메이션 설정 - useMemo로 메모이제이션
  const menuVariants: Variants = useMemo(() => ({
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }), []);

  // 모바일 메뉴 링크 애니메이션 설정 - useMemo로 메모이제이션
  const linkVariants: Variants = useMemo(() => ({
    closed: { x: -20, opacity: 0 },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.1 }
    })
  }), []);

  // 관리자 클릭 핸들러 - useCallback으로 메모이제이션
  const handleAdminClick = useCallback(() => {
    if (isLoggedIn) {
      navigate('/admin');
    } else {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // 모바일 메뉴 토글 핸들러 - useCallback으로 메모이제이션
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  // 링크 클릭 핸들러 (페이지 이동 또는 스크롤) - useCallback으로 메모이제이션
  const handleLinkClick = useCallback((href: string) => {
    setIsMobileMenuOpen(false);

    if (href.startsWith('/#')) {
      // 해시 링크인 경우
      const hash = href.substring(2);
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.getElementById(hash);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (href.startsWith('#')) {
       const element = document.getElementById(href.substring(1));
       if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // 일반 페이지 이동
      navigate(href);
    }
  }, [navigate, location.pathname]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#F7F7F7]/80 backdrop-blur-xl border-b border-gray-200/50 py-4 shadow-sm'
          : 'bg-transparent py-6'
      }`}
      role="navigation"
      aria-label="메인 네비게이션"
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* 로고 */}
        <a
          href="/"
          className="text-2xl font-bold tracking-tight text-[#222222] group"
          aria-label="포트폴리오 홈페이지로 이동"
        >
          Portfolio<span className="text-[#4A90E2] group-hover:text-[#8E54E9] transition-colors duration-300">.</span>
        </a>

        {/* 데스크톱 네비게이션 */}
        <div className="hidden md:flex items-center space-x-8" role="menubar">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleLinkClick(link.href)}
              className="text-sm font-medium text-[#333333] hover:text-[#4A90E2] transition-colors relative group"
              role="menuitem"
              aria-label={`${link.name} 섹션으로 이동`}
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4A90E2] transition-all duration-300 group-hover:w-full" aria-hidden="true"></span>
            </button>
          ))}
          
          {/* 관리자 버튼 (로그인 상태에 따라 아이콘 변경) */}
          <button
            onClick={handleAdminClick}
            className="p-2 text-[#333333] hover:text-[#4A90E2] transition-colors rounded-full hover:bg-gray-100"
            title={isLoggedIn ? "Admin Dashboard" : "Admin Login"}
            aria-label={isLoggedIn ? "관리자 대시보드" : "관리자 로그인"}
          >
            {isLoggedIn ? <User size={20} aria-hidden="true" /> : <Lock size={20} aria-hidden="true" />}
          </button>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#contact"
            className="px-5 py-2.5 text-sm font-medium bg-[#222222] text-white rounded-full hover:bg-[#4A90E2] transition-colors duration-300 shadow-lg shadow-black/5"
            role="button"
            aria-label="연락처 섹션으로 이동"
          >
            Let's Talk
          </motion.a>
        </div>

        {/* 모바일 메뉴 토글 버튼 */}
        <div className="flex items-center gap-4 md:hidden">
           {/* 모바일에서도 관리자 버튼 표시 */}
           <button
            onClick={handleAdminClick}
            className="p-2 text-[#333333] hover:text-[#4A90E2] transition-colors"
            aria-label={isLoggedIn ? "관리자 대시보드" : "관리자 로그인"}
          >
            {isLoggedIn ? <User size={20} aria-hidden="true" /> : <Lock size={20} aria-hidden="true" />}
          </button>

          <button
            className="text-[#222222] p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "모바일 메뉴 닫기" : "모바일 메뉴 열기"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X size={24} aria-hidden="true" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu size={24} aria-hidden="true" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden absolute top-full left-0 right-0 bg-[#F7F7F7] border-b border-gray-200 shadow-xl overflow-hidden"
            id="mobile-menu"
            role="menu"
            aria-label="모바일 네비게이션 메뉴"
          >
            <div className="flex flex-col p-6 space-y-6">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.name}
                  custom={i}
                  variants={linkVariants}
                  onClick={() => handleLinkClick(link.href)}
                  className="text-xl font-medium text-[#333333] hover:text-[#4A90E2] transition-colors text-left"
                  role="menuitem"
                  aria-label={`${link.name} 섹션으로 이동`}
                >
                  {link.name}
                </motion.button>
              ))}
              <motion.a
                variants={linkVariants}
                custom={3}
                href="#contact"
                className="inline-block text-center px-5 py-3 text-base font-medium bg-[#222222] text-white rounded-xl"
                onClick={() => setIsMobileMenuOpen(false)}
                role="button"
                aria-label="연락처 섹션으로 이동"
              >
                Let's Talk
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
});

// displayName 설정으로 디버깅 시 컴포넌트 식별 용이
Navbar.displayName = 'Navbar';

export default Navbar;