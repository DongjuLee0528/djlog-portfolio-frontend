// 데이터 정규화 유틸리티 함수들 - API 응답 데이터를 안전하게 정규화
import type { Project, Profile, ProfileSkillGroup, ProfileSkillPayloadItem, ProjectLinkItem, ProjectQnaItem } from '../src/types';

const unwrapObjectPayload = (data: unknown): unknown => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return data;

  const record = data as Record<string, unknown>;

  if (record.data && typeof record.data === 'object' && !Array.isArray(record.data)) {
    return record.data;
  }

  return data;
};

const unwrapArrayPayload = (data: unknown): unknown[] => {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== 'object') return [];

  const record = data as Record<string, unknown>;

  if (Array.isArray(record.data)) return record.data;
  if (Array.isArray(record.projects)) return record.projects;

  return [];
};

const normalizeProjectStatus = (status: unknown): Project['status'] => {
  if (status === 'PUBLISHED' || status === 'Published') return 'PUBLISHED';
  if (status === 'DRAFT' || status === 'Draft') return 'DRAFT';
  return undefined;
};

const normalizeProjectLinks = (project: Partial<Project>): ProjectLinkItem[] => {
  const source = Array.isArray(project.links)
    ? project.links
    : Array.isArray(project.githubLinks)
      ? project.githubLinks
      : [];

  return source
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return { label: '', url: '' };
      }

      const linkItem = item as Partial<ProjectLinkItem>;

      return {
        label: typeof linkItem.label === 'string' ? linkItem.label : '',
        url: typeof linkItem.url === 'string' ? linkItem.url : '',
      };
    })
    .filter((item) => item.label.trim() !== '' || item.url.trim() !== '');
};

const normalizeProjectQnaList = (project: Partial<Project>): ProjectQnaItem[] => {
  const source = Array.isArray(project.qnaList)
    ? project.qnaList
    : Array.isArray(project.qna)
      ? project.qna
      : [];

  return source
    .map((item, index) => {
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
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
};

const normalizeProfileSkills = (skills: unknown): ProfileSkillGroup[] => {
  if (!Array.isArray(skills)) return [];

  const groupedSkills = new Map<string, string[]>();

  skills.forEach((skill) => {
    if (!skill || typeof skill !== 'object') return;

    const skillRecord = skill as Partial<ProfileSkillGroup & ProfileSkillPayloadItem>;

    if (Array.isArray(skillRecord.items)) {
      const category = typeof skillRecord.category === 'string' ? skillRecord.category : '';
      const normalizedItems = skillRecord.items
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => item !== '');

      if (!groupedSkills.has(category)) {
        groupedSkills.set(category, []);
      }

      groupedSkills.set(category, [
        ...(groupedSkills.get(category) || []),
        ...normalizedItems,
      ]);
      return;
    }

    const name = typeof skillRecord.name === 'string' ? skillRecord.name.trim() : '';
    if (!name) return;

    const category = typeof skillRecord.category === 'string' ? skillRecord.category : '';
    if (!groupedSkills.has(category)) {
      groupedSkills.set(category, []);
    }

    groupedSkills.set(category, [...(groupedSkills.get(category) || []), name]);
  });

  return Array.from(groupedSkills.entries()).map(([category, items]) => ({
    category,
    items: Array.from(new Set(items)),
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
