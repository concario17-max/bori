import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChapterButton from './ChapterButton';
import ChapterGroup from './ChapterGroup';

const SidebarChapterList = ({ chapters, expandedChapter, toggleChapter, onSelectParagraph }) => {
  return (
    <motion.div
      layout
      className={`flex-none overflow-y-auto border-gold-border/40 dark:border-[#222] custom-scrollbar transition-all duration-500 ease-in-out ${
        expandedChapter ? 'h-[30%] min-h-[30%] border-b shadow-sm' : 'max-h-full h-full'
      }`}
    >
      <div className="py-0.5 px-2.5 flex flex-col gap-0">
        <AnimatePresence mode="popLayout" initial={false}>
          {chapters &&
            chapters.map((chapter) => {
              if (chapter.isGroup) {
                return (
                  <ChapterGroup
                    key={chapter.id}
                    group={chapter}
                    expandedChapter={expandedChapter}
                    toggleChapter={toggleChapter}
                    onSelectParagraph={onSelectParagraph}
                  />
                );
              }

              const isExpanded = expandedChapter === chapter.id;
              return (
                <ChapterButton
                  key={chapter.id}
                  chapter={chapter}
                  count={chapter.paragraphs?.length || 0}
                  isExpanded={isExpanded}
                  onClick={() => {
                    toggleChapter(chapter.id);
                    if (chapter.paragraphs?.length > 0 && onSelectParagraph) {
                      onSelectParagraph(chapter.paragraphs[0]);
                    }
                  }}
                />
              );
            })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default React.memo(SidebarChapterList);
