// 자기소개 페이지 컴포넌트
import React, { useEffect, useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Github, Award, GraduationCap, Code2, User, Trophy, Star, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import Contact from '../components/Contact';
import type { Profile } from '../src/types';
import { normalizeProfile } from '../utils/normalize';
import config from '../src/config';
import { apiTracker } from '../utils/apiCallTracker';

// 날짜 문자열을 파싱하여 비교 가능한 숫자로 변환하는 유틸리티 함수
// 예: "2024", "2023.05", "2022-10-01" 등을 지원
const parseDateToNumber = (dateStr: string | undefined): number => {
  if (!dateStr) return 0;
  
  // 숫자가 아닌 문자(예: ".", "-", " ")를 제거하고 숫자로 변환 시도
  const cleanStr = dateStr.replace(/[^0-9]/g, '');
  
  if (cleanStr.length === 0) return 0;
  
  // YYYY (4자리) -> YYYY0000 으로 패딩하여 비교 일관성 유지
  // YYYYMM (6자리) -> YYYYMM00
  // YYYYMMDD (8자리)
  let paddedStr = cleanStr;
  if (cleanStr.length === 4) paddedStr = cleanStr + '0000';
  else if (cleanStr.length === 6) paddedStr = cleanStr + '00';
  else if (cleanStr.length > 8) paddedStr = cleanStr.substring(0, 8);
  
  const parsed = parseInt(paddedStr, 10);
  return isNaN(parsed) ? 0 : parsed;
};

// 백엔드의 issueDate 포맷("YYYY-MM-DD" 등)을 프론트엔드 표시 포맷("YYYY.MM")으로 변환
const formatDisplayDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '';
  // 만약 "YYYY-MM-DD" 형식이면 "YYYY.MM"으로 변환
  const match = dateStr.match(/^(\d{4})-(\d{2})(?:-\d{2})?$/);
  if (match) {
    return `${match[1]}.${match[2]}`;
  }
  // 그 외의 형식은 그대로 반환
  return dateStr;
};

