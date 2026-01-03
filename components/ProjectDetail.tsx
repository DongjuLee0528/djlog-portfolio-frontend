// 프로젝트 상세 페이지 컴포넌트 - Q&A 아코디언 스타일
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink, Github, Calendar, Users, Code2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 프로젝트 데이터 타입 정의
interface ProjectData {
  id: number;
  title: string;
  subtitle: string;
  role: string;
  timeline: string;
  team: string;
  image: string;
  tags: string[];
  links: { demo: string; github: string };
  // Q&A 형식의 데이터 구조
  qna: {
    question: string;
    answer: React.ReactNode; // JSX를 포함할 수 있도록 변경
  }[];
}

// 임시 프로젝트 데이터
const projectsData: Record<string, ProjectData> = {
  "1": {
    id: 1,
    title: "Linear Clone",
    subtitle: "High-performance Issue Tracking App",
    role: "Full Stack Developer",
    timeline: "2023.08 - 2023.10 (8 weeks)",
    team: "Solo Project",
    image: "https://picsum.photos/1200/600?random=1",
    tags: ["React", "Next.js", "Tailwind", "Supabase", "Framer Motion"],
    links: { demo: "#", github: "#" },
    qna: [
      {
        question: "Q. 어떤 프로젝트인가요?",
        answer: (
          <div className="space-y-4">
            <p>
              Linear의 미니멀한 디자인과 빠른 성능에 영감을 받아 제작한 <strong>이슈 트래킹 애플리케이션</strong>입니다.
            </p>
            <p>
              기존의 복잡한 프로젝트 관리 도구들과 달리, 개발자들이 키보드만으로 빠르게 작업을 처리할 수 있는 경험을 제공하는 것을 목표로 했습니다. 실시간 동기화 기능을 통해 팀원 간의 협업 효율성을 극대화했습니다.
            </p>
          </div>
        )
      },
      {
        question: "Q. 나의 역할은 무엇이었나요?",
        answer: (
          <div className="space-y-4">
            <p>
              <strong>1인 개발(Full Stack)</strong>로 기획부터 디자인, 프론트엔드, 백엔드 개발까지 전 과정을 담당했습니다.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>UI/UX 디자인 및 시스템 설계</li>
              <li>Supabase를 활용한 실시간 데이터베이스 구축</li>
              <li>Next.js 기반의 SSR/CSR 하이브리드 렌더링 구현</li>
              <li>복잡한 상태 관리를 위한 커스텀 훅 설계</li>
            </ul>
          </div>
        )
      },
      {
        question: "Q. 왜 이 기술을 사용했나요?",
        answer: (
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-[#222222] mb-1">Next.js & React</h4>
              <p>초기 로딩 속도와 SEO가 중요했기 때문에 서버 사이드 렌더링(SSR)이 가능한 Next.js를 선택했습니다.</p>
            </div>
            <div>
              <h4 className="font-bold text-[#222222] mb-1">Supabase</h4>
              <p>별도의 백엔드 서버 구축 없이도 강력한 실시간(Real-time) 기능과 인증 시스템을 빠르게 구현하기 위해 선택했습니다. WebSocket을 직접 다루는 것보다 개발 생산성이 3배 이상 높았습니다.</p>
            </div>
          </div>
        )
      },
      {
        question: "Q. 가장 어려웠던 점과 해결 방법은?",
        answer: (
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <h4 className="font-bold text-red-800 mb-2">Challenge: 실시간 데이터 동기화의 복잡성</h4>
              <p className="text-red-700 text-sm">
                여러 사용자가 동시에 이슈 상태를 변경할 때, 화면이 깜빡이거나 데이터가 꼬이는 문제가 발생했습니다.
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-bold text-blue-800 mb-2">Solution: Optimistic UI & React Query</h4>
              <p className="text-blue-700 text-sm">
                서버 응답을 기다리지 않고 UI를 먼저 업데이트하는 <strong>Optimistic Update(낙관적 업데이트)</strong> 패턴을 적용했습니다. React Query의 캐싱 전략과 결합하여, 사용자는 네트워크 지연 없이 즉각적인 반응을 경험할 수 있게 되었습니다.
              </p>
            </div>
          </div>
        )
      },
      {
        question: "Q. 이 프로젝트를 통해 무엇을 배웠나요?",
        answer: (
          <div className="space-y-4">
            <p>
              단순히 기능 구현을 넘어, <strong>사용자 경험(UX)이 기술적 결정에 미치는 영향</strong>을 깊이 이해하게 되었습니다.
            </p>
            <p>
              특히 실시간 동기화 기능을 구현하면서 WebSocket의 연결 관리와 에러 처리에 대한 깊은 지식을 쌓았으며, 낙관적 업데이트를 통해 네트워크 지연을 사용자에게 숨기는 패턴을 익혔습니다. 이는 앞으로 더 복잡한 실시간 애플리케이션을 구축하는 데 큰 자산이 될 것입니다.
            </p>
          </div>
        )
      },
      {
        question: "Q. 아쉬운 점이나 향후 개선 계획은?",
        answer: (
          <div className="space-y-4">
            <p>
              현재는 MVP 단계라 <strong>테스트 코드(Test Coverage)</strong>가 부족한 점이 가장 아쉽습니다.
            </p>
            <p>
              빠른 기능 구현에 집중하느라 유닛 테스트와 통합 테스트를 충분히 작성하지 못했습니다. 향후에는 Jest와 Cypress를 도입하여 핵심 기능에 대한 E2E 테스트를 구축하고, CI/CD 파이프라인에 자동화된 테스트 과정을 추가하여 프로젝트의 안정성을 높일 계획입니다.
            </p>
          </div>
        )
      }
    ]
  },
  "2": {
    id: 2,
    title: "FinTech Dashboard",
    subtitle: "Financial Analytics Platform",
    role: "Frontend Lead",
    timeline: "2023.11 - 2024.01 (10 weeks)",
    team: "4 Members (2 FE, 2 BE)",
    image: "https://picsum.photos/1200/600?random=2",
    tags: ["TypeScript", "D3.js", "Node.js", "PostgreSQL", "Redis"],
    links: { demo: "#", github: "#" },
    qna: [
      {
        question: "Q. 어떤 프로젝트인가요?",
        answer: "핀테크 스타트업을 위한 기업용 금융 분석 대시보드입니다. 복잡한 금융 데이터를 시각화하여 의사결정권자가 한눈에 자산 흐름을 파악할 수 있도록 돕습니다."
      },
      {
        question: "Q. 나의 역할은 무엇이었나요?",
        answer: "프론트엔드 리드로서 프로젝트 아키텍처를 설계하고, 핵심 차트 컴포넌트 개발을 주도했습니다. 또한 백엔드 팀과의 API 명세 협의를 담당했습니다."
      },
      {
        question: "Q. 왜 이 기술을 사용했나요?",
        answer: "대량의 데이터를 처리해야 했기 때문에 타입 안정성이 보장되는 TypeScript를 도입했습니다. 차트 라이브러리로는 커스터마이징 자유도가 가장 높은 D3.js를 선택하여 디자이너의 요구사항을 100% 구현했습니다."
      },
      {
        question: "Q. 가장 어려웠던 점과 해결 방법은?",
        answer: "10,000개 이상의 데이터 포인트를 렌더링할 때 브라우저가 멈추는 현상이 있었습니다. 이를 해결하기 위해 SVG 대신 Canvas API를 사용하여 렌더링 성능을 최적화했고, 데이터 샘플링 알고리즘을 적용하여 시각적 왜곡 없이 데이터 양을 줄였습니다."
      },
      {
        question: "Q. 이 프로젝트를 통해 무엇을 배웠나요?",
        answer: "대규모 데이터 시각화 프로젝트를 통해 브라우저 렌더링 파이프라인과 성능 최적화 기법에 대해 깊이 있게 학습했습니다. 또한 리드 역할을 수행하며 팀원 간의 코드 리뷰 문화를 정착시키는 경험을 했습니다."
      },
      {
        question: "Q. 아쉬운 점이나 향후 개선 계획은?",
        answer: "현재는 데이터가 로컬 상태로만 관리되고 있어, 페이지 새로고침 시 필터 설정이 초기화되는 불편함이 있습니다. 향후에는 URL 쿼리 파라미터와 연동하여 사용자가 보고 있는 차트 상태를 공유할 수 있는 기능을 추가하고 싶습니다."
      }
    ]
  }
};

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = id ? projectsData[id] : null;
  
  // 아코디언 상태 관리 (기본적으로 첫 번째 질문은 열려있음)
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // 스크롤을 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              {project.subtitle}
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
              <Users size={14} /> Role
            </h3>
            <p className="text-[#333333] font-medium">{project.role}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#4A90E2] uppercase tracking-wider mb-2 flex items-center gap-2">
              <Calendar size={14} /> Timeline
            </h3>
            <p className="text-[#333333] font-medium">{project.timeline}</p>
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
          <div className="flex gap-3 items-end">
             <a href={project.links.demo} className="p-2 bg-[#222222] text-white rounded-full hover:bg-black transition-colors" title="Live Demo">
                <ExternalLink size={18} />
              </a>
              <a href={project.links.github} className="p-2 bg-white border border-gray-200 text-[#333333] rounded-full hover:border-[#4A90E2] hover:text-[#4A90E2] transition-colors" title="GitHub Repo">
                <Github size={18} />
              </a>
          </div>
        </div>

        {/* Q&A 아코디언 섹션 */}
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
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </section>

      </main>
      
      {/* 하단 네비게이션 (다음 프로젝트) */}
      <footer className="bg-[#F7F7F7] py-20 border-t border-gray-200 mt-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-sm font-bold text-[#333333]/50 uppercase tracking-widest mb-4">Next Project</h3>
          <button 
            onClick={() => navigate(`/project/${Number(id) + 1 > 2 ? 1 : Number(id) + 1}`)}
            className="text-3xl md:text-4xl font-bold text-[#222222] hover:text-[#4A90E2] transition-colors inline-flex items-center gap-3"
          >
            {projectsData[String(Number(id) + 1 > 2 ? 1 : Number(id) + 1)]?.title || "Next Work"}
            <ArrowRight size={28} />
          </button>
        </div>
      </footer>
    </motion.div>
  );
};

export default ProjectDetail;