// 관리자 대시보드를 위한 커스텀 훅 - 프로젝트/프로필 관리 로직 및 상태 제공
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project, Profile } from '../types';
import { normalizeProject, normalizeProfile, normalizeProjects } from '../utils/normalize';

/**
 * 관리자 대시보드의 모든 비즈니스 로직을 관리하는 커스텀 훅
 * - 프로젝트 CRUD 작업 (생성, 조회, 수정, 삭제)
 * - 프로필 정보 관리
 * - 모달 상태 관리
 * - 폼 데이터 상태 관리
 * - 인증 상태 관리
 */
export const useAdmin = () => {
  const navigate = useNavigate();
  
  // --- 프로젝트 관련 상태 ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // --- 프로필 관련 상태 ---
  const [profile, setProfile] = useState<Profile>({
    name: "",
    bio: "",
    about: "",
    email: "",
    github: "",
    education: [],
    certificates: [],
    skills: [
      { category: "Languages", items: ["Python", "Java", "JavaScript", "TypeScript"] },
      { category: "Tools & DevOps", items: ["Git", "Docker", "VS Code", "IntelliJ IDEA"] }
    ]
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

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
    githubLinks: [{ label: 'GitHub', url: '' }],
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

    // 프로젝트 데이터 및 프로필 데이터 로드
    loadProjects();
    loadProfile();
  }, [navigate]);

  // API 요청 시 사용할 인증 헤더 생성 헬퍼 함수
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
        // 각 프로젝트 데이터를 정규화
        const normalizedProjects = normalizeProjects(data);
        setProjects(normalizedProjects);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoadingProjects(false);
    }
  };


  // 프로필 조회
  const loadProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        // 프로필 데이터를 정규화
        const normalizedProfile = normalizeProfile(data);
        setProfile(normalizedProfile);
        setProfileFormData(normalizedProfile);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // 로그아웃 처리 - 백엔드 세션 무효화 및 로컬 토큰 제거
  const handleLogout = async () => {
    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
      try {
        const token = localStorage.getItem('adminToken');

        // 백엔드에 로그아웃 요청하여 서버 세션 무효화
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout API error:', error);
        // 네트워크 오류가 있어도 로컬에서는 로그아웃 처리 진행
      } finally {
        // 로컬 스토리지에서 토큰 제거
        localStorage.removeItem('adminToken');
        // Navbar 상태 업데이트를 위한 커스텀 이벤트 발생
        window.dispatchEvent(new Event('authChange'));
        // 홈 페이지로 리다이렉트
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

  // 프로젝트 모달 열기 - 신규 생성 또는 기존 프로젝트 수정
  const openModal = (project?: Project) => {
    if (project) {
      // 수정 모드: 기존 프로젝트 데이터를 폼에 로드
      setEditingProject(project);
      setFormData({
        ...project,
        image: project.image || '',
        githubLinks: project.githubLinks && project.githubLinks.length > 0 ? project.githubLinks : [{ label: 'GitHub', url: '' }],
        qna: project.qna && project.qna.length > 0 ? project.qna : [
          { question: 'Q. 어떤 프로젝트인가요?', answer: '' },
          { question: 'Q. 나의 역할은 무엇이었나요?', answer: '' },
          { question: 'Q. 왜 이 기술을 사용했나요?', answer: '' },
          { question: 'Q. 가장 어려웠던 점과 해결 방법은?', answer: '' }
        ]
      });
    } else {
      // 신규 생성 모드: 기본값으로 폼 초기화
      setEditingProject(null);
      setFormData({
        id: 0,
        title: '',
        category: '',
        status: 'Draft',
        description: '',
        tags: [],
        image: '',
        githubLinks: [{ label: 'GitHub', url: '' }],
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
      githubLinks: formData.githubLinks?.filter(link => link.url.trim() !== '') || [],
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
          // 응답 데이터를 정규화
          const normalizedProject = normalizeProject(updatedProject);
          setProjects(projects.map(p => p.id === editingProject.id ? normalizedProject : p));
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
          // 응답 데이터를 정규화
          const normalizedProject = normalizeProject(newProject);
          setProjects([...projects, normalizedProject]);
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

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileFormData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        // 응답 데이터를 정규화
        const normalizedProfile = normalizeProfile(updatedProfile);
        setProfile(normalizedProfile);
        setIsProfileModalOpen(false);
        alert("프로필이 업데이트되었습니다.");
      } else {
        alert('프로필 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      alert('프로필 업데이트 중 오류가 발생했습니다.');
    }
  };

  // GitHub 링크 관리 핸들러들
  const addLink = () => {
    setFormData({
      ...formData,
      githubLinks: [...(formData.githubLinks || []), { label: '', url: '' }]
    });
  };

  const removeLink = (index: number) => {
    const newLinks = formData.githubLinks?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, githubLinks: newLinks });
  };

  const updateLink = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...(formData.githubLinks || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData({ ...formData, githubLinks: newLinks });
  };

  // 프로젝트 Q&A 섹션 관리 핸들러들
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

  // 관리자 대시보드에서 사용할 모든 상태와 함수들을 반환
  return {
    // 상태 데이터
    projects, // 프로젝트 목록
    profile, // 프로필 정보
    isLoadingProjects, // 프로젝트 로딩 상태
    isLoadingProfile, // 프로필 로딩 상태
    isModalOpen, // 프로젝트 모달 표시 여부
    setIsModalOpen, // 프로젝트 모달 상태 변경
    isProfileModalOpen, // 프로필 모달 표시 여부
    setIsProfileModalOpen, // 프로필 모달 상태 변경
    editingProject, // 현재 수정 중인 프로젝트
    formData, // 프로젝트 폼 데이터
    setFormData, // 프로젝트 폼 데이터 변경
    profileFormData, // 프로필 폼 데이터
    setProfileFormData, // 프로필 폼 데이터 변경

    // 핸들러 함수들
    handleLogout, // 로그아웃 처리
    handleDelete, // 프로젝트 삭제
    openModal, // 프로젝트 모달 열기
    openProfileModal, // 프로필 모달 열기
    handleSave, // 프로젝트 저장
    handleProfileSave, // 프로필 저장
    loadProjects, // 프로젝트 목록 새로고침
    loadProfile, // 프로필 정보 새로고침

    // GitHub 링크 관리
    addLink, // 링크 추가
    removeLink, // 링크 삭제
    updateLink, // 링크 수정

    // Q&A 관리
    addQna, // Q&A 추가
    removeQna, // Q&A 삭제
    updateQna // Q&A 수정
  };
};