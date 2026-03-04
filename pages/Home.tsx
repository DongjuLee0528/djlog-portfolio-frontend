// 메인 홈 페이지 컴포넌트
import React, { memo } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Stack from '../components/Stack';
import Contact from '../components/Contact';

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