// 프로젝트 섹션 컴포넌트 - 개인 프로젝트들을 쇼케이스하는 섹션
import React, { useState, useEffect } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../types'; // index.ts는 생략 가능

// 컨테이너 애니메이션 설정
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// 개별 프로젝트 카드 애니메이션 설정
const item: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 20
    }
  }
};

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 프로젝트 데이터 로드
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleProjectClick = (id: number) => {
    navigate(`/project/${id}`);
  };

  if (isLoading) {
    return (
      <section id="projects" className="py-20 md:py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-[#333333]/60">Loading projects...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 md:py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* 섹션 헤더 영역 */}
        <div className="mb-12 md:mb-16 md:flex md:justify-between md:items-end">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#222222] mb-4 md:mb-6">Selected Works</h2>
            <p className="text-base md:text-lg text-[#333333]/70">
              A collection of projects that define my approach to digital product design and development.
            </p>
          </motion.div>
          <motion.a 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            href="#" 
            className="hidden md:flex items-center text-[#4A90E2] font-medium hover:text-[#357ABD] transition-colors mt-4 md:mt-0"
          >
            View GitHub <Github className="ml-2 w-4 h-4" />
          </motion.a>
        </div>

        {/* 프로젝트 그리드 */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {/* 프로젝트 카드들 매핑 */}
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={item}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              onClick={() => handleProjectClick(project.id)}
              className="group bg-[#F7F7F7] rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#4A90E2]/10 transition-all duration-300 cursor-pointer"
            >
              {/* 프로젝트 이미지 영역 */}
              <div className="aspect-video w-full overflow-hidden relative">
                 <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <motion.span 
                      whileHover={{ scale: 1.1 }}
                      className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-semibold text-[#222222] shadow-lg"
                    >
                      View Case Study
                    </motion.span>
                </div>
              </div>
              
              {/* 프로젝트 정보 영역 */}
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-[#222222] group-hover:text-[#4A90E2] transition-colors">
                    {project.title}
                  </h3>
                  <motion.div 
                    whileHover={{ rotate: 45, color: "#4A90E2" }}
                    className="text-[#A3BFD1] transition-colors"
                  >
                    <ExternalLink size={20} />
                  </motion.div>
                </div>
                
                <p className="text-sm md:text-base text-[#333333]/80 mb-6 leading-relaxed">
                  {project.description}
                </p>
                
                {/* 기술 스택 태그 */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2.5 py-1 bg-white text-[#333333] text-xs font-medium rounded-full border border-gray-200 shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* 모바일에서만 보이는 GitHub 링크 */}
        <div className="mt-12 text-center md:hidden">
             <a href="#" className="inline-flex items-center text-[#4A90E2] font-medium hover:text-[#357ABD] transition-colors">
            View All on GitHub <Github className="ml-2 w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;