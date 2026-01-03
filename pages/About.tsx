// 자기소개 페이지 컴포넌트
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Award, GraduationCap, Code2, User } from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin'; // 임시로 데이터 가져오기 위해 사용
import Navbar from '../components/Navbar';
import Contact from '../components/Contact';

const About: React.FC = () => {
  // 실제로는 별도의 API나 전역 상태에서 가져와야 하지만, 편의상 useAdmin의 초기값을 사용
  const { profile } = useAdmin();

  // 스크롤을 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F7F7F7] min-h-screen">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* 프로필 헤더 섹션 */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
            {/* 프로필 이미지 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0 bg-gray-100"
            >
              {profile.image ? (
                <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <User size={64} />
                </div>
              )}
            </motion.div>

            {/* 기본 정보 */}
            <div className="flex-1 text-center md:text-left">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-bold text-[#222222] mb-4"
              >
                {profile.name}
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[#333333]/70 text-lg mb-6 max-w-2xl"
              >
                {profile.bio}
              </motion.p>
              
              {/* 소셜 링크 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center md:justify-start gap-4"
              >
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 px-4 py-2 bg-[#222222] text-white rounded-full hover:bg-black transition-colors">
                  <Mail size={18} /> Email Me
                </a>
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-[#333333] rounded-full hover:bg-gray-200 transition-colors">
                    <Github size={18} /> GitHub
                  </a>
                )}
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 왼쪽: 상세 소개 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-2 bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-[#222222] mb-6 flex items-center gap-2">
                <User className="text-[#4A90E2]" /> About Me
              </h2>
              <div className="prose prose-lg text-[#333333]/80 whitespace-pre-line leading-relaxed">
                {profile.about}
              </div>
            </motion.div>

            {/* 오른쪽: 스펙 정보 */}
            <div className="space-y-8">
              
              {/* 학력 */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-bold text-[#222222] mb-4 flex items-center gap-2">
                  <GraduationCap className="text-[#4A90E2]" size={20} /> Education
                </h3>
                <div className="space-y-4">
                  {profile.education.map((edu, idx) => (
                    <div key={idx} className="border-l-2 border-gray-100 pl-4">
                      <h4 className="font-bold text-[#222222]">{edu.school}</h4>
                      <p className="text-sm text-[#333333]/70">{edu.degree}</p>
                      <p className="text-xs text-[#333333]/50 mt-1">{edu.period}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 자격증 */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-bold text-[#222222] mb-4 flex items-center gap-2">
                  <Award className="text-[#4A90E2]" size={20} /> Certificates
                </h3>
                <div className="space-y-4">
                  {profile.certificates.map((cert, idx) => (
                    <div key={idx} className="border-l-2 border-gray-100 pl-4">
                      <h4 className="font-bold text-[#222222]">{cert.name}</h4>
                      <p className="text-sm text-[#333333]/70">{cert.issuer}</p>
                      <p className="text-xs text-[#333333]/50 mt-1">{cert.date}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 기술 스택 */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-bold text-[#222222] mb-4 flex items-center gap-2">
                  <Code2 className="text-[#4A90E2]" size={20} /> Skills
                </h3>
                <div className="space-y-4">
                  {profile.skills.map((skillGroup, idx) => (
                    <div key={idx}>
                      <h4 className="text-xs font-bold text-[#333333]/50 uppercase tracking-wider mb-2">{skillGroup.category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {skillGroup.items.map((item, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-50 text-[#333333] text-xs rounded-md border border-gray-200">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </main>
      
      <Contact />
    </div>
  );
};

export default About;