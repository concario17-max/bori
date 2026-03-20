import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChapterButton from './ChapterButton';

const ChapterGroup = ({ group, expandedChapter, toggleChapter, onSelectParagraph }) => {
    return (
        <motion.div layout className="mb-1">
            <div className="px-3 py-2 text-gold-primary/80 dark:text-gold-light/70 text-[13px] font-bold tracking-[0.2em] rounded-lg bg-gold-surface/30 dark:bg-dark-bg/30 uppercase font-inter mb-1">
                {group.chapterName}
            </div>

            <div className="flex flex-col gap-0">
                <AnimatePresence mode="popLayout">
                    {group.subchapters.map((subchapter) => {
                        const uniqueId = `${group.id}-${subchapter.id}`;
                        const isExpanded = expandedChapter === uniqueId;

                        return (
                            <ChapterButton
                                key={subchapter.id}
                                chapter={subchapter}
                                count={subchapter.paragraphs?.length || 0}
                                isExpanded={isExpanded}
                                isSubchapter={true}
                                onClick={() => {
                                    toggleChapter(uniqueId);
                                    if (subchapter.paragraphs?.length > 0 && onSelectParagraph) {
                                        onSelectParagraph(subchapter.paragraphs[0]);
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

export default React.memo(ChapterGroup);
