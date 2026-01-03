import React, { useRef } from 'react';
import { X, Upload, Image as ImageIcon, PlusCircle, MinusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Profile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: Profile;
  setFormData: React.Dispatch<React.SetStateAction<Profile>>;
  onSave: (e: React.FormEvent) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSave
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 업로드 핸들러
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // 학력 추가/삭제/수정
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { school: '', degree: '', period: '' }]
    });
  };
  const removeEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index)
    });
  };
  const updateEducation = (index: number, field: string, value: string) => {
    const newEdu = [...formData.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    setFormData({ ...formData, education: newEdu });
  };

  // 자격증 추가/삭제/수정
  const addCertificate = () => {
    setFormData({
      ...formData,
      certificates: [...formData.certificates, { name: '', issuer: '', date: '' }]
    });
  };
  const removeCertificate = (index: number) => {
    setFormData({
      ...formData,
      certificates: formData.certificates.filter((_, i) => i !== index)
    });
  };
  const updateCertificate = (index: number, field: string, value: string) => {
    const newCert = [...formData.certificates];
    newCert[index] = { ...newCert[index], [field]: value };
    setFormData({ ...formData, certificates: newCert });
  };

  // 기술 스택 추가/삭제/수정
  const addSkillCategory = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, { category: '', items: [] }]
    });
  };
  const removeSkillCategory = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index)
    });
  };
  const updateSkillCategory = (index: number, value: string) => {
    const newSkills = [...formData.skills];
    newSkills[index] = { ...newSkills[index], category: value };
    setFormData({ ...formData, skills: newSkills });
  };
  const updateSkillItems = (index: number, value: string) => {
    const newSkills = [...formData.skills];
    // 쉼표로 구분된 문자열을 배열로 변환
    newSkills[index] = { ...newSkills[index], items: value.split(',').map(s => s.trim()).filter(s => s !== '') };
    setFormData({ ...formData, skills: newSkills });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h2 className="text-xl font-bold text-[#222222]">프로필 수정</h2>
              <button onClick={onClose} className="text-[#333333]/50 hover:text-[#222222] transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="profileForm" onSubmit={onSave} className="space-y-8">
                
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
                      />
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-[#333333] rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                      >
                        <Upload size={16} /> 사진 변경
                      </button>
                      <p className="text-xs text-[#333333]/50 mt-2">권장 사이즈: 400x400px</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333333]/60 mb-1">이름</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333333]/60 mb-1">한 줄 소개 (Bio)</label>
                    <input 
                      type="text" 
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333333]/60 mb-1">상세 소개 (About Me)</label>
                    <textarea 
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
                      <label className="block text-xs font-bold text-[#333333]/60 mb-1">Email</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#333333]/60 mb-1">GitHub URL</label>
                      <input 
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
                    <button type="button" onClick={addEducation} className="text-sm text-[#4A90E2] flex items-center gap-1 hover:underline">
                      <PlusCircle size={16} /> 추가
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
                      <button type="button" onClick={() => removeEducation(idx)} className="p-2 text-red-400 hover:text-red-600">
                        <MinusCircle size={20} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* 자격증 */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-[#4A90E2] uppercase tracking-wider">자격증 (Certificates)</h3>
                    <button type="button" onClick={addCertificate} className="text-sm text-[#4A90E2] flex items-center gap-1 hover:underline">
                      <PlusCircle size={16} /> 추가
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
                      <button type="button" onClick={() => removeCertificate(idx)} className="p-2 text-red-400 hover:text-red-600">
                        <MinusCircle size={20} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* 기술 스택 */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-[#4A90E2] uppercase tracking-wider">기술 스택 (Skills)</h3>
                    <button type="button" onClick={addSkillCategory} className="text-sm text-[#4A90E2] flex items-center gap-1 hover:underline">
                      <PlusCircle size={16} /> 카테고리 추가
                    </button>
                  </div>
                  {formData.skills.map((skill, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative">
                      <button 
                        type="button" 
                        onClick={() => removeSkillCategory(idx)} 
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      >
                        <X size={16} />
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
              >
                취소
              </button>
              <button 
                type="submit"
                form="profileForm"
                className="flex-1 py-2.5 bg-[#222222] text-white rounded-lg font-medium hover:bg-black transition-colors"
              >
                저장하기
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;