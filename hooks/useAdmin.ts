import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project, Profile } from '../types';

export const useAdmin = () => {
  const navigate = useNavigate();
  
  // --- 프로젝트 관련 상태 ---
  const [projects, setProjects] = useState<Project[]>([
    { 
      id: 1, 
      title: "Linear Clone", 
      category: "Web App", 
      status: "Published", 
      description: "A high-performance issue tracking application.",
      tags: ["React", "Next.js"],
      image: "https://picsum.photos/1200/600?random=1",
      links: [
        { label: "GitHub Repo", url: "https://github.com/user/linear-clone", description: "메인 소스코드 저장소" },
        { label: "Live Demo", url: "https://linear-clone.vercel.app", description: "Vercel 배포 사이트" }
      ],
      qna: [
        { 
          question: 'Q. 어떤 프로젝트인가요?', 
          answer: 'Linear의 미니멀한 디자인과 빠른 성능에 영감을 받아 제작한 이슈 트래킹 애플리케이션입니다. 개발자들이 키보드만으로 빠르게 작업을 처리할 수 있는 경험을 제공하는 것을 목표로 했습니다.' 
        },
        { 
          question: 'Q. 나의 역할은 무엇이었나요?', 
          answer: '1인 개발(Full Stack)로 기획부터 디자인, 프론트엔드, 백엔드 개발까지 전 과정을 담당했습니다. UI/UX 디자인 및 시스템 설계, Supabase를 활용한 실시간 데이터베이스 구축 등을 수행했습니다.' 
        },
        { 
          question: 'Q. 왜 이 기술을 사용했나요?', 
          answer: '초기 로딩 속도와 SEO가 중요했기 때문에 Next.js를 선택했습니다. 또한 별도의 백엔드 서버 구축 없이 실시간 기능을 구현하기 위해 Supabase를 도입했습니다.' 
        },
        { 
          question: 'Q. 가장 어려웠던 점과 해결 방법은?', 
          answer: '실시간 데이터 동기화 시 화면 깜빡임 문제가 있었습니다. 이를 해결하기 위해 React Query의 Optimistic Update(낙관적 업데이트) 패턴을 적용하여 사용자 경험을 개선했습니다.' 
        }
      ]
    },
    { 
      id: 2, 
      title: "FinTech Dashboard", 
      category: "Dashboard", 
      status: "Published", 
      description: "Comprehensive financial analytics dashboard.",
      tags: ["TypeScript", "D3.js"],
      image: "https://picsum.photos/1200/600?random=2",
      links: [
        { label: "Frontend Repo", url: "https://github.com/user/fintech-fe", description: "프론트엔드 코드" },
        { label: "Backend Repo", url: "https://github.com/user/fintech-be", description: "백엔드 API 서버 코드" },
        { label: "API Docs", url: "https://api.fintech.com/docs", description: "Swagger API 문서" }
      ],
      qna: [
        { 
          question: 'Q. 어떤 프로젝트인가요?', 
          answer: '핀테크 스타트업을 위한 기업용 금융 분석 대시보드입니다. 복잡한 금융 데이터를 시각화하여 의사결정권자가 한눈에 자산 흐름을 파악할 수 있도록 돕습니다.' 
        },
        { 
          question: 'Q. 나의 역할은 무엇이었나요?', 
          answer: '프론트엔드 리드로서 프로젝트 아키텍처를 설계하고, 핵심 차트 컴포넌트 개발을 주도했습니다.' 
        },
        { 
          question: 'Q. 왜 이 기술을 사용했나요?', 
          answer: '대량의 데이터를 처리해야 했기 때문에 타입 안정성이 보장되는 TypeScript를 도입했습니다. 차트 라이브러리로는 커스터마이징 자유도가 높은 D3.js를 선택했습니다.' 
        },
        { 
          question: 'Q. 가장 어려웠던 점과 해결 방법은?', 
          answer: '대량의 데이터 렌더링 시 성능 저하 문제가 있어, SVG 대신 Canvas API를 사용하여 렌더링 성능을 최적화했습니다.' 
        }
      ]
    },
  ]);

  // --- 프로필 관련 상태 ---
  const [profile, setProfile] = useState<Profile>({
    name: "Dongju Lee",
    // role 삭제됨
    bio: "Building digital products with clean code and thoughtful design.",
    about: "안녕하세요, 저는 문제를 구조적으로 해결하는 것을 좋아하는 개발자 이동주입니다. \n\n복잡한 요구사항을 명확한 시스템으로 변환하고, 사용자에게 실질적인 가치를 제공하는 제품을 만드는 데 열정을 가지고 있습니다. \n\n새로운 기술을 배우는 것을 두려워하지 않으며, 팀원들과의 소통을 통해 함께 성장하는 문화를 지향합니다.",
    email: "contact@example.com",
    github: "https://github.com",
    education: [
      { school: "Computer Science Univ", degree: "Bachelor of Science", period: "2018 - 2022" }
    ],
    certificates: [
      { name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "2023.05" }
    ],
    skills: [
      { category: "Frontend", items: ["React", "TypeScript", "Next.js", "Tailwind CSS"] },
      { category: "Backend", items: ["Node.js", "NestJS", "PostgreSQL", "Redis"] },
      { category: "DevOps", items: ["Docker", "AWS", "GitHub Actions"] }
    ]
  });

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // 프로필 모달 상태
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // 폼 상태 관리 (프로젝트)
  const [formData, setFormData] = useState<Project>({
    id: 0,
    title: '',
    category: '',
    status: 'Draft',
    description: '',
    tags: [],
    image: '',
    links: [{ label: 'GitHub', url: '', description: '' }],
    qna: [
      { question: 'Q. 어떤 프로젝트인가요?', answer: '' },
      { question: 'Q. 나의 역할은 무엇이었나요?', answer: '' },
      { question: 'Q. 왜 이 기술을 사용했나요?', answer: '' },
      { question: 'Q. 가장 어려웠던 점과 해결 방법은?', answer: '' }
    ]
  });

  // 폼 상태 관리 (프로필)
  const [profileFormData, setProfileFormData] = useState<Profile>(profile);

  // 관리자 권한 체크
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert("접근 권한이 없습니다. 관리자 로그인이 필요합니다.");
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
      localStorage.removeItem('adminToken');
      window.dispatchEvent(new Event('authChange')); // Navbar 업데이트
      navigate('/');
    }
  };

  // --- 프로젝트 관련 핸들러 ---
  const handleDelete = (id: number) => {
    if (window.confirm("이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        ...project,
        image: project.image || '',
        links: project.links && project.links.length > 0 ? project.links : [{ label: 'GitHub', url: '', description: '' }],
        qna: project.qna && project.qna.length > 0 ? project.qna : [
          { question: 'Q. 어떤 프로젝트인가요?', answer: '' },
          { question: 'Q. 나의 역할은 무엇이었나요?', answer: '' },
          { question: 'Q. 왜 이 기술을 사용했나요?', answer: '' },
          { question: 'Q. 가장 어려웠던 점과 해결 방법은?', answer: '' }
        ]
      });
    } else {
      setEditingProject(null);
      setFormData({
        id: 0,
        title: '',
        category: '',
        status: 'Draft',
        description: '',
        tags: [],
        image: '',
        links: [{ label: 'GitHub', url: '', description: '' }],
        qna: [
          { question: 'Q. 어떤 프로젝트인가요?', answer: '' },
          { question: 'Q. 나의 역할은 무엇이었나요?', answer: '' },
          { question: 'Q. 왜 이 기술을 사용했나요?', answer: '' },
          { question: 'Q. 가장 어려웠던 점과 해결 방법은?', answer: '' }
        ]
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanedData = {
      ...formData,
      links: formData.links?.filter(link => link.url.trim() !== '') || [],
      qna: formData.qna?.filter(item => item.question.trim() !== '' && item.answer.trim() !== '') || []
    };

    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? { ...cleanedData, id: p.id } : p));
    } else {
      const newProject: Project = {
        ...cleanedData,
        id: Date.now(),
      };
      setProjects([...projects, newProject]);
    }
    setIsModalOpen(false);
  };

  // --- 프로필 관련 핸들러 ---
  const openProfileModal = () => {
    setProfileFormData(profile);
    setIsProfileModalOpen(true);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(profileFormData);
    setIsProfileModalOpen(false);
    alert("프로필이 업데이트되었습니다.");
  };

  // 프로젝트 링크 핸들러
  const addLink = () => {
    setFormData({
      ...formData,
      links: [...(formData.links || []), { label: '', url: '', description: '' }]
    });
  };

  const removeLink = (index: number) => {
    const newLinks = formData.links?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, links: newLinks });
  };

  const updateLink = (index: number, field: 'label' | 'url' | 'description', value: string) => {
    const newLinks = [...(formData.links || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData({ ...formData, links: newLinks });
  };

  // 프로젝트 Q&A 핸들러
  const addQna = (questionText: string = 'Q. ') => {
    setFormData({
      ...formData,
      qna: [...(formData.qna || []), { question: questionText, answer: '' }]
    });
  };

  const removeQna = (index: number) => {
    const newQna = formData.qna?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, qna: newQna });
  };

  const updateQna = (index: number, field: 'question' | 'answer', value: string) => {
    const newQna = [...(formData.qna || [])];
    newQna[index] = { ...newQna[index], [field]: value };
    setFormData({ ...formData, qna: newQna });
  };

  return {
    projects,
    profile,
    isModalOpen,
    setIsModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    editingProject,
    formData,
    setFormData,
    profileFormData,
    setProfileFormData,
    handleLogout,
    handleDelete,
    openModal,
    openProfileModal,
    handleSave,
    handleProfileSave,
    addLink,
    removeLink,
    updateLink,
    addQna,
    removeQna,
    updateQna
  };
};