const About: React.FC = memo(() => {
  console.log('🔄 About 컴포넌트 mount/re-mount');
  const [profile, setProfile] = useState<Profile>({
    name: "",
    bio: "",
    about: "",
    email: "",
    github: "",
    education: [],
    achievements: [],
    certificates: [],
    skills: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // 자격증 아코디언 상태
  const [isCertificatesExpanded, setIsCertificatesExpanded] = useState(false);

  // 프로필 데이터 로드 함수 - useCallback으로 메모이제이션
  const loadProfile = useCallback(async () => {
    console.log('📞 About: /api/profile 호출 시작 (단일 최적화된 호출)');
    apiTracker.track('/api/profile');
    try {
      const response = await fetch(`${config.API_URL}/api/profile`);
      console.log('✅ About: /api/profile 응답 완료 (단일 최적화된 호출)');
      if (response.ok) {
        const data = await response.json();
        const normalizedProfile = normalizeProfile(data);
        setProfile(normalizedProfile);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 프로필 데이터 로드
  useEffect(() => {
    console.log('⚡ About: useEffect 실행 - loadProfile 호출 (단일 최적화된 호출)');
    loadProfile();
  }, [loadProfile]);

  // 스크롤을 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Achievement 카테고리에 따른 아이콘 반환 헬퍼
  const getAchievementIcon = (category: string) => {
    switch (category) {
      case 'leadership': return <User size={16} className="text-[#4A90E2]" />;
      case 'mentoring': return <Star size={16} className="text-[#8E54E9]" />;
      case 'award': return <Trophy size={16} className="text-yellow-500" />;
      default: return <Award size={16} className="text-[#333333]/50" />;
    }
  };

  // Achievement 카테고리에 따른 라벨 반환 헬퍼
  const getAchievementLabel = (category: string) => {
    switch (category) {
      case 'leadership': return 'Leadership';
      case 'mentoring': return 'Mentoring';
      case 'award': return 'Award';
      default: return 'Experience';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#F7F7F7] min-h-screen">
        <Navbar />
        <main className="pt-32 pb-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="w-12 h-12 border-4 border-[#4A90E2]/30 border-t-[#4A90E2] rounded-full animate-spin mb-4 mx-auto"></div>
            <div className="text-[#333333]/60 font-medium">Loading profile...</div>
          </div>
        </main>
      </div>
    );
  }

  // 1. Achievements 정렬 (period 기준 내림차순)
  // 원본 배열을 복사한 후 정렬하여 state mutate 방지
  const sortedAchievements = [...(profile.achievements || [])].sort((a, b) => {
    // period 문자열에서 시작 연도(또는 날짜)를 추출하여 숫자로 변환
    // 예: "2023.03 - 2023.12" -> "2023.03" 추출 시도. 단순 문자열 비교보다 안전하게 파싱.
    const dateA = a.period ? a.period.split('-')[0].trim() : '';
    const dateB = b.period ? b.period.split('-')[0].trim() : '';
    
    const numA = parseDateToNumber(dateA);
    const numB = parseDateToNumber(dateB);
    
    // 내림차순 정렬 (큰 숫자가 먼저)
    return numB - numA;
  });

  // 2. Certificates 정렬 (issueDate 기준 내림차순)
  const sortedCertificates = [...(profile.certificates || [])].sort((a, b) => {
    const dateA = a.issueDate;
    const dateB = b.issueDate;
    
    const numA = parseDateToNumber(dateA);
    const numB = parseDateToNumber(dateB);
    
    // 둘 다 유효한 날짜가 없을 경우 원래 순서 유지
    if (numA === 0 && numB === 0) return 0;
    // 하나만 없는 경우 날짜가 없는 것을 뒤로 배치
    if (numA === 0) return 1;
    if (numB === 0) return -1;
    
    return numB - numA;
  });

  // 자격증 표시 로직: 기본 3개, 펼치면 전체 (정렬된 배열 사용)
  const displayedCertificates = isCertificatesExpanded 
    ? sortedCertificates 
    : sortedCertificates.slice(0, 3);
  
  const hasMoreCertificates = sortedCertificates.length > 3;

  return (
    <div className="bg-[#F7F7F7] min-h-screen">
      <Navbar />

      <main className="pt-32 pb-20 px-6" role="main" aria-label="개인 정보 페이지">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          
          {/* 1. Profile Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start"
          >
            {/* 프로필 이미지 */}
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0 bg-gray-100">
              {profile.image ? (
                <img 
                  src={profile.image} 
                  alt={profile.name} 
                  loading="lazy"
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <User size={64} />
                </div>
              )}
            </div>

            {/* 기본 정보 */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-[#222222] mb-4">
                {profile.name}
              </h1>
              <p className="text-[#333333]/70 text-lg mb-6 max-w-2xl">
                {profile.bio}
              </p>
              
              {/* 소셜 링크 */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 px-4 py-2 bg-[#222222] text-white rounded-full hover:bg-black transition-colors">
                  <Mail size={18} /> Email Me
                </a>
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-[#333333] rounded-full hover:bg-gray-200 transition-colors">
                    <Github size={18} /> GitHub
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* 2. About Section */}
          {profile.about && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-[#222222] mb-6 flex items-center gap-2">
                <User className="text-[#4A90E2]" /> About Me
              </h2>
              <div className="prose prose-lg text-[#333333]/80 whitespace-pre-line leading-relaxed">
                {profile.about}
              </div>
            </motion.div>
          )}

          {/* 3. Skills Section */}
          {profile.skills && profile.skills.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-[#222222] mb-6 flex items-center gap-2">
                <Code2 className="text-[#4A90E2]" /> Skills
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {profile.skills.map((skillGroup, idx) => (
                  <div key={idx} className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <h4 className="text-sm font-bold text-[#333333]/50 uppercase tracking-wider mb-3">{skillGroup.category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((item, i) => (
                        <span key={i} className="px-2.5 py-1 bg-white text-[#333333] text-sm font-medium rounded-lg border border-gray-200 shadow-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 4. Education Section */}
          {profile.education && profile.education.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-[#222222] mb-6 flex items-center gap-2">
                <GraduationCap className="text-[#4A90E2]" /> Education
              </h2>
              <div className="space-y-6">
                {profile.education.map((edu, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b border-gray-50 last:border-0 pb-6 last:pb-0">
                    <div>
                      <h4 className="text-lg font-bold text-[#222222]">{edu.school}</h4>
                      <p className="text-base text-[#333333]/70 mt-1">{edu.degree}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 text-sm font-medium text-[#333333]/50 bg-gray-50 px-3 py-1 rounded-full self-start">
                      {edu.period}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 5. Achievements Section (New) */}
          {sortedAchievements.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100 relative overflow-hidden"
            >
              {/* 장식용 배경 요소 */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#4A90E2]/5 to-[#8E54E9]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

              <h2 className="text-2xl font-bold text-[#222222] mb-8 flex items-center gap-2 relative z-10">
                <Trophy className="text-[#4A90E2]" /> Leadership & Awards
              </h2>
              
              <div className="space-y-8 relative z-10">
                {sortedAchievements.map((achieve, idx) => (
                  <div key={idx} className="relative pl-8 md:pl-0">
                    {/* Timeline dot for mobile, left border for desktop */}
                    <div className="md:hidden absolute left-0 top-1.5 w-3 h-3 rounded-full bg-[#4A90E2]/20 border-2 border-[#4A90E2]" />
                    <div className="md:hidden absolute left-1.5 top-5 bottom-[-2rem] w-[1px] bg-gray-100 last:hidden" />
                    
                    <div className="md:flex md:gap-8 group">
                      {/* Period Column (Desktop) */}
                      <div className="hidden md:block w-32 shrink-0 pt-1">
                        <span className="text-sm font-bold text-[#333333]/40 uppercase tracking-wider">{achieve.period}</span>
                      </div>
                      
                      {/* Content Column */}
                      <div className="flex-1 md:border-l-2 md:border-gray-100 md:pl-8 md:pb-10 md:group-last:pb-0 md:group-last:border-transparent relative">
                        {/* Timeline dot for desktop */}
                        <div className="hidden md:block absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-[#4A90E2] opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all" />
                        
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-[#222222]">{achieve.title}</h4>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-xs font-semibold text-[#333333]/70 border border-gray-200">
                            {getAchievementIcon(achieve.category)}
                            {getAchievementLabel(achieve.category)}
                          </span>
                        </div>
                        <p className="text-[#4A90E2] font-medium mb-3">{achieve.organization}</p>
                        
                        {/* Period for Mobile */}
                        <p className="md:hidden text-xs font-bold text-[#333333]/40 uppercase tracking-wider mb-4">{achieve.period}</p>
                        
                        <p className="text-[#333333]/80 leading-relaxed">{achieve.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 6. Certificates Section (Collapsible Grid) */}
          {sortedCertificates.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#222222] flex items-center gap-2">
                  <Award className="text-[#4A90E2]" /> Certificates
                </h2>
                <span className="text-sm font-medium text-[#333333]/40 bg-gray-50 px-3 py-1 rounded-full">
                  Total {sortedCertificates.length}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence initial={false}>
                  {displayedCertificates.map((cert, idx) => (
                    <motion.div 
                      key={cert.name + idx}
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex flex-col justify-between group hover:border-[#4A90E2]/30 transition-colors"
                    >
                      <div>
                        <h4 className="text-base font-bold text-[#222222] group-hover:text-[#4A90E2] transition-colors line-clamp-2">{cert.name}</h4>
                        <p className="text-sm text-[#333333]/60 mt-1">{cert.issuer}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-200/60">
                        {/* 백엔드 포맷(YYYY-MM-DD)이 넘어올 수 있으므로, 화면 표시 시엔 YYYY.MM으로 변환하여 표시 */}
                        <p className="text-xs font-medium text-[#333333]/40">
                          {formatDisplayDate(cert.issueDate)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* + N more 버튼 */}
              {hasMoreCertificates && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setIsCertificatesExpanded(!isCertificatesExpanded)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-[#333333] text-sm font-semibold rounded-full transition-colors border border-gray-200"
                  >
                    {isCertificatesExpanded ? (
                      <>
                        <ChevronUp size={16} />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        +{sortedCertificates.length - 3} More Certificates
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          )}

        </div>
      </main>
      
      <Contact />
    </div>
  );
});

About.displayName = 'About';

export default About;
