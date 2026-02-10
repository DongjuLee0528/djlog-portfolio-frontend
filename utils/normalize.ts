// 데이터 정규화 유틸리티 함수들 - API 응답 데이터를 안전하게 정규화
import type { Project, Profile } from '../types';

/**
 * 프로젝트 데이터를 정규화하여 배열 필드들이 항상 배열이 되도록 보장
 * @param project 백엔드에서 받은 프로젝트 데이터
 * @returns 정규화된 프로젝트 객체
 */
export const normalizeProject = (project: any): Project => {
  if (!project) return {} as Project;
  
  return {
    ...project,
    tags: Array.isArray(project.tags) ? project.tags : [],
    githubLinks: Array.isArray(project.githubLinks) ? project.githubLinks : [],
    qna: Array.isArray(project.qna) ? project.qna : []
  };
};

/**
 * 프로필 데이터를 정규화하여 배열 필드들이 항상 배열이 되도록 보장
 * @param profile 백엔드에서 받은 프로필 데이터
 * @returns 정규화된 프로필 객체
 */
export const normalizeProfile = (profile: any): Profile => {
  if (!profile) return {} as Profile;

  return {
    ...profile,
    education: Array.isArray(profile.education) ? profile.education : [],
    certificates: Array.isArray(profile.certificates) ? profile.certificates : [],
    skills: Array.isArray(profile.skills) ? profile.skills : []
  };
};

/**
 * 프로젝트 배열을 정규화
 * @param projects 백엔드에서 받은 프로젝트 배열 데이터
 * @returns 정규화된 프로젝트 배열
 */
export const normalizeProjects = (projects: any): Project[] => {
  if (!Array.isArray(projects)) {
    return [];
  }
  return projects.map(normalizeProject);
};