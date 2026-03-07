/**
 * 연락처 섹션 컴포넌트 - 푸터 및 연락 정보
 *
 * 사이트의 연락처 정보와 소셜 미디어 링크를 표시하는 푸터 섹션입니다.
 * 이메일 연락 버튼과 소셜 미디어 링크를 제공하며,
 * 배경에 애니메이션이 적용된 장식 요소를 포함합니다.
 */

import React from 'react';
import { Mail, Linkedin, Twitter, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { CONTACT_INFO, SITE_INFO, COLORS, TYPOGRAPHY, SPACING } from '../src/constants';

/**
 * 연락처 및 푸터 컴포넌트
 *
 * @returns 연락처 정보와 소셜 링크가 포함된 푸터 섹션 JSX
 */
const Contact: React.FC = React.memo(() => {
  return (
    <footer
      id="contact"
      className="py-16 md:py-24 px-6 relative overflow-hidden bg-white"
      role="contentinfo"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* 메인 연락처 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2
            id="contact-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#222222] mb-6 md:mb-8 tracking-tight"
            tabIndex={0}
          >
            Have a project in mind?
          </h2>
          <p className="text-lg md:text-xl text-[#333333]/70 mb-10 md:mb-12 max-w-2xl mx-auto px-4">
            I'm currently available for freelance work and new opportunities.
            Let's build something amazing together.
          </p>

          {/* 이메일 연락 버튼 */}
          <motion.a
            href={`mailto:${CONTACT_INFO.EMAIL}`}
            whileHover={{ scale: 1.05, boxShadow: `0 20px 40px -10px ${COLORS.primary}66` }}
            whileTap={{ scale: 0.95 }}
            className={`inline-flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-[${COLORS.primary}] text-white text-base md:text-lg font-medium rounded-full transition-all duration-300 shadow-xl shadow-[${COLORS.primary}]/20`}
            aria-label={`${CONTACT_INFO.EMAIL}로 이메일 보내기`}
            role="button"
          >
            <Mail className="w-5 h-5" aria-hidden="true" />
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
          role="group"
          aria-label="푸터 정보"
        >
          {/* 저작권 정보 */}
          <p>© {new Date().getFullYear()} {SITE_INFO.NAME}. All rights reserved.</p>

          {/* 소셜 미디어 링크 */}
          <nav
            className="flex items-center gap-6 md:gap-8 mt-6 md:mt-0"
            role="navigation"
            aria-label="소셜 미디어 링크"
          >
            {[
              { name: 'LinkedIn', url: CONTACT_INFO.LINKEDIN },
              { name: 'Twitter', url: CONTACT_INFO.TWITTER },
              { name: 'GitHub', url: CONTACT_INFO.GITHUB }
            ].map((social) => (
              <a
                key={social.name}
                href={social.url}
                className={`group flex items-center hover:text-[${COLORS.primary}] transition-colors`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.name} 프로필 방문 (새 창에서 열림)`}
              >
                <span>{social.name}</span>
                <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" aria-hidden="true" />
              </a>
            ))}
          </nav>
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
        aria-hidden="true"
      />
    </footer>
  );
});

Contact.displayName = 'Contact';

export default Contact;