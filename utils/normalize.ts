/**
 * 데이터 정규화 유틸리티 함수들 - API 응답 데이터를 안전하게 정규화
 *
 * 백엔드 API에서 받은 데이터의 구조가 일관되지 않을 수 있으므로,
 * 프론트엔드에서 사용하기 전에 안전하게 정규화하는 함수들을 제공합니다.
 */

import type { Project, Profile, ProfileSkillGroup, ProfileSkillPayloadItem, ProjectLinkItem, ProjectQnaItem } from '../src/types';

/**
 * 객체 형태의 API 응답에서 실제 데이터를 추출하는 함수
 *
 * API 응답이 { data: {...} } 형태로 래핑되어 있는 경우 내부 데이터를 추출합니다.
 *
 * @param data - API에서 받은 원시 데이터
 * @returns 언래핑된 데이터 또는 원본 데이터
 */
const unwrapObjectPayload = (data: unknown): unknown => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return data;

  const record = data as Record<string, unknown>;

  // { data: {...} } 형태의 응답에서 내부 data 추출
  if (record.data && typeof record.data === 'object' && !Array.isArray(record.data)) {
    return record.data;
  }

  return data;
};

/**
 * 배열 형태의 API 응답에서 실제 배열 데이터를 추출하는 함수
 *
 * API 응답이 { data: [...] } 또는 { projects: [...] } 형태로 래핑되어 있는 경우
 * 내부 배열을 추출합니다.
 *
 * @param data - API에서 받은 원시 데이터
 * @returns 언래핑된 배열 또는 빈 배열
 */
const unwrapArrayPayload = (data: unknown): unknown[] => {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== 'object') return [];

  const record = data as Record<string, unknown>;

  // { data: [...] } 또는 { projects: [...] } 형태의 응답에서 배열 추출
  if (Array.isArray(record.data)) return record.data;
  if (Array.isArray(record.projects)) return record.projects;

  return [];
};

/**
 * 프로젝트 상태값을 정규화하는 함수
 *
 * 다양한 형태로 올 수 있는 상태값을 표준 형태로 변환합니다.
 *
 * @param status - 정규화할 상태값
 * @returns 표준화된 프로젝트 상태 또는 undefined
 */
const normalizeProjectStatus = (status: unknown): Project['status'] => {
  if (status === 'PUBLISHED' || status === 'Published') return 'PUBLISHED';
  if (status === 'DRAFT' || status === 'Draft') return 'DRAFT';
  return undefined;
};

/**
 * 프로젝트 링크 데이터를 정규화하는 함수
 *
 * 프로젝트의 GitHub 링크나 기타 링크 배열을 안전하게 정규화합니다.
 * links 또는 githubLinks 필드에서 데이터를 가져와 표준 형태로 변환합니다.
 *
 * @param project - 정규화할 프로젝트 데이터
 * @returns 정규화된 프로젝트 링크 배열
 */
const normalizeProjectLinks = (project: Partial<Project>): ProjectLinkItem[] => {
  // links 또는 githubLinks 필드에서 소스 데이터 선택
  const source = Array.isArray(project.links)
    ? project.links
    : Array.isArray(project.githubLinks)
      ? project.githubLinks
      : [];

  return source
    .map((item) => {
      // 유효하지 않은 링크 항목에 대한 기본값 처리
      if (!item || typeof item !== 'object') {
        return { label: '', url: '' };
      }

      const linkItem = item as Partial<ProjectLinkItem>;

      return {
        label: typeof linkItem.label === 'string' ? linkItem.label : '',
        url: typeof linkItem.url === 'string' ? linkItem.url : '',
      };
    })
    // 빈 링크는 필터링하여 제거
    .filter((item) => item.label.trim() !== '' || item.url.trim() !== '');
};

/**
 * 프로젝트 Q&A 리스트를 정규화하는 함수
 *
 * 프로젝트의 질문과 답변 배열을 안전하게 정규화합니다.
 * qnaList 또는 qna 필드에서 데이터를 가져와 표준 형태로 변환하고,
 * displayOrder를 기준으로 정렬합니다.
 *
 * @param project - 정규화할 프로젝트 데이터
 * @returns 정규화되고 정렬된 Q&A 배열
 */
const normalizeProjectQnaList = (project: Partial<Project>): ProjectQnaItem[] => {
  // qnaList 또는 qna 필드에서 소스 데이터 선택
  const source = Array.isArray(project.qnaList)
    ? project.qnaList
    : Array.isArray(project.qna)
      ? project.qna
      : [];

  return source
    .map((item, index) => {
      // 유효하지 않은 Q&A 항목에 대한 기본값 처리
      if (!item || typeof item !== 'object') {
        return {
          question: '',
          answer: '',
          displayOrder: index + 1,
        };
      }

      const qnaItem = item as Partial<ProjectQnaItem>;

      return {
        question: typeof qnaItem.question === 'string' ? qnaItem.question : '',
        answer: typeof qnaItem.answer === 'string' ? qnaItem.answer : '',
        displayOrder: typeof qnaItem.displayOrder === 'number' ? qnaItem.displayOrder : index + 1,
      };
    })
    // displayOrder를 기준으로 오름차순 정렬
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
};

