// 연락처 섹션 컴포넌트 - 푸터 및 연락 정보
import React from 'react';
import { Mail, Linkedin, Twitter, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
  return (
    <footer id="contact" className="py-16 md:py-24 px-6 relative overflow-hidden bg-white">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* 메인 연락처 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#222222] mb-6 md:mb-8 tracking-tight">
            Have a project in mind?
          </h2>
          <p className="text-lg md:text-xl text-[#333333]/70 mb-10 md:mb-12 max-w-2xl mx-auto px-4">
            I'm currently available for freelance work and new opportunities.
            Let's build something amazing together.
          </p>

          {/* 이메일 연락 버튼 */}
          <motion.a
            href="mailto:hello@example.com"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(74, 144, 226, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-[#4A90E2] text-white text-base md:text-lg font-medium rounded-full transition-all duration-300 shadow-xl shadow-[#4A90E2]/20"
          >
            <Mail className="w-5 h-5" />
            Say Hello
          </motion.a>
        </motion.div>

        {/* 푸터 영역 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-20 pt-8 md:pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-sm text-[#333333]/60"
        >
          {/* 저작권 정보 */}
          <p>© {new Date().getFullYear()} NexBot Portfolio. All rights reserved.</p>

          {/* 소셜 미디어 링크 */}
          <div className="flex items-center gap-6 md:gap-8 mt-6 md:mt-0">
            {['LinkedIn', 'Twitter', 'GitHub'].map((social) => (
              <a 
                key={social} 
                href="#" 
                className="group flex items-center hover:text-[#4A90E2] transition-colors"
              >
                {social} 
                <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* 애니메이션이 있는 장식용 그라디언트 블러 */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-t from-[#A3BFD1]/30 to-transparent rounded-full blur-[80px] md:blur-[100px] -z-10 pointer-events-none"
      />
    </footer>
  );
};

export default Contact;