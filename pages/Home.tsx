/**
 * 메인 홈 페이지 컴포넌트
 *
 * 포트폴리오 사이트의 메인 페이지로, 다음 섹션들을 순서대로 렌더링합니다:
 * - 네비게이션 바
 * - 히어로 섹션 (3D 모델과 소개)
 * - 프로젝트 섹션
 * - 기술 스택 섹션
 * - 연락처/푸터 섹션
 *
 * React.memo를 사용하여 불필요한 리렌더링을 방지합니다.
 */

import React, { memo } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Stack from '../components/Stack';
import Contact from '../components/Contact';

/**
 * 홈 페이지 컴포넌트
 *
 * @returns 전체 홈 페이지 레이아웃과 섹션들을 포함한 JSX
 */
const Home: React.FC = memo(() => {
  return (
    <>
      <Navbar />
      <main role="main" aria-label="메인 콘텐츠">
        <Hero />
        <Projects />
        <Stack />
      </main>
      <Contact />
    </>
  );
});

// displayName 설정으로 디버깅 시 컴포넌트 식별 용이
Home.displayName = 'Home';

export default Home;