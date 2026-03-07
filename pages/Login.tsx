// 관리자 로그인 페이지 컴포넌트
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '../utils/apiClient';
import { PLACEHOLDER_TEXT } from '../src/constants';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 백엔드 API 호출 (apiClient 사용)
      const data = await apiClient<{ token: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // 로그인 성공 처리
      localStorage.setItem('adminToken', data.token);

      // Navbar 상태 업데이트를 위한 커스텀 이벤트 발생
      window.dispatchEvent(new Event('authChange'));

      // 메인 페이지로 이동 (바로 관리자 페이지로 가지 않음)
      navigate('/');
    } catch (err: any) {
      // 에러 메시지 표시
      setError(err.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-6">
      <main role="main" aria-label="관리자 로그인 페이지">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="p-8 md:p-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#F0F7FF] rounded-full flex items-center justify-center text-[#4A90E2]">
              <Lock size={32} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-[#222222] mb-2">Admin Access</h2>
          <p className="text-center text-[#333333]/60 mb-8">Enter your credentials to access the dashboard.</p>

          <form onSubmit={handleLogin} className="space-y-5" role="form" aria-label="관리자 로그인 폼">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#333333] mb-1.5">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 outline-none transition-all bg-[#F9FAFB]"
                placeholder={PLACEHOLDER_TEXT.ADMIN_EMAIL}
                required
                aria-describedby="email-help"
              />
              <div id="email-help" className="absolute left-[-10000px] w-[1px] h-[1px] overflow-hidden">
                관리자 이메일 주소를 입력하세요.
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#333333] mb-1.5">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 outline-none transition-all bg-[#F9FAFB]"
                placeholder={PLACEHOLDER_TEXT.PASSWORD}
                required
                aria-describedby="password-help"
              />
              <div id="password-help" className="absolute left-[-10000px] w-[1px] h-[1px] overflow-hidden">
                관리자 비밀번호를 입력하세요.
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle size={16} aria-hidden="true" />
                {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 bg-[#222222] text-white rounded-lg font-medium hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
              ) : (
                <>
                  Sign In <ArrowRight size={18} aria-hidden="true" />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
          <p className="text-xs text-[#333333]/50">
            Protected area. Authorized personnel only.
          </p>
        </div>
      </motion.div>
      </main>
    </div>
  );
};

export default Login;