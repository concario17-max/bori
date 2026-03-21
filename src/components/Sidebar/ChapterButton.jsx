import React from 'react';
import { motion } from 'framer-motion';

const ChapterButton = ({ chapter, count, isExpanded, onClick, isSubchapter = false, visibleHeadings = null }) => {
    const headings = visibleHeadings ?? chapter.tocHeadings ?? [];
    const actionLabel = chapter.tocActionLabel ?? chapter.chapterName;
    const hasHeadings = headings.some(Boolean);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`w-full ${isSubchapter ? 'pl-5' : 'pl-3'}`}
        >
            {hasHeadings ? (
                <div className="mb-0.5 flex flex-col gap-0.5 px-2.5 pt-1">
                    {headings.map((heading, index) => (
                        heading ? (
                            <div
                                key={`${heading}-${index}`}
                                className={`${index === 0
                                    ? 'text-[14px] font-bold uppercase tracking-[0.12em] text-[#9B6B1F] dark:text-[#D7B164]'
                                    : 'text-[13px] font-semibold tracking-[0.01em] text-[#5F4A2A] dark:text-[#B89458]'
                                    }`}
                            >
                                {heading}
                            </div>
                        ) : null
                    ))}
                </div>
            ) : null}

            <motion.button
                layout
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClick}
                className={`w-full flex items-start justify-between gap-2 px-2.5 py-1 rounded-xl text-left transition-all duration-300 ${isExpanded
                    ? 'bg-white/60 dark:bg-dark-bg/60 shadow-sm border border-gold-primary/20 text-[#1C2B36] dark:text-gold-light'
                    : 'text-[#5B7282] dark:text-dark-text-secondary hover:bg-gold-surface/40 dark:hover:bg-dark-bg/40 border border-transparent'
                    }`}
            >
                <div className="flex-1 pr-2 flex flex-col gap-0">
                    <span className={`whitespace-pre-line text-[12px] leading-[1.35] font-inter break-keep ${hasHeadings ? 'font-medium tracking-wide' : 'font-bold tracking-tight'} ${isExpanded ? 'text-[#1C2B36] dark:text-gold-light' : ''
                        }`}>
                        {actionLabel}
                    </span>
                </div>
                <motion.span
                    animate={{ opacity: isExpanded ? 1 : 0.7 }}
                    className="shrink-0 mt-0 text-[#A68B5C] px-1.5 py-0 rounded text-[11px] font-bold"
                >
                    {count || 0}
                </motion.span>
            </motion.button>
        </motion.div>
    );
};

export default React.memo(ChapterButton);
