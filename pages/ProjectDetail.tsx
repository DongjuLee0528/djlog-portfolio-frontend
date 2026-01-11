// 프로젝트 상세 페이지 컴포넌트 - Q&A 아코디언 스타일
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink, Github, Calendar, Users, Code2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../types';


const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 아코디언 상태 관리 (기본적으로 첫 번째 질문은 열려있음)
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // 프로젝트 데이터 로드
  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/projects/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          setProject(null);
        }
      } catch (error) {
        console.error('Failed to load project:', error);
        setProject(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // 스크롤을 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="text-center">
          <div className="text-[#333333]/60">Loading project...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#222222] mb-4">Project Not Found</h2>
          <button 
            onClick={() => navigate('/')}
            className="text-[#4A90E2] hover:underline flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white min-h-screen"
    >
      {/* 네비게이션 바 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center px-6 md:px-12">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#333333] hover:text-[#4A90E2] transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Back to Projects</span>
        </button>
      </nav>

      {/* 헤더 이미지 영역 */}
      <header className="relative w-full h-[40vh] md:h-[50vh] mt-16 bg-gray-100">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
          <div className="max-w-4xl mx-auto w-full px-6 md:px-8 pb-12">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-white mb-3"
            >
              {project.title}
            </motion.h1>
<motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-white/90 font-light"
            >
              {project.description}
            </motion.p>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-6 md:px-8 py-12 md:py-20">
        
        {/* 프로젝트 기본 정보 (가로 스크롤 가능) */}
        <div className="flex flex-wrap gap-y-6 gap-x-12 mb-16 pb-8 border-b border-gray-100">
<div>
            <h3 className="text-xs font-bold text-[#4A90E2] uppercase tracking-wider mb-2 flex items-center gap-2">
              <Users size={14} /> Category
            </h3>
            <p className="text-[#333333] font-medium">{project.category || 'General'}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#4A90E2] uppercase tracking-wider mb-2 flex items-center gap-2">
              <Calendar size={14} /> Status
            </h3>
            <p className="text-[#333333] font-medium">{project.status || 'Published'}</p>
          </div>
          <div className="flex-1 min-w-[200px]">
             <h3 className="text-xs font-bold text-[#4A90E2] uppercase tracking-wider mb-2 flex items-center gap-2">
              <Code2 size={14} /> Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-[#F7F7F7] text-[#333333] text-xs font-medium rounded-md border border-gray-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {(project.githubLinks && project.githubLinks.length > 0) || project.demoLink ? (
            <div className="flex gap-3 items-end">
              {project.demoLink && (
                <a href={project.demoLink} className="p-2 bg-[#222222] text-white rounded-full hover:bg-black transition-colors" title="Live Demo">
                  <ExternalLink size={18} />
                </a>
              )}
              {project.githubLinks && project.githubLinks.map((link, idx) => (
                <a key={idx} href={link.url} className="p-2 bg-white border border-gray-200 text-[#333333] rounded-full hover:border-[#4A90E2] hover:text-[#4A90E2] transition-colors" title={link.label}>
                  <Github size={18} />
                </a>
              ))}
            </div>
          ) : null}
        </div>

        {/* Q&A 아코디언 섹션 */}
        {project.qna && project.qna.length > 0 && (
          <section className="space-y-4">
            {project.qna.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className={`text-lg md:text-xl font-bold ${openIndex === index ? 'text-[#4A90E2]' : 'text-[#222222]'}`}>
                  {item.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="text-[#4A90E2]" />
                ) : (
                  <ChevronDown className="text-[#333333]/40" />
                )}
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-6 pt-0 text-[#333333]/80 leading-relaxed border-t border-gray-100/50">
                      <p className="whitespace-pre-wrap">{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            ))}
          </section>
        )}

      </main>
      
      {/* 하단 네비게이션 (다음 프로젝트) */}
      <footer className="bg-[#F7F7F7] py-20 border-t border-gray-200 mt-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-sm font-bold text-[#333333]/50 uppercase tracking-widest mb-4">Next Project</h3>
          <button 
            onClick={() => navigate(`/project/${Number(id) + 1 > 2 ? 1 : Number(id) + 1}`)}
            className="text-3xl md:text-4xl font-bold text-[#222222] hover:text-[#4A90E2] transition-colors inline-flex items-center gap-3"
          >
            Next Work
            <ArrowRight size={28} />
          </button>
        </div>
      </footer>
    </motion.div>
  );
};

export default ProjectDetail;