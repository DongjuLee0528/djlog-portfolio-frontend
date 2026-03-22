/**
 * 기술 스택 섹션 컴포넌트 - 사용하는 기술들을 카테고리별로 쇼케이스
 *
 * 개발자의 기술 스택을 카테고리별로 정리하여 시각적으로 표시하는 컴포넌트입니다.
 * API에서 프로필 데이터를 로드하여 동적으로 기술 스택을 렌더링하며,
 * 각 카테고리별로 적절한 아이콘과 애니메이션을 제공합니다.
 */

import React, { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { Code2, Database, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Profile } from '../src/types';
import { apiClient } from '../utils/apiClient';
import { apiTracker } from '../utils/apiCallTracker';

/**
 * 기술 스택 섹션 컴포넌트
 *
 * @returns 기술 스택을 카테고리별로 표시하는 섹션 JSX
 */
const Stack: React.FC = memo(() => {
  console.log('🔄 Stack 컴포넌트 mount/re-mount');
  const [skills, setSkills] = useState<Profile['skills']>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 카테고리명에 따라 적절한 아이콘을 반환하는 함수
   *
   * 카테고리명에 특정 키워드가 포함되어 있는지 확인하여
   * 해당하는 아이콘 컴포넌트를 반환합니다.
   *
   * @param category - 기술 카테고리명
   * @returns 카테고리에 맞는 아이콘 JSX 요소
   */
  const getIconForCategory = useCallback((category: string) => {
    const categoryLower = category.toLowerCase();

    // 프로그래밍 언어 카테고리
    if (categoryLower.includes('language') || categoryLower.includes('언어')) {
      return <Code2 className="w-6 h-6 text-[#4A90E2]" />;
    }

    // 도구, 데이터베이스, DevOps 카테고리
    if (categoryLower.includes('tools') || categoryLower.includes('devops') || categoryLower.includes('도구')) {
      return <Database className="w-6 h-6 text-[#4A90E2]" />;
    }

    // 기본 아이콘 (웹, 프레임워크 등)
    return <Globe className="w-6 h-6 text-[#4A90E2]" />;
  }, []);

  /**
   * API에서 프로필 데이터를 로드하여 기술 스택 정보를 가져오는 함수
   * 로딩 상태 관리와 에러 처리를 포함합니다.
   */
  // ⚠️ 주의: 이 컴포넌트는 이제 사용되지 않습니다.
  // Home 페이지에서 StackWithData를 사용하여 API 호출을 통합했습니다.
  // 이 코드는 레거시 호환성을 위해 유지되지만 더 이상 사용하지 마세요.

  const loadSkills = useCallback(async () => {
    console.log('📞 [DEPRECATED] Stack: /api/profile 호출 시작 - 이 호출은 중복됩니다!');
    apiTracker.track('/api/profile [DEPRECATED]');
    try {
      const data = await apiClient<Profile>('/api/profile');
      console.log('✅ [DEPRECATED] Stack: /api/profile 응답 완료 - 이 호출은 중복됩니다!');
      setSkills(data.skills || []);
    } catch (error) {
      console.error('Failed to load skills:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 프로필에서 기술 스택 데이터 로드
  useEffect(() => {
    console.log('⚡ [DEPRECATED] Stack: useEffect 실행 - 이 호출은 중복됩니다!');
    loadSkills();
  }, [loadSkills]);

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
    <section
      id="stack"
      className="py-20 md:py-32 bg-[#F7F7F7] relative border-y border-gray-200/50"
      aria-labelledby="stack-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <span className="text-[#4A90E2] font-semibold tracking-wider text-xs md:text-sm uppercase mb-2 block">My Arsenal</span>
          <h2
            id="stack-heading"
            className="text-3xl md:text-4xl font-bold text-[#222222]"
            tabIndex={0}
          >
            Technology Stack
          </h2>
        </motion.div>

        {/* 기술 스택 그리드 */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          role="list"
          aria-label="기술 스택 카테고리 목록"
        >
          {/* 각 기술 카테고리 매핑 */}
          {skills.map((skill, idx) => (
            <motion.article
              key={skill.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
              className="p-6 md:p-8 rounded-2xl bg-white border border-gray-100 transition-all duration-300 relative overflow-hidden group"
              role="listitem"
              aria-labelledby={`skill-category-${idx}`}
              tabIndex={0}
            >
              {/* 배경 장식용 아이콘 */}
              <div
                className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform translate-x-4 -translate-y-4"
                aria-hidden="true"
              >
                {React.cloneElement(getIconForCategory(skill.category), { className: "w-24 h-24 text-[#4A90E2]" })}
              </div>

              {/* 카테고리 아이콘 */}
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-[#F0F5FA] rounded-xl flex items-center justify-center shadow-inner mb-6 relative z-10"
                aria-hidden="true"
              >
                {getIconForCategory(skill.category)}
              </motion.div>
              
              {/* 카테고리 제목 */}
              <h3
                id={`skill-category-${idx}`}
                className="text-xl font-bold text-[#222222] mb-6 relative z-10"
              >
                {skill.category}
              </h3>
              {/* 기술 목록 */}
              <ul
                className="space-y-3 relative z-10"
                role="list"
                aria-label={`${skill.category} 기술 목록`}
              >
                {skill.items.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (i * 0.05) }}
                    className="flex items-center text-[#333333]/80 font-medium text-sm md:text-base"
                    role="listitem"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A3BFD1] mr-3 group-hover:bg-[#4A90E2] transition-colors" aria-hidden="true"></span>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
});

// displayName 설정으로 디버깅 시 컴포넌트 식별 용이
Stack.displayName = 'Stack';

export default Stack;