// 관리자 로그인 페이지 컴포넌트
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 임시 로그인 로직 (실제로는 백엔드 API 호출 필요)
    // 예: admin@example.com / password123
    setTimeout(() => {
      if (email === 'admin@example.com' && password === 'password123') {
        // 로그인 성공 처리
        localStorage.setItem('adminToken', 'dummy-token-12345');
        
        // Navbar 상태 업데이트를 위한 커스텀 이벤트 발생
        window.dispatchEvent(new Event('authChange'));
        
        // 메인 페이지로 이동 (바로 관리자 페이지로 가지 않음)
        navigate('/');
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7] px-6">
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

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1.5">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 outline-none transition-all bg-[#F9FAFB]"
                placeholder="admin@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1.5">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 outline-none transition-all bg-[#F9FAFB]"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 bg-[#222222] text-white rounded-lg font-medium hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
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
    </div>
  );
};

export default Login;