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

import React, { memo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Contact from '../components/Contact';
import type { Project, Profile } from '../src/types';
import { normalizeProjects, normalizeProfile } from '../utils/normalize';
import config from '../src/config';
import { apiTracker } from '../utils/apiCallTracker';

/**
 * 홈 페이지 컴포넌트
 *
 * @returns 전체 홈 페이지 레이아웃과 섹션들을 포함한 JSX
 */
// Projects 컴포넌트 (props로 데이터 받음)
const ProjectsWithData: React.FC<{ projects: Project[], isLoading: boolean, onProjectClick: (id?: string) => void }> = memo(({ projects, isLoading, onProjectClick }) => {
  console.log('🔄 ProjectsWithData 컴포넌트 mount/re-mount (props로 데이터 받음)');

  if (isLoading) {
    return (
      <section id="projects" className="py-20 md:py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-[#4A90E2]/30 border-t-[#4A90E2] rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 md:py-32 px-6 bg-white" aria-labelledby="projects-heading">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 md:mb-16 md:flex md:justify-between md:items-end">
          <div className="max-w-2xl">
            <h2 id="projects-heading" className="text-3xl md:text-4xl font-bold text-[#222222] mb-4 md:mb-6" tabIndex={0}>
              Selected Works
            </h2>
            <p className="text-base md:text-lg text-[#333333]/70">
              A collection of projects that define my approach to digital product design and development.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8" role="list" aria-label="프로젝트 목록">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-[#F7F7F7] rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer"
              role="listitem"
              tabIndex={0}
              onClick={() => onProjectClick(project.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onProjectClick(project.id);
                }
              }}
            >
              <div className="aspect-video w-full overflow-hidden relative">
                <img src={project.image} alt={`${project.title} 프로젝트 스크린샷`} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-[#222222] group-hover:text-[#4A90E2] transition-colors">
                    {project.title}
                  </h3>
                </div>
                <p className="text-sm md:text-base text-[#333333]/80 mb-6 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-white text-[#333333] text-xs font-medium rounded-full border border-gray-200 shadow-sm">
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
const StackWithData: React.FC<{ skills: Profile['skills'], isLoading: boolean }> = memo(({ skills, isLoading }) => {
  console.log('🔄 StackWithData 컴포넌트 mount/re-mount (props로 데이터 받음)');

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
    <section id="stack" className="py-20 md:py-32 bg-[#F7F7F7] relative border-y border-gray-200/50" aria-labelledby="stack-heading">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-20">
          <span className="text-[#4A90E2] font-semibold tracking-wider text-xs md:text-sm uppercase mb-2 block">My Arsenal</span>
          <h2 id="stack-heading" className="text-3xl md:text-4xl font-bold text-[#222222]" tabIndex={0}>
            Technology Stack
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8" role="list" aria-label="기술 스택 카테고리 목록">
          {skills.map((skill, idx) => (
            <div key={skill.category} className="p-6 md:p-8 rounded-2xl bg-white border border-gray-100 transition-all duration-300 relative overflow-hidden group" role="listitem">
              <h3 className="text-xl font-bold text-[#222222] mb-6 relative z-10">{skill.category}</h3>
              <ul className="space-y-3 relative z-10" role="list">
                {skill.items.map((item, i) => (
                  <li key={item} className="flex items-center text-[#333333]/80 font-medium text-sm md:text-base" role="listitem">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A3BFD1] mr-3 group-hover:bg-[#4A90E2] transition-colors" aria-hidden="true"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

const Home: React.FC = memo(() => {
  console.log('🔄 Home 컴포넌트 mount/re-mount');
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 모든 데이터를 한 번에 로드
  const loadAllData = useCallback(async () => {
    console.log('📞 Home: 통합 API 호출 시작');

    try {
      // 병렬로 API 호출
      apiTracker.track('/api/projects');
      apiTracker.track('/api/profile');

      const [projectsResponse, profileResponse] = await Promise.all([
        fetch(`${config.API_URL}/api/projects`),
        fetch(`${config.API_URL}/api/profile`)
      ]);

      console.log('✅ Home: 모든 API 응답 완료');

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        const normalizedProjects = normalizeProjects(projectsData);
        setProjects(normalizedProjects.filter((project) => project.status === 'PUBLISHED'));
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
    console.log('⚡ Home: useEffect 실행 - loadAllData 호출');
    loadAllData();
  }, [loadAllData]);

  const handleProjectClick = useCallback((id?: string) => {
    if (!id) return;
    navigate(`/project/${id}`);
  }, [navigate]);

  return (
    <>
      <Navbar />
      <main role="main" aria-label="메인 콘텐츠">
        <Hero />
        <ProjectsWithData projects={projects} isLoading={isLoading} onProjectClick={handleProjectClick} />
        {profile && <StackWithData skills={profile.skills} isLoading={isLoading} />}
      </main>
      <Contact />
    </>
  );
});

// displayName 설정으로 디버깅 시 컴포넌트 식별 용이
Home.displayName = 'Home';
ProjectsWithData.displayName = 'ProjectsWithData';
StackWithData.displayName = 'StackWithData';

export default Home;
