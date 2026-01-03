// 메인 히어로 섹션 컴포넌트 - 랜딩 페이지의 상단 섹션
import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const Hero: React.FC = () => {
  // 3D 모델 로딩 상태 관리
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  // WebGL 오류나 로딩 지연을 위한 폴백 상태
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // 3D 모델 로딩이 5초 이상 걸리면 폴백 UI 표시 (WebGL 오류 가능성 대비)
    const timer = setTimeout(() => {
      if (!isModelLoaded) {
        setShowFallback(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isModelLoaded]);

  // 컨테이너 애니메이션 설정
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  // 개별 아이템 애니메이션 설정
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 50 }
    },
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-center pt-20 md:pt-0 overflow-hidden bg-[#F7F7F7]">
      
      {/* 텍스트 콘텐츠 영역 */}
      <div className="w-full md:w-1/2 px-6 md:pl-20 lg:pl-32 z-10 flex flex-col justify-center h-full order-2 md:order-1 mt-6 md:mt-0 pb-16 md:pb-0">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 mb-4 md:mb-6 rounded-full bg-white border border-[#A3BFD1]/40 shadow-sm">
            <span className="flex items-center text-[10px] md:text-xs font-bold text-[#4A90E2] uppercase tracking-wider gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4A90E2] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4A90E2]"></span>
              </span>
              System Online
            </span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#222222] leading-[1.1] mb-6 tracking-tight">
            Designing the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#8E54E9]">
              Next Generation
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-base md:text-xl text-[#333333]/70 max-w-lg mb-8 leading-relaxed">
            I build interactive digital experiences that bridge the gap between imagination and reality using modern web technologies.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto justify-center group inline-flex items-center gap-2 px-8 py-4 bg-[#222222] text-white rounded-full font-medium transition-all shadow-xl shadow-[#222222]/20"
            >
              View Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto justify-center inline-flex px-8 py-4 bg-white border border-gray-200 text-[#333333] rounded-full font-medium hover:border-[#4A90E2] hover:text-[#4A90E2] transition-colors shadow-sm"
            >
              Contact Me
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* React 상태로 제어되는 3D 모델 컨테이너 */}
      <div className="w-full md:w-1/2 h-[45vh] md:h-screen relative order-1 md:order-2 flex items-center justify-center">
        {/* 로딩 상태 UI */}
        {!isModelLoaded && !showFallback && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#F7F7F7]"
          >
            <Loader2 className="w-10 h-10 text-[#4A90E2] animate-spin mb-4" />
            <span className="text-sm font-medium text-[#333333]/50 animate-pulse">Initializing 3D Core...</span>
          </motion.div>
        )}

        {/* 폴백 UI: WebGL 오류 또는 로딩 지연 시 표시 */}
        {showFallback && (
           <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#F7F7F7]"
          >
            <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-[#4A90E2]/20 to-[#8E54E9]/20 blur-3xl absolute" />
            <div className="relative z-10 flex flex-col items-center text-center p-8">
               <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-4 rotate-12 border border-gray-100">
                  <AlertCircle className="w-10 h-10 text-[#4A90E2]" />
               </div>
               <h3 className="text-lg font-bold text-[#222222] mb-2">3D View Unavailable</h3>
               <p className="text-sm text-[#333333]/60 max-w-xs leading-relaxed">
                 Hardware acceleration is disabled or the model took too long to load.
               </p>
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isModelLoaded && !showFallback ? 1 : 0, scale: isModelLoaded && !showFallback ? 1 : 0.9 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-full h-full relative z-10"
        >
          {/* React로 제어되는 iframe 래퍼 */}
          <iframe 
            src='https://my.spline.design/nexbotrobotcharacterconcept-72z3BqqZUIvis9fttTj7ONMW/' 
            frameBorder='0' 
            width='100%' 
            height='100%'
            className="w-full h-full pointer-events-auto"
            title="Spline 3D Robot"
            onLoad={() => setIsModelLoaded(true)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; xr-spatial-tracking; fullscreen"
            allowFullScreen
          />
        </motion.div>
        
        {/* 자연스러운 통합을 위한 그라디언트 오버레이 */}
        <div className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-b from-transparent via-transparent to-[#F7F7F7] md:bg-gradient-to-l md:to-transparent md:from-transparent md:via-transparent" />
      </div>

    </section>
  );
};

export default Hero;