import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChapterButton from './ChapterButton';
import ChapterGroup from './ChapterGroup';

const SidebarChapterList = ({ chapters, expandedChapter, toggleChapter, onSelectParagraph }) => {
    return (
        <motion.div
            layout
            className={`flex-none overflow-y-auto border-gold-border/40 dark:border-[#222] custom-scrollbar transition-all duration-500 ease-in-out ${expandedChapter ? 'h-[30%] min-h-[30%] border-b shadow-sm' : 'max-h-full h-full'}`}
        >
            <div className="p-4 bg-transparent sticky top-0 z-10 backdrop-blur-sm hidden lg:block">
                <h2 className="text-[11px] font-bold font-inter tracking-[0.2em] uppercase text-text-primary/70 dark:text-dark-text-primary/60 pl-1">
                    Chapters
                </h2>
            </div>

            <div className="py-1 px-3 flex flex-col gap-0">
                <AnimatePresence mode="popLayout" initial={false}>
                    {chapters && chapters.map((chapter) => {
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
