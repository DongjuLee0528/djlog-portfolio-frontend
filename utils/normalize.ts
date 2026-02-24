// 데이터 정규화 유틸리티 함수들 - API 응답 데이터를 안전하게 정규화
import type { Project, Profile } from '../types';

/**
 * 프로젝트 데이터를 정규화하여 배열 필드들이 항상 배열이 되도록 보장
 * @param data 백엔드에서 받은 프로젝트 데이터 (unknown)
 * @returns 정규화된 프로젝트 객체
 */
export const normalizeProject = (data: unknown): Project => {
  if (!data || typeof data !== 'object') return {} as Project;
  
  const project = data as Partial<Project>;
  
  return {
    ...project,
    id: typeof project.id === 'number' ? project.id : 0,
    title: typeof project.title === 'string' ? project.title : '',
    description: typeof project.description === 'string' ? project.description : '',
    tags: Array.isArray(project.tags) ? project.tags : [],
    githubLinks: Array.isArray(project.githubLinks) ? project.githubLinks : [],
    qna: Array.isArray(project.qna) ? project.qna : []
  } as Project;
};

/**
 * 프로필 데이터를 정규화하여 배열 필드들이 항상 배열이 되도록 보장
 * @param data 백엔드에서 받은 프로필 데이터 (unknown)
 * @returns 정규화된 프로필 객체
 */
export const normalizeProfile = (data: unknown): Profile => {
  if (!data || typeof data !== 'object') return {} as Profile;

  const profile = data as Partial<Profile>;

  return {
    ...profile,
    name: typeof profile.name === 'string' ? profile.name : '',
    bio: typeof profile.bio === 'string' ? profile.bio : '',
    about: typeof profile.about === 'string' ? profile.about : '',
    email: typeof profile.email === 'string' ? profile.email : '',
    education: Array.isArray(profile.education) ? profile.education : [],
    certificates: Array.isArray(profile.certificates) ? profile.certificates : [],
    skills: Array.isArray(profile.skills) ? profile.skills : []
  } as Profile;
};

/**
 * 프로젝트 배열을 정규화
 * @param data 백엔드에서 받은 프로젝트 배열 데이터 (unknown)
 * @returns 정규화된 프로젝트 배열
 */
export const normalizeProjects = (data: unknown): Project[] => {
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map(normalizeProject);
};