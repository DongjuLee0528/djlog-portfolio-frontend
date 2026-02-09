// 데이터 정규화 유틸리티 함수들 - API 응답 데이터를 안전하게 정규화
import type { Project, Profile } from '../types';

/**
 * 프로젝트 데이터를 정규화하여 배열 필드들이 항상 배열이 되도록 보장
 * @param project 백엔드에서 받은 프로젝트 데이터
 * @returns 정규화된 프로젝트 객체
 */
export const normalizeProject = (project: any): Project => {
  return {
    ...project,
    tags: Array.isArray(project.tags) ? project.tags : [],
    githubLinks: Array.isArray(project.githubLinks)
      ? project.githubLinks
      : [{ label: 'GitHub', url: '' }],
    qna: Array.isArray(project.qna)
      ? project.qna
      : [
          { question: 'Q. 어떤 프로젝트인가요?', answer: '' },
          { question: 'Q. 나의 역할은 무엇이었나요?', answer: '' },
          { question: 'Q. 왜 이 기술을 사용했나요?', answer: '' },
          { question: 'Q. 가장 어려웠던 점과 해결 방법은?', answer: '' }
        ]
  };
};

/**
 * 프로필 데이터를 정규화하여 배열 필드들이 항상 배열이 되도록 보장
 * @param profile 백엔드에서 받은 프로필 데이터
 * @returns 정규화된 프로필 객체
 */
export const normalizeProfile = (profile: any): Profile => {
  return {
    ...profile,
    education: Array.isArray(profile.education) ? profile.education : [],
    certificates: Array.isArray(profile.certificates) ? profile.certificates : [],
    skills: Array.isArray(profile.skills)
      ? profile.skills
      : [
          { category: "Languages", items: ["Python", "Java", "JavaScript", "TypeScript"] },
          { category: "Tools & DevOps", items: ["Git", "Docker", "VS Code", "IntelliJ IDEA"] }
        ]
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