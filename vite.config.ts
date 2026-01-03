// Vite 설정 파일 - React 애플리케이션의 빌드 및 개발 서버 설정
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // 환경 변수 로드
    const env = loadEnv(mode, '.', '');
    return {
      // 개발 서버 설정
      server: {
        port: 3000, // 포트 번호
        host: '0.0.0.0', // 모든 호스트에서 접근 허용
      },
      // Vite 플러그인 설정
      plugins: [react()],
      // 환경 변수 정의
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      // 모듈 경로 별칭 설정
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'), // @ 별칭을 프로젝트 루트로 설정
        }
      }
    };
});
