import React from 'react';
import { motion } from 'framer-motion';
import ReadingHeader from '../../components/Reading/ReadingHeader';
import TibetanSection from '../../components/Reading/TibetanSection';
import TranslationSection from '../../components/Reading/TranslationSection';
import NavigationPill from '../../components/Reading/NavigationPill';

/** @typedef {import('../../types').ReadingParagraph} ReadingParagraph */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * @param {{
 *   verse: ReadingParagraph | null,
 *   globalIndex: number,
 *   hideAudio?: boolean,
 *   onPrevious: (() => void) | null,
 *   onNext: (() => void) | null
 * }} props
 */
function ReadingPanel({ verse, globalIndex, onPrevious, onNext }) {
  const safeVerse = verse && typeof verse === 'object' ? verse : null;
  const verseId = typeof safeVerse?.id === 'string' ? safeVerse.id : '';
  const verseText = safeVerse?.text && typeof safeVerse.text === 'object' ? safeVerse.text : null;
  const [chapterStr = '', verseStr = ''] = verseId.split('.');

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative z-10 min-h-full bg-transparent pb-28 pt-8 font-crimson text-text-primary transition-colors duration-500 dark:text-dark-text-primary sm:pb-20 sm:pt-12"
    >
      <div className="mx-auto w-full max-w-[980px] px-5 sm:px-8 xl:px-10">
        <motion.div variants={itemVariants}>
          <ReadingHeader
            chapterStr={chapterStr}
            verseStr={verseStr}
            globalIndex={globalIndex}
            verseId={verseId}
            chapterTitle={safeVerse?.chapterTitle}
            paragraphTitle={safeVerse?.title}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <TibetanSection
            tibetan={verseText?.tibetan ?? ''}
            pronunciation={verseText?.pronunciation ?? ''}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <TranslationSection
            english={verseText?.english ?? ''}
            korean={verseText?.korean ?? ''}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <NavigationPill
            globalIndex={globalIndex}
            verseId={verseId}
            onPrevious={onPrevious}
            onNext={onNext}
          />
        </motion.div>
      </div>
    </motion.section>
  );
}

export default React.memo(
  ReadingPanel,
  (prevProps, nextProps) => prevProps.verse?.id === nextProps.verse?.id,
);
