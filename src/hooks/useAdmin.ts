// 관리자 대시보드를 위한 커스텀 훅 - 프로젝트/프로필 관리 로직 및 상태 제공
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project, Profile, ProfileSkillPayloadItem, ProjectQnaItem } from '../types';
import { normalizeProject, normalizeProfile, normalizeProjects } from '../../utils/normalize';
import { apiClient } from '../../utils/apiClient';
import { useToast } from './useToast';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, CONFIRM_MESSAGES, LOADING_MESSAGES } from '../constants';

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
  const toast = useToast();

  const getDefaultQnaList = (): ProjectQnaItem[] => [
    { question: 'Q. 어떤 프로젝트인가요?', answer: '', displayOrder: 1 },
    { question: 'Q. 나의 역할은 무엇이었나요?', answer: '', displayOrder: 2 },
    { question: 'Q. 왜 이 기술을 사용했나요?', answer: '', displayOrder: 3 },
    { question: 'Q. 가장 어려웠던 점과 해결 방법은?', answer: '', displayOrder: 4 }
  ];

  const normalizeQnaList = (qnaList: ProjectQnaItem[]): ProjectQnaItem[] => {
    return qnaList.map((item, index) => ({
      ...item,
      displayOrder: index + 1,
    }));
  };

  const buildProfileSkillsPayload = (skills: Profile['skills']): ProfileSkillPayloadItem[] => {
    return skills.flatMap((skillGroup) => {
      const category = skillGroup.category.trim();

      return skillGroup.items
        .map((item) => item.trim())
        .filter((item) => item !== '')
        .map((item) => ({
          name: item,
          category,
        }));
    });
  };
  
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
    achievements: [],
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
    title: '',
    category: '',
    status: 'DRAFT',
    description: '',
    tags: [],
    image: '',
    links: [{ label: 'GitHub', url: '' }],
    qnaList: getDefaultQnaList()
  });

  // 폼 상태 관리 (프로필)
  const [profileFormData, setProfileFormData] = useState<Profile>(profile);

  // 관리자 권한 체크 및 프로젝트 데이터 로드
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error(ERROR_MESSAGES.UNAUTHORIZED);
      navigate('/login');
      return;
    }

    // 프로젝트 데이터 및 프로필 데이터 로드
    loadProjects();
    loadProfile();
  }, [navigate, toast]);

  // 프로젝트 폼 데이터 초기화 헬퍼 함수
  const toProjectFormData = (project: Project | null): Project => {
    if (project) {
      // 수정 모드: 기존 데이터 사용하되, 빈 값은 기본값으로 채움
      return {
        ...project,
        status: project.status || 'DRAFT',
        tags: Array.isArray(project.tags) ? project.tags : [],
        image: project.image || '',
        links: project.links && project.links.length > 0
          ? project.links
          : [{ label: 'GitHub', url: '' }],
        qnaList: project.qnaList && project.qnaList.length > 0
          ? normalizeQnaList(project.qnaList)
          : getDefaultQnaList()
      };
    } else {
      // 신규 생성 모드: 기본값으로 초기화
      return {
        title: '',
        category: '',
        status: 'DRAFT',
        description: '',
        tags: [],
        image: '',
        links: [{ label: 'GitHub', url: '' }],
        qnaList: getDefaultQnaList()
      };
    }
  };

  // 프로젝트 목록 조회
  const loadProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    try {
      const data = await apiClient<Project[]>('/api/projects');
      // 각 프로젝트 데이터를 정규화
      const normalizedProjects = normalizeProjects(data);
      setProjects(normalizedProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);


  // 프로필 조회
  const loadProfile = useCallback(async () => {
    setIsLoadingProfile(true);
    try {
      const data = await apiClient<Profile>('/api/profile');
      // 프로필 데이터를 정규화
      const normalizedProfile = normalizeProfile(data);
      setProfile(normalizedProfile);
      setProfileFormData(normalizedProfile);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  // 로그아웃 처리 - 백엔드 세션 무효화 및 로컬 토큰 제거
  const handleLogout = useCallback(async () => {
    if (window.confirm(CONFIRM_MESSAGES.LOGOUT)) {
      const loadingToast = toast.loading(LOADING_MESSAGES.LOGGING_OUT);
      try {
        // 백엔드에 로그아웃 요청하여 서버 세션 무효화
        await apiClient('/api/auth/logout', { method: 'POST' });
        toast.success(SUCCESS_MESSAGES.LOGOUT_SUCCESS);
      } catch (error) {
        console.error('Logout API error:', error);
        toast.error(ERROR_MESSAGES.LOGOUT_FAILED);
        // 네트워크 오류가 있어도 로컬에서는 로그아웃 처리 진행
      } finally {
        toast.dismiss(loadingToast);
        // 로컬 스토리지에서 토큰 제거
        localStorage.removeItem('adminToken');
        // Navbar 상태 업데이트를 위한 커스텀 이벤트 발생
        window.dispatchEvent(new Event('authChange'));
        // 홈 페이지로 리다이렉트
        navigate('/');
      }
    }
  }, [navigate, toast]);

  // --- 프로젝트 관련 핸들러 ---
  const handleDelete = useCallback(async (id?: string) => {
    if (!id) return;

    if (window.confirm(CONFIRM_MESSAGES.DELETE_PROJECT)) {
      const loadingToast = toast.loading(LOADING_MESSAGES.DELETING);
      try {
        await apiClient(`/api/projects/${id}`, { method: 'DELETE' });
        setProjects(prevProjects => prevProjects.filter((p) => p.id !== id));
        toast.success(SUCCESS_MESSAGES.PROJECT_DELETED);
      } catch (error) {
        console.error('Delete project error:', error);
        toast.error(ERROR_MESSAGES.PROJECT_DELETE);
      } finally {
        toast.dismiss(loadingToast);
      }
    }
  }, [toast]);

  // 프로젝트 모달 열기 - 신규 생성 또는 기존 프로젝트 수정
  const openModal = useCallback((project?: Project) => {
    setEditingProject(project || null);
    setFormData(toProjectFormData(project || null));
    setIsModalOpen(true);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image?.trim()) {
      toast.error('대표 이미지를 업로드하거나 URL을 입력하세요');
      return;
    }

    const { id, qna, qnaList, githubLinks: _legacyGithubLinks, ...projectPayload } = formData;

    const cleanedQnaList = normalizeQnaList(
      (qnaList || []).filter((item: any) => item.question.trim() !== '' && item.answer.trim() !== '')
    );

    const cleanedData = {
      ...projectPayload,
      links: formData.links?.filter((link: any) => link.url.trim() !== '') || [],
      qnaList: cleanedQnaList
    };

    const loadingToast = toast.loading(LOADING_MESSAGES.SAVING);
    try {
      if (editingProject?.id) {
        // 프로젝트 수정
        const updatedProject = await apiClient<Project>(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          body: JSON.stringify(cleanedData),
        });

        // 응답 데이터를 정규화
        const normalizedProject = normalizeProject(updatedProject);
        setProjects(projects.map((p: Project) => p.id === editingProject.id ? normalizedProject : p));
        setIsModalOpen(false);
        setEditingProject(null);
        toast.success(SUCCESS_MESSAGES.PROJECT_SAVED);
      } else {
        // 프로젝트 생성
        const newProject = await apiClient<Project>('/api/projects', {
          method: 'POST',
          body: JSON.stringify(cleanedData),
        });

        // 응답 데이터를 정규화
        const normalizedProject = normalizeProject(newProject);
        setProjects([...projects, normalizedProject]);
        setIsModalOpen(false);
        setEditingProject(null);
        toast.success(SUCCESS_MESSAGES.PROJECT_SAVED);
      }
    } catch (error) {
      console.error('Save project error:', error);
      toast.error(ERROR_MESSAGES.PROJECT_SAVE);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  // --- 프로필 관련 핸들러 ---
  const openProfileModal = () => {
    setProfileFormData(profile);
    setIsProfileModalOpen(true);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const profilePayload = {
      ...profileFormData,
      skills: buildProfileSkillsPayload(profileFormData.skills),
    };

    const loadingToast = toast.loading(LOADING_MESSAGES.SAVING);
    try {
      const updatedProfile = await apiClient<Profile>('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(profilePayload),
      });

      // 응답 데이터를 정규화
      const normalizedProfile = normalizeProfile(updatedProfile);
      setProfile(normalizedProfile);
      setIsProfileModalOpen(false);
      toast.success(SUCCESS_MESSAGES.PROFILE_UPDATED);
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(ERROR_MESSAGES.PROFILE_UPDATE);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  // GitHub 링크 관리 핸들러들
  const addLink = () => {
    setFormData({
      ...formData,
      links: [...(formData.links || []), { label: '', url: '' }]
    });
  };

  const removeLink = (index: number) => {
    const newLinks = formData.links?.filter((_: any, i: number) => i !== index) || [];
    setFormData({ ...formData, links: newLinks });
  };

  const updateLink = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...(formData.links || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData({ ...formData, links: newLinks });
  };

  // 프로젝트 Q&A 섹션 관리 핸들러들
  const addQna = (questionText: string = 'Q. ') => {
    setFormData((prev) => ({
      ...prev,
      qnaList: normalizeQnaList([...(prev.qnaList || []), { question: questionText, answer: '' }])
    }));
  };

  const removeQna = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      qnaList: normalizeQnaList(prev.qnaList?.filter((_: any, i: number) => i !== index) || [])
    }));
  };

  const updateQna = (index: number, field: keyof ProjectQnaItem, value: string) => {
    setFormData((prev) => {
      const nextQnaList = [...(prev.qnaList || [])];
      nextQnaList[index] = { ...nextQnaList[index], [field]: value };
      return { ...prev, qnaList: normalizeQnaList(nextQnaList) };
    });
  };

  const moveQna = (fromIndex: number, toIndex: number) => {
    setFormData((prev) => {
      const currentQnaList = prev.qnaList || [];
      if (toIndex < 0 || toIndex >= currentQnaList.length) return prev;

      const nextQnaList = [...currentQnaList];
      const [movedItem] = nextQnaList.splice(fromIndex, 1);
      nextQnaList.splice(toIndex, 0, movedItem);

      return { ...prev, qnaList: normalizeQnaList(nextQnaList) };
    });
  };

  const moveQnaUp = (index: number) => {
    moveQna(index, index - 1);
  };

  const moveQnaDown = (index: number) => {
    moveQna(index, index + 1);
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
    updateQna, // Q&A 수정
    moveQnaUp, // Q&A 위로 이동
    moveQnaDown // Q&A 아래로 이동
  };
};
