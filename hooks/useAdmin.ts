import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project, Profile } from '../types';

export const useAdmin = () => {
  const navigate = useNavigate();
  
  // --- 프로젝트 관련 상태 ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

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

  // 관리자 권한 체크 및 프로젝트 데이터 로드
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert("접근 권한이 없습니다. 관리자 로그인이 필요합니다.");
      navigate('/login');
      return;
    }

    // 프로젝트 데이터 로드
    loadProjects();
  }, [navigate]);

  // API 헬퍼 함수
  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // 프로젝트 목록 조회
  const loadProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
      try {
        const token = localStorage.getItem('adminToken');

        // 백엔드 API 호출
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout API error:', error);
        // 네트워크 오류가 있어도 로컬에서는 로그아웃 처리
      } finally {
        localStorage.removeItem('adminToken');
        window.dispatchEvent(new Event('authChange')); // Navbar 업데이트
        navigate('/');
      }
    }
  };

  // --- 프로젝트 관련 핸들러 ---
  const handleDelete = async (id: number) => {
    if (window.confirm("이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          setProjects(projects.filter(p => p.id !== id));
        } else {
          alert('프로젝트 삭제에 실패했습니다.');
        }
      } catch (error) {
        console.error('Delete project error:', error);
        alert('프로젝트 삭제 중 오류가 발생했습니다.');
      }
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedData = {
      ...formData,
      links: formData.links?.filter(link => link.url.trim() !== '') || [],
      qna: formData.qna?.filter(item => item.question.trim() !== '' && item.answer.trim() !== '') || []
    };

    try {
      if (editingProject) {
        // 프로젝트 수정
        const response = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(cleanedData),
        });

        if (response.ok) {
          const updatedProject = await response.json();
          setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p));
          setIsModalOpen(false);
        } else {
          alert('프로젝트 수정에 실패했습니다.');
        }
      } else {
        // 프로젝트 생성
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(cleanedData),
        });

        if (response.ok) {
          const newProject = await response.json();
          setProjects([...projects, newProject]);
          setIsModalOpen(false);
        } else {
          alert('프로젝트 생성에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('Save project error:', error);
      alert('프로젝트 저장 중 오류가 발생했습니다.');
    }
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
    isLoadingProjects,
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
    loadProjects,
    addLink,
    removeLink,
    updateLink,
    addQna,
    removeQna,
    updateQna
  };
};