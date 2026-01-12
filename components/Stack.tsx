// 기술 스택 섹션 컴포넌트 - 사용하는 기술들을 카테고리별로 쇼케이스
import React, { useState, useEffect } from 'react';
import { Code2, Database, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Profile } from '../types';

// 카테고리별 아이콘 매핑
const getIconForCategory = (category: string) => {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('language') || categoryLower.includes('언어')) {
    return <Code2 className="w-6 h-6 text-[#4A90E2]" />;
  }
  if (categoryLower.includes('tools') || categoryLower.includes('devops') || categoryLower.includes('도구')) {
    return <Database className="w-6 h-6 text-[#4A90E2]" />;
  }
  // 기본 아이콘
  return <Globe className="w-6 h-6 text-[#4A90E2]" />;
};

const Stack: React.FC = () => {
  const [skills, setSkills] = useState<Profile['skills']>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 프로필에서 기술 스택 데이터 로드
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setSkills(data.skills || []);
        }
      } catch (error) {
        console.error('Failed to load skills:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSkills();
  }, []);

  if (isLoading) {
    return (
      <section id="stack" className="py-20 md:py-32 bg-[#F7F7F7] relative border-y border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-[#333333]/60">Loading skills...</div>
        </div>
      </section>
    );
  }
  return (
    <section id="stack" className="py-20 md:py-32 bg-[#F7F7F7] relative border-y border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <span className="text-[#4A90E2] font-semibold tracking-wider text-xs md:text-sm uppercase mb-2 block">My Arsenal</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#222222]">Technology Stack</h2>
        </motion.div>

        {/* 기술 스택 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* 각 기술 카테고리 매핑 */}
          {skills.map((skill, idx) => (
            <motion.div
              key={skill.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
              className="p-6 md:p-8 rounded-2xl bg-white border border-gray-100 transition-all duration-300 relative overflow-hidden group"
            >
              {/* 배경 장식용 아이콘 */}
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform translate-x-4 -translate-y-4">
                {React.cloneElement(getIconForCategory(skill.category), { className: "w-24 h-24 text-[#4A90E2]" })}
              </div>

              {/* 카테고리 아이콘 */}
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-[#F0F5FA] rounded-xl flex items-center justify-center shadow-inner mb-6 relative z-10"
              >
                {getIconForCategory(skill.category)}
              </motion.div>
              
              {/* 카테고리 제목 */}
              <h3 className="text-xl font-bold text-[#222222] mb-6 relative z-10">{skill.category}</h3>
              {/* 기술 목록 */}
              <ul className="space-y-3 relative z-10">
                {skill.items.map((item, i) => (
                  <motion.li 
                    key={item} 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (i * 0.05) }}
                    className="flex items-center text-[#333333]/80 font-medium text-sm md:text-base"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A3BFD1] mr-3 group-hover:bg-[#4A90E2] transition-colors"></span>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stack;