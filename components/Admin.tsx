// 관리자 대시보드 컴포넌트 (View)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, LayoutDashboard, ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdmin } from '../hooks/useAdmin';
import ProjectModal from './ProjectModal';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  
  // 커스텀 훅에서 로직과 상태 가져오기
  const {
    projects,
    isModalOpen,
    setIsModalOpen,
    editingProject,
    formData,
    setFormData,
    handleLogout,
    handleDelete,
    openModal,
    handleSave,
    addGithubLink,
    removeGithubLink,
    updateGithubLink,
    addQna,
    removeQna,
    updateQna
  } = useAdmin();

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full text-[#333333] transition-colors"
              title="홈으로 돌아가기"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2 text-[#222222] font-bold text-lg">
              <LayoutDashboard className="text-[#4A90E2]" size={20} />
              관리자 대시보드
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            로그아웃
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Stats & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#222222]">프로젝트 관리</h1>
            <p className="text-[#333333]/60 text-sm mt-1">포트폴리오 프로젝트를 등록하고 관리하세요.</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 bg-[#222222] text-white px-6 py-3 rounded-lg font-medium hover:bg-black transition-colors shadow-lg shadow-black/10"
          >
            <Plus size={18} />
            새 프로젝트
          </button>
        </div>

        {/* Project List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-[#333333]/50">
                  <th className="px-6 py-4 font-semibold">프로젝트명</th>
                  <th className="px-6 py-4 font-semibold">카테고리</th>
                  <th className="px-6 py-4 font-semibold">링크</th>
                  <th className="px-6 py-4 font-semibold">상태</th>
                  <th className="px-6 py-4 font-semibold text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <motion.tr 
                    key={project.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-[#222222]">{project.title}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#333333]/70">
                      {project.category}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {project.githubLinks && project.githubLinks.map((link, idx) => (
                          <a 
                            key={idx}
                            href={link.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-[#333333] hover:bg-[#4A90E2] hover:text-white transition-colors"
                          >
                            <Github size={12} /> {link.label || 'Repo'}
                          </a>
                        ))}
                        {project.demoLink && (
                          <a 
                            href={project.demoLink} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-[#333333] hover:bg-[#4A90E2] hover:text-white transition-colors"
                          >
                            <ExternalLink size={12} /> Demo
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'Published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status === 'Published' ? '공개됨' : '작성중'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openModal(project)}
                          className="p-2 text-[#333333]/60 hover:text-[#4A90E2] hover:bg-blue-50 rounded-lg transition-colors" 
                          title="수정"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(project.id)}
                          className="p-2 text-[#333333]/60 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {projects.length === 0 && (
            <div className="p-12 text-center text-[#333333]/40">
              등록된 프로젝트가 없습니다. 첫 번째 프로젝트를 추가해보세요!
            </div>
          )}
        </div>
      </main>

      {/* Project Modal Component */}
      <ProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditing={!!editingProject}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        onAddGithubLink={addGithubLink}
        onRemoveGithubLink={removeGithubLink}
        onUpdateGithubLink={updateGithubLink}
        onAddQna={addQna}
        onRemoveQna={removeQna}
        onUpdateQna={updateQna}
      />
    </div>
  );
};

export default Admin;