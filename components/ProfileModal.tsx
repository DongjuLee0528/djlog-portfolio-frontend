// 프로필 수정 모달 컴포넌트 - 개인 프로필 정보 관리를 위한 폼
import React, { useRef, useState, useEffect, memo, useCallback } from 'react';
import { X, Upload, Image as ImageIcon, PlusCircle, MinusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Profile } from '../types';
import { apiClient } from '../utils/apiClient';

// 프로필 모달 컴포넌트의 props 타입 정의
interface ProfileModalProps {
  isOpen: boolean; // 모달 표시 여부
  onClose: () => void; // 모달 닫기 핸들러
  formData: Profile; // 프로필 폼 데이터
  setFormData: React.Dispatch<React.SetStateAction<Profile>>; // 폼 데이터 업데이트 함수
  onSave: (e: React.FormEvent) => void; // 저장 핸들러
}

const ProfileModal: React.FC<ProfileModalProps> = memo(({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSave
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 모달이 열릴 때 body 스크롤 잠금과 포커스 관리
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // 첫 번째 포커스 가능한 요소로 포커스 이동
      const firstFocusableElement = document.querySelector('#profileForm input, #profileForm textarea, #profileForm button') as HTMLElement;
      if (firstFocusableElement) {
        setTimeout(() => firstFocusableElement.focus(), 100);
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // 파일 업로드 핸들러 - useCallback으로 메모이제이션
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      try {
        const data = await apiClient<{ url: string }>('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });
        setFormData({ ...formData, image: data.url });
      } catch (error) {
        console.error('File upload error:', error);
        alert('파일 업로드 중 오류가 발생했습니다.');
      } finally {
        setIsUploading(false);
      }
    }
  }, [formData, setFormData]);

  // 파일 선택 버튼 클릭 핸들러 - useCallback으로 메모이제이션
  const handleFileButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 학력 추가/삭제/수정 - useCallback으로 메모이제이션
  const addEducation = useCallback(() => {
    setFormData({
      ...formData,
      education: [...formData.education, { school: '', degree: '', period: '' }]
    });
  }, [formData, setFormData]);

  const removeEducation = useCallback((index: number) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index)
    });
  }, [formData, setFormData]);

  const updateEducation = useCallback((index: number, field: string, value: string) => {
    const newEdu = [...formData.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    setFormData({ ...formData, education: newEdu });
  }, [formData, setFormData]);

  // 자격증 추가/삭제/수정 - useCallback으로 메모이제이션
  const addCertificate = useCallback(() => {
    setFormData({
      ...formData,
      certificates: [...formData.certificates, { name: '', issuer: '', date: '' }]
    });
  }, [formData, setFormData]);

  const removeCertificate = useCallback((index: number) => {
    setFormData({
      ...formData,
      certificates: formData.certificates.filter((_, i) => i !== index)
    });
  }, [formData, setFormData]);

  const updateCertificate = useCallback((index: number, field: string, value: string) => {
    const newCert = [...formData.certificates];
    newCert[index] = { ...newCert[index], [field]: value };
    setFormData({ ...formData, certificates: newCert });
  }, [formData, setFormData]);

  // 기술 스택 추가/삭제/수정 - useCallback으로 메모이제이션
  const addSkillCategory = useCallback(() => {
    setFormData({
      ...formData,
      skills: [...formData.skills, { category: '', items: [] }]
    });
  }, [formData, setFormData]);

  const removeSkillCategory = useCallback((index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index)
    });
  }, [formData, setFormData]);

  const updateSkillCategory = useCallback((index: number, value: string) => {
    const newSkills = [...formData.skills];
    newSkills[index] = { ...newSkills[index], category: value };
    setFormData({ ...formData, skills: newSkills });
  }, [formData, setFormData]);

  const updateSkillItems = useCallback((index: number, value: string) => {
    const newSkills = [...formData.skills];
    // 쉼표로 구분된 문자열을 배열로 변환
    newSkills[index] = { ...newSkills[index], items: value.split(',').map(s => s.trim()).filter(s => s !== '') };
    setFormData({ ...formData, skills: newSkills });
  }, [formData, setFormData]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-modal-title"
          aria-describedby="profile-modal-description"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h2
                id="profile-modal-title"
                className="text-xl font-bold text-[#222222]"
              >
                프로필 수정
              </h2>
              <button
                onClick={onClose}
                className="text-[#333333]/50 hover:text-[#222222] transition-colors"
                aria-label="모달 닫기"
                type="button"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form
                id="profileForm"
                onSubmit={onSave}
                className="space-y-8"
                role="form"
                aria-describedby="profile-modal-description"
              >
                <div id="profile-modal-description" className="absolute left-[-10000px] w-[1px] h-[1px] overflow-hidden">
                  프로필 정보를 수정할 수 있습니다.
                </div>
                
                {/* 기본 정보 */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#4A90E2] uppercase tracking-wider">기본 정보</h3>
                  
                  {/* 프로필 이미지 */}
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                      {formData.image ? (
                        <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ImageIcon size={32} />
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                        disabled={isUploading}
                      />
                      <button
                        type="button"
                        onClick={handleFileButtonClick}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-[#333333] rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUploading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            업로드 중...
                          </>
                        ) : (
                          <>
                            <Upload size={16} />
                            사진 변경
                          </>
                        )}
                      </button>
                      <p className="text-xs text-[#333333]/50 mt-2">권장 사이즈: 400x400px</p>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="profile-name"
                      className="block text-xs font-bold text-[#333333]/60 mb-1"
                    >
                      이름
                    </label>
                    <input
                      id="profile-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-bio"
                      className="block text-xs font-bold text-[#333333]/60 mb-1"
                    >
                      한 줄 소개 (Bio)
                    </label>
                    <input
                      id="profile-bio"
                      type="text"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-about"
                      className="block text-xs font-bold text-[#333333]/60 mb-1"
                    >
                      상세 소개 (About Me)
                    </label>
                    <textarea
                      id="profile-about"
                      value={formData.about}
                      onChange={(e) => setFormData({...formData, about: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none h-32 resize-none"
                    />
                  </div>
                </div>

                {/* 연락처 및 소셜 */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-[#4A90E2] uppercase tracking-wider">연락처 및 소셜</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="profile-email"
                        className="block text-xs font-bold text-[#333333]/60 mb-1"
                      >
                        Email
                      </label>
                      <input
                        id="profile-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="profile-github"
                        className="block text-xs font-bold text-[#333333]/60 mb-1"
                      >
                        GitHub URL
                      </label>
                      <input
                        id="profile-github"
                        type="url"
                        value={formData.github || ''}
                        onChange={(e) => setFormData({...formData, github: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 학력 */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-[#4A90E2] uppercase tracking-wider">학력 (Education)</h3>
                    <button
                      type="button"
                      onClick={addEducation}
                      className="text-sm text-[#4A90E2] flex items-center gap-1 hover:underline"
                      aria-label="학력 추가"
                    >
                      <PlusCircle size={16} aria-hidden="true" /> 추가
                    </button>
                  </div>
                  {formData.education.map((edu, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <input 
                          placeholder="학교명" 
                          value={edu.school} 
                          onChange={(e) => updateEducation(idx, 'school', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-gray-200 outline-none"
                        />
                        <input 
                          placeholder="학위/전공" 
                          value={edu.degree} 
                          onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-gray-200 outline-none"
                        />
                        <input 
                          placeholder="기간 (예: 2018-2022)" 
                          value={edu.period} 
                          onChange={(e) => updateEducation(idx, 'period', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-gray-200 outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEducation(idx)}
                        className="p-2 text-red-400 hover:text-red-600"
                        aria-label={`학력 ${idx + 1} 삭제`}
                      >
                        <MinusCircle size={20} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* 자격증 */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-[#4A90E2] uppercase tracking-wider">자격증 (Certificates)</h3>
                    <button
                      type="button"
                      onClick={addCertificate}
                      className="text-sm text-[#4A90E2] flex items-center gap-1 hover:underline"
                      aria-label="자격증 추가"
                    >
                      <PlusCircle size={16} aria-hidden="true" /> 추가
                    </button>
                  </div>
                  {formData.certificates.map((cert, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <input 
                          placeholder="자격증명" 
                          value={cert.name} 
                          onChange={(e) => updateCertificate(idx, 'name', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-gray-200 outline-none"
                        />
                        <input 
                          placeholder="발급기관" 
                          value={cert.issuer} 
                          onChange={(e) => updateCertificate(idx, 'issuer', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-gray-200 outline-none"
                        />
                        <input 
                          placeholder="취득일 (예: 2023.05)" 
                          value={cert.date} 
                          onChange={(e) => updateCertificate(idx, 'date', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-gray-200 outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCertificate(idx)}
                        className="p-2 text-red-400 hover:text-red-600"
                        aria-label={`자격증 ${idx + 1} 삭제`}
                      >
                        <MinusCircle size={20} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* 기술 스택 */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-[#4A90E2] uppercase tracking-wider">기술 스택 (Skills)</h3>
                    <button
                      type="button"
                      onClick={addSkillCategory}
                      className="text-sm text-[#4A90E2] flex items-center gap-1 hover:underline"
                      aria-label="기술 스택 카테고리 추가"
                    >
                      <PlusCircle size={16} aria-hidden="true" /> 카테고리 추가
                    </button>
                  </div>
                  {formData.skills.map((skill, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative">
                      <button
                        type="button"
                        onClick={() => removeSkillCategory(idx)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        aria-label={`기술 스택 카테고리 ${idx + 1} 삭제`}
                      >
                        <X size={16} aria-hidden="true" />
                      </button>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-bold text-[#333333]/60 mb-1">카테고리명</label>
                          <input 
                            placeholder="예: Frontend" 
                            value={skill.category} 
                            onChange={(e) => updateSkillCategory(idx, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#333333]/60 mb-1">기술 목록 (쉼표로 구분)</label>
                          <input 
                            placeholder="예: React, TypeScript, Next.js" 
                            value={skill.items.join(', ')} 
                            onChange={(e) => updateSkillItems(idx, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 text-[#333333] rounded-lg font-medium hover:bg-white transition-colors"
                aria-label="모달 닫고 취소"
              >
                취소
              </button>
              <button
                type="submit"
                form="profileForm"
                className="flex-1 py-2.5 bg-[#222222] text-white rounded-lg font-medium hover:bg-black transition-colors"
                aria-label="프로필 정보 저장"
              >
                저장하기
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

// displayName 설정으로 디버깅 시 컴포넌트 식별 용이
ProfileModal.displayName = 'ProfileModal';

export default ProfileModal;