/**
 * 최적화된 홈 페이지 컴포넌트 - API 호출을 상위에서 통합 관리
 */

import React, { memo, useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Contact from '../components/Contact';
import type { Project, Profile } from '../src/types';
import { normalizeProjects, normalizeProfile } from '../utils/normalize';
import config from '../src/config';

// Projects 컴포넌트 (props로 데이터 받음)
const ProjectsOptimized: React.FC<{ projects: Project[] }> = memo(({ projects }) => {
  console.log('🔄 ProjectsOptimized 컴포넌트 mount/re-mount (props로 데이터 받음)');

  // 기존 Projects 컴포넌트의 렌더링 로직만 사용
  return (
    <section id="projects" className="py-20 md:py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#222222] mb-4">
            Selected Works
          </h2>
          <p className="text-base md:text-lg text-[#333333]/70">
            A collection of projects that define my approach to digital product design and development.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-[#F7F7F7] rounded-2xl overflow-hidden">
              <div className="aspect-video w-full">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#222222] mb-2">{project.title}</h3>
                <p className="text-sm text-[#333333]/80 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white text-[#333333] text-xs rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

// Stack 컴포넌트 (props로 데이터 받음)
const StackOptimized: React.FC<{ skills: Profile['skills'] }> = memo(({ skills }) => {
  console.log('🔄 StackOptimized 컴포넌트 mount/re-mount (props로 데이터 받음)');

  return (
    <section id="stack" className="py-20 md:py-32 bg-[#F7F7F7]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#222222]">Technology Stack</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, idx) => (
            <div key={skill.category} className="p-6 rounded-2xl bg-white">
              <h3 className="text-xl font-bold text-[#222222] mb-4">{skill.category}</h3>
              <ul className="space-y-2">
                {skill.items.map((item, i) => (
                  <li key={item} className="text-[#333333]/80 text-sm">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

/**
 * 최적화된 홈 페이지 컴포넌트
 * - 모든 API 호출을 Home에서 통합 관리
 * - 하위 컴포넌트들은 props로 데이터 전달받음
 */
const HomeOptimized: React.FC = memo(() => {
  console.log('🔄 HomeOptimized 컴포넌트 mount/re-mount');

  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 모든 데이터를 한 번에 로드
  const loadAllData = useCallback(async () => {
    console.log('📞 HomeOptimized: 통합 API 호출 시작');

    try {
      // 병렬로 API 호출
      const [projectsResponse, profileResponse] = await Promise.all([
        fetch(`${config.API_URL}/api/projects`),
        fetch(`${config.API_URL}/api/profile`)
      ]);

      console.log('✅ HomeOptimized: 모든 API 응답 완료');

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(normalizeProjects(projectsData));
      }

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(normalizeProfile(profileData));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('⚡ HomeOptimized: useEffect 실행 - loadAllData 호출');
    loadAllData();
  }, [loadAllData]);

  if (isLoading) {
    return (
      <div className="bg-[#F7F7F7] min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4A90E2]/30 border-t-[#4A90E2] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main role="main" aria-label="메인 콘텐츠">
        <Hero />
        <ProjectsOptimized projects={projects} />
        {profile && <StackOptimized skills={profile.skills} />}
      </main>
      <Contact />
    </>
  );
});

HomeOptimized.displayName = 'HomeOptimized';
ProjectsOptimized.displayName = 'ProjectsOptimized';
StackOptimized.displayName = 'StackOptimized';

export default HomeOptimized;