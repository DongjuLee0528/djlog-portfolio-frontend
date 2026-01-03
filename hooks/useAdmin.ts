import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types';

export const useAdmin = () => {
  const navigate = useNavigate();
  
  // 초기 데이터 (예시)
  const [projects, setProjects] = useState<Project[]>([
    { 
      id: 1, 
      title: "Linear Clone", 
      category: "Web App", 
      status: "Published", 
      description: "A high-performance issue tracking application.",
      tags: ["React", "Next.js"],
      githubLinks: [{ label: "Repo", url: "https://github.com/user/linear-clone" }],
      qna: []
    },
    { 
      id: 2, 
      title: "FinTech Dashboard", 
      category: "Dashboard", 
      status: "Published", 
      description: "Comprehensive financial analytics dashboard.",
      tags: ["TypeScript", "D3.js"],
      githubLinks: [
        { label: "Frontend", url: "https://github.com/user/fintech-fe" },
        { label: "Backend", url: "https://github.com/user/fintech-be" }
      ],
      qna: []
    },
  ]);

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // 폼 상태 관리
  const [formData, setFormData] = useState<Project>({
    id: 0,
    title: '',
    category: '',
    status: 'Draft',
    description: '',
    tags: [],
    githubLinks: [{ label: 'GitHub', url: '' }],
    demoLink: '',
    qna: [
      { question: 'Q. 어떤 프로젝트인가요?', answer: '' },
      { question: 'Q. 나의 역할은 무엇이었나요?', answer: '' },
      { question: 'Q. 왜 이 기술을 사용했나요?', answer: '' },
      { question: 'Q. 가장 어려웠던 점과 해결 방법은?', answer: '' }
    ]
  });

  // 관리자 권한 체크
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert("Access Denied. Admins only.");
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem('adminToken');
      window.dispatchEvent(new Event('authChange')); // Navbar 업데이트
      navigate('/');
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this project? This action cannot be undone.")) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        ...project,
        githubLinks: project.githubLinks || [{ label: 'GitHub', url: '' }],
        qna: project.qna || []
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
        githubLinks: [{ label: 'GitHub', url: '' }],
        demoLink: '',
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
    
    // 빈 링크 필터링
    const cleanedData = {
      ...formData,
      githubLinks: formData.githubLinks?.filter(link => link.url.trim() !== '') || [],
      qna: formData.qna?.filter(item => item.question.trim() !== '' && item.answer.trim() !== '') || []
    };

    if (editingProject) {
      // 수정 모드
      setProjects(projects.map(p => p.id === editingProject.id ? { ...cleanedData, id: p.id } : p));
    } else {
      // 생성 모드
      const newProject: Project = {
        ...cleanedData,
        id: Date.now(),
      };
      setProjects([...projects, newProject]);
    }
    setIsModalOpen(false);
  };

  // GitHub 링크 추가/삭제 핸들러
  const addGithubLink = () => {
    setFormData({
      ...formData,
      githubLinks: [...(formData.githubLinks || []), { label: '', url: '' }]
    });
  };

  const removeGithubLink = (index: number) => {
    const newLinks = formData.githubLinks?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, githubLinks: newLinks });
  };

  const updateGithubLink = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...(formData.githubLinks || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData({ ...formData, githubLinks: newLinks });
  };

  // Q&A 추가/삭제 핸들러
  const addQna = () => {
    setFormData({
      ...formData,
      qna: [...(formData.qna || []), { question: 'Q. ', answer: '' }]
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
    isModalOpen,
    setIsModalOpen,
    editingProject,
    formData,
    setFormData,
    handleLogout,
    handleDelete,
    openModal,
    handleSave,
    addGithubLink,
    removeGithubLink,
    updateGithubLink,
    addQna,
    removeQna,
    updateQna
  };
};