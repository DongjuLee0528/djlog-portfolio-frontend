// 메시지 및 텍스트 상수
export const ERROR_MESSAGES = {
  GENERIC: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  NETWORK: '네트워크 연결을 확인해주세요.',
  UNAUTHORIZED: '접근 권한이 없습니다. 로그인이 필요합니다.',
  FORBIDDEN: '해당 작업을 수행할 권한이 없습니다.',
  NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
  FILE_UPLOAD: '파일 업로드 중 오류가 발생했습니다.',
  PROJECT_SAVE: '프로젝트 저장 중 오류가 발생했습니다.',
  PROJECT_DELETE: '프로젝트 삭제 중 오류가 발생했습니다.',
  PROFILE_UPDATE: '프로필 업데이트 중 오류가 발생했습니다.',
  LOGIN_FAILED: '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.',
  LOGOUT_FAILED: '로그아웃 중 오류가 발생했습니다.',
} as const;

export const SUCCESS_MESSAGES = {
  PROJECT_SAVED: '프로젝트가 성공적으로 저장되었습니다.',
  PROJECT_DELETED: '프로젝트가 성공적으로 삭제되었습니다.',
  PROFILE_UPDATED: '프로필이 성공적으로 업데이트되었습니다.',
  LOGIN_SUCCESS: '로그인되었습니다.',
  LOGOUT_SUCCESS: '로그아웃되었습니다.',
  FILE_UPLOADED: '파일이 성공적으로 업로드되었습니다.',
} as const;

export const CONFIRM_MESSAGES = {
  DELETE_PROJECT: '이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
  LOGOUT: '정말 로그아웃 하시겠습니까?',
  DISCARD_CHANGES: '변경사항을 취소하시겠습니까? 저장하지 않은 내용은 사라집니다.',
} as const;

export const LOADING_MESSAGES = {
  PROJECTS: '프로젝트를 불러오는 중...',
  PROFILE: '프로필을 불러오는 중...',
  SAVING: '저장하는 중...',
  DELETING: '삭제하는 중...',
  UPLOADING: '업로드하는 중...',
  LOGGING_IN: '로그인하는 중...',
  LOGGING_OUT: '로그아웃하는 중...',
} as const;