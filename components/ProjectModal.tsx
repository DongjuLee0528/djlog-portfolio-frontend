import React from 'react';
import { X, Github, ExternalLink, MinusCircle, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formData: Project;
  setFormData: React.Dispatch<React.SetStateAction<Project>>;
  onSave: (e: React.FormEvent) => void;
  onAddGithubLink: () => void;
  onRemoveGithubLink: (index: number) => void;
  onUpdateGithubLink: (index: number, field: 'label' | 'url', value: string) => void;
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
  onAddGithubLink,
  onRemoveGithubLink,
  onUpdateGithubLink,
  onAddQna,
  onRemoveQna,
  onUpdateQna
}) => {
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
                {isEditing ? 'Edit Project' : 'New Project'}
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
                  <h3 className="text-sm font-bold text-[#4A90E2] uppercase tracking-wider">Basic Info</h3>
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">Project Title</label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none"
                      placeholder="e.g. Linear Clone"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-1">Category</label>
                      <input 
                        type="text" 
                        value={formData.category || ''}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none"
                        placeholder="e.g. Web App"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-1">Status</label>
                      <select 
                        value={formData.status || 'Draft'}
                        onChange={(e) => setFormData({...formData, status: e.target.value as 'Published' | 'Draft'})}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none bg-white"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">Description</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none h-20 resize-none"
                      placeholder="Short description..."
                    />
                  </div>
                </div>

                {/* Links Section */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-[#4A90E2] uppercase tracking-wider">Links</h3>
                  
                  {/* GitHub Links */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-[#333333]">GitHub Repositories</label>
                    {formData.githubLinks?.map((link, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input 
                          type="text" 
                          value={link.label}
                          onChange={(e) => onUpdateGithubLink(idx, 'label', e.target.value)}
                          className="w-1/3 px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none"
                          placeholder="Label (e.g. Frontend)"
                        />
                        <input 
                          type="url" 
                          value={link.url}
                          onChange={(e) => onUpdateGithubLink(idx, 'url', e.target.value)}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none"
                          placeholder="https://github.com/..."
                        />
                        <button 
                          type="button"
                          onClick={() => onRemoveGithubLink(idx)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          disabled={(formData.githubLinks?.length || 0) <= 1}
                        >
                          <MinusCircle size={20} />
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={onAddGithubLink}
                      className="text-sm text-[#4A90E2] font-medium flex items-center gap-1 hover:underline"
                    >
                      <PlusCircle size={16} /> Add another repository
                    </button>
                  </div>

                  {/* Demo Link */}
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">Live Demo Link</label>
                    <div className="relative">
                      <ExternalLink size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="url" 
                        value={formData.demoLink || ''}
                        onChange={(e) => setFormData({...formData, demoLink: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none"
                        placeholder="https://my-project.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Q&A Section */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-[#4A90E2] uppercase tracking-wider">Q&A Interview</h3>
                    <button 
                      type="button"
                      onClick={onAddQna}
                      className="text-sm text-[#4A90E2] font-medium flex items-center gap-1 hover:underline"
                    >
                      <PlusCircle size={16} /> Add Question
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {formData.qna?.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                        <button 
                          type="button"
                          onClick={() => onRemoveQna(idx)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove Question"
                        >
                          <X size={16} />
                        </button>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-[#333333]/60 mb-1">Question</label>
                            <input 
                              type="text" 
                              value={item.question}
                              onChange={(e) => onUpdateQna(idx, 'question', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none bg-white font-medium"
                              placeholder="e.g. What was your role?"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#333333]/60 mb-1">Answer</label>
                            <textarea 
                              value={item.answer}
                              onChange={(e) => onUpdateQna(idx, 'answer', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#4A90E2] outline-none bg-white h-24 resize-none text-sm leading-relaxed"
                              placeholder="Write your answer here..."
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
                Cancel
              </button>
              <button 
                type="submit"
                form="projectForm"
                className="flex-1 py-2.5 bg-[#222222] text-white rounded-lg font-medium hover:bg-black transition-colors"
              >
                {isEditing ? 'Save Changes' : 'Create Project'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;