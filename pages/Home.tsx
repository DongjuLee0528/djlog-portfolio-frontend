// 메인 홈 페이지 컴포넌트
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Stack from '../components/Stack';
import Contact from '../components/Contact';

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Stack />
      </main>
      <Contact />
    </>
  );
};

export default Home;