/**
 * 프로필 기술 스택 데이터를 정규화하는 함수
 *
 * 다양한 형태로 올 수 있는 기술 스택 데이터를 카테고리별로 그룹화하여 정규화합니다.
 * 개별 스킬 항목과 그룹화된 스킬 항목을 모두 처리할 수 있습니다.
 *
 * @param skills - 정규화할 기술 스택 데이터
 * @returns 카테고리별로 그룹화된 정규화된 기술 스택 배열
 */
const normalizeProfileSkills = (skills: unknown): ProfileSkillGroup[] => {
  if (!Array.isArray(skills)) return [];

  // 카테고리별로 기술들을 그룹화하기 위한 Map
  const groupedSkills = new Map<string, string[]>();

  skills.forEach((skill) => {
    if (!skill || typeof skill !== 'object') return;

    const skillRecord = skill as Partial<ProfileSkillGroup & ProfileSkillPayloadItem>;

    // 이미 그룹화된 스킬 데이터 처리 (items 배열이 있는 경우)
    if (Array.isArray(skillRecord.items)) {
      const category = typeof skillRecord.category === 'string' ? skillRecord.category : '';
      const normalizedItems = skillRecord.items
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => item !== '');

      if (!groupedSkills.has(category)) {
        groupedSkills.set(category, []);
      }

      // 기존 카테고리에 스킬들 추가
      groupedSkills.set(category, [
        ...(groupedSkills.get(category) || []),
        ...normalizedItems,
      ]);
      return;
    }

    // 개별 스킬 항목 처리 (name 필드가 있는 경우)
    const name = typeof skillRecord.name === 'string' ? skillRecord.name.trim() : '';
    if (!name) return;

    const category = typeof skillRecord.category === 'string' ? skillRecord.category : '';
    if (!groupedSkills.has(category)) {
      groupedSkills.set(category, []);
    }

    // 개별 스킬을 해당 카테고리에 추가
    groupedSkills.set(category, [...(groupedSkills.get(category) || []), name]);
  });

  // Map을 배열 형태로 변환하고 중복 제거
  return Array.from(groupedSkills.entries()).map(([category, items]) => ({
    category,
    items: Array.from(new Set(items)), // 중복된 기술 스택 제거
  }));
};

/**
 * 프로젝트 데이터를 정규화하여 배열 필드들이 항상 배열이 되도록 보장
 * @param data 백엔드에서 받은 프로젝트 데이터 (unknown)
 * @returns 정규화된 프로젝트 객체
 */
export const normalizeProject = (data: unknown): Project => {
  const payload = unwrapObjectPayload(data);
  if (!payload || typeof payload !== 'object') return {} as Project;
  
  const project = payload as Partial<Project>;
  
  return {
    ...project,
    id: typeof project.id === 'string' ? project.id : undefined,
    title: typeof project.title === 'string' ? project.title : '',
    status: normalizeProjectStatus(project.status),
    description: typeof project.description === 'string' ? project.description : '',
    tags: Array.isArray(project.tags) ? project.tags : [],
    links: normalizeProjectLinks(project),
    githubLinks: normalizeProjectLinks(project),
    qnaList: normalizeProjectQnaList(project)
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

  const normalizedCertificates = Array.isArray(profile.certificates)
    ? profile.certificates.map((certificate) => {
        if (!certificate || typeof certificate !== 'object') {
          return { name: '', issuer: '', issueDate: '' };
        }

        const cert = certificate as Partial<Profile['certificates'][number]> & { date?: string };

        return {
          name: typeof cert.name === 'string' ? cert.name : '',
          issuer: typeof cert.issuer === 'string' ? cert.issuer : '',
          issueDate: typeof cert.issueDate === 'string'
            ? cert.issueDate
            : typeof cert.date === 'string'
              ? cert.date
              : ''
        };
      })
    : [];

  return {
    ...profile,
    name: typeof profile.name === 'string' ? profile.name : '',
    bio: typeof profile.bio === 'string' ? profile.bio : '',
    about: typeof profile.about === 'string' ? profile.about : '',
    email: typeof profile.email === 'string' ? profile.email : '',
    education: Array.isArray(profile.education) ? profile.education : [],
    achievements: Array.isArray(profile.achievements) ? profile.achievements : [],
    certificates: normalizedCertificates,
    skills: normalizeProfileSkills(profile.skills)
  } as Profile;
};

/**
 * 프로젝트 배열을 정규화
 * @param data 백엔드에서 받은 프로젝트 배열 데이터 (unknown)
 * @returns 정규화된 프로젝트 배열
 */
export const normalizeProjects = (data: unknown): Project[] => {
  return unwrapArrayPayload(data).map(normalizeProject);
};
