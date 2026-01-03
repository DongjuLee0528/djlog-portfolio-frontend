import React, { useRef } from 'react';
import { X, ExternalLink, MinusCircle, PlusCircle, Image as ImageIcon, Upload, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formData: Project;
  setFormData: React.Dispatch<React.SetStateAction<Project>>;
  onSave: (e: React.FormEvent) => void;
  onAddLink: () => void;
  onRemoveLink: (index: number) => void;
  onUpdateLink: (index: number, field: 'label' | 'url' | 'description', value: string) => void;
  onAddQna: () => void;
  onRemoveQna: (index: number) => void;
  onUpdateQna: (index: number, field: 'question' | 'answer', value: string) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  isEditing,
  formData,
  setFormData,
  onSave,
  onAddLink,
  onRemoveLink,
  onUpdateLink,
  onAddQna,
  onRemoveQna,
  onUpdateQna
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 업로드 핸들러
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // 파일을 Base64 문자열로 변환하여 이미지 URL로 사용
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
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
              <h2 className="text-xl font-bold text-[#222222]">
                {isEditing ? '프로젝트 수정' : '새 프로젝트 추가'}
              </h2>
              <button 
                onClick={onClose}
                className="text-[#333333]/50 hover:text-[#222222] transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="projectForm" onSubmit={onSave} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#4A90E2] uppercase tracking-wider">기본 정보</h3>
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">프로젝트 제목</label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none"
                      placeholder="예: Linear Clone"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-1">카테고리</label>
                      <input 
                        type="text" 
                        value={formData.category || ''}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none"
                        placeholder="예: Web App"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-1">상태</label>
                      <select 
                        value={formData.status || 'Draft'}
                        onChange={(e) => setFormData({...formData, status: e.target.value as 'Published' | 'Draft'})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none bg-white"
                      >
                        <option value="Draft">작성중 (Draft)</option>
                        <option value="Published">공개됨 (Published)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">설명</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none h-20 resize-none"
                      placeholder="프로젝트에 대한 간단한 설명을 입력하세요..."
                    />
                  </div>
                </div>

                {/* Image Section */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-[#4A90E2] uppercase tracking-wider">이미지 설정</h3>
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-2">대표 이미지</label>
                    
                    <div className="flex flex-col gap-4">
                      {/* 탭 버튼 (URL vs Upload) - 간단하게 구현 */}
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <div className="relative">
                            <LinkIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                              type="url" 
                              value={formData.image?.startsWith('data:') ? '' : formData.image || ''}
                              onChange={(e) => setFormData({...formData, image: e.target.value})}
                              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none"
                              placeholder="이미지 URL 입력 (https://...)"
                              disabled={!!formData.image?.startsWith('data:')}
                            />
                          </div>
                        </div>
                        <div className="relative">
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
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-[#333333] rounded-lg hover:bg-gray-200 transition-colors font-medium whitespace-nowrap"
                          >
                            <Upload size={18} />
                            파일 업로드
                          </button>
                        </div>
                      </div>

                      {/* Image Preview */}
                      <div className="w-full h-48 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center relative group">
                        {formData.image ? (
                          <>
                            <img 
                              src={formData.image} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Invalid+Image';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({...formData, image: ''});
                                if (fileInputRef.current) fileInputRef.current.value = '';
                              }}
                              className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-red-500 hover:bg-white hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                              title="이미지 제거"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <div className="text-gray-400 flex flex-col items-center">
                            <ImageIcon size={32} className="mb-2" />
                            <span className="text-sm">이미지 미리보기</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Links Section (통합됨) */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-[#4A90E2] uppercase tracking-wider">프로젝트 링크</h3>
                    <button 
                      type="button"
                      onClick={onAddLink}
                      className="text-sm text-[#4A90E2] font-medium flex items-center gap-1 hover:underline"
                    >
                      <PlusCircle size={16} /> 링크 추가
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.links?.map((link, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                        <button 
                          type="button"
                          onClick={() => onRemoveLink(idx)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="링크 삭제"
                        >
                          <X size={16} />
                        </button>
                        
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <div className="w-1/3">
                              <label className="block text-xs font-bold text-[#333333]/60 mb-1">라벨 (Label)</label>
                              <input 
                                type="text" 
                                value={link.label}
                                onChange={(e) => onUpdateLink(idx, 'label', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none bg-white font-medium"
                                placeholder="예: GitHub, Live Demo"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-xs font-bold text-[#333333]/60 mb-1">URL</label>
                              <input 
                                type="url" 
                                value={link.url}
                                onChange={(e) => onUpdateLink(idx, 'url', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none bg-white"
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#333333]/60 mb-1">설명 (Description)</label>
                            <input 
                              type="text" 
                              value={link.description || ''}
                              onChange={(e) => onUpdateLink(idx, 'description', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none bg-white text-sm"
                              placeholder="예: 메인 소스코드 저장소, AWS 배포 서버"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Q&A Section */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-[#4A90E2] uppercase tracking-wider">Q&A 인터뷰</h3>
                    <button 
                      type="button"
                      onClick={onAddQna}
                      className="text-sm text-[#4A90E2] font-medium flex items-center gap-1 hover:underline"
                    >
                      <PlusCircle size={16} /> 질문 추가
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {formData.qna?.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                        <button 
                          type="button"
                          onClick={() => onRemoveQna(idx)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="질문 삭제"
                        >
                          <X size={16} />
                        </button>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-[#333333]/60 mb-1">질문 (Question)</label>
                            <input 
                              type="text" 
                              value={item.question}
                              onChange={(e) => onUpdateQna(idx, 'question', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none bg-white font-medium"
                              placeholder="예: 어떤 역할을 맡았나요?"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#333333]/60 mb-1">답변 (Answer)</label>
                            <textarea 
                              value={item.answer}
                              onChange={(e) => onUpdateQna(idx, 'answer', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none bg-white h-24 resize-none text-sm leading-relaxed"
                              placeholder="답변을 입력하세요..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                form="projectForm"
                className="flex-1 py-2.5 bg-[#222222] text-white rounded-lg font-medium hover:bg-black transition-colors"
              >
                {isEditing ? '변경사항 저장' : '프로젝트 생성'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;