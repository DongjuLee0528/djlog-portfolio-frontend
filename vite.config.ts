/**
 * Vite 설정 파일 - React 애플리케이션의 빌드 및 개발 서버 설정
 *
 * 이 파일은 Vite 빌드 도구의 설정을 정의합니다:
 * - 개발 서버 설정 (포트, 호스트)
 * - React 플러그인 설정
 * - 경로 별칭 설정
 * - 환경 변수 처리
 */

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    /** 현재 모드에 따른 환경 변수 로드 (development, production 등) */
    const env = loadEnv(mode, '.', '');

    return {
      /** 개발 서버 설정 */
      server: {
        /** 개발 서버 포트 번호 - 일반적으로 React는 3000번 포트 사용 */
        port: 3000,
        /** 모든 네트워크 인터페이스에서 접근 허용 - Docker나 네트워크 테스트에 유용 */
        host: '0.0.0.0',
      },

      /** Vite 플러그인 설정 */
      plugins: [
        /** React JSX/TSX 변환 및 Hot Module Replacement 지원 */
        react()
      ],

      /** 전역 상수 정의 - 빌드 시 코드에 주입될 값들 (현재 미사용) */
      define: {},

      /** 모듈 경로 별칭 설정 - import 경로를 단순화 */
      resolve: {
        alias: {
          /** '@' 별칭을 프로젝트 루트로 설정하여 상대경로 대신 절대경로 사용 가능 */
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
