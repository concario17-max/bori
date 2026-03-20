import React from 'react';
import { motion } from 'framer-motion';

const ChapterButton = ({ chapter, count, isExpanded, onClick, isSubchapter = false }) => {
    return (
        <motion.button
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`w-full flex items-start justify-between gap-2 px-3 py-1.5 rounded-xl text-left transition-all duration-300 ${isSubchapter ? 'pl-6' : 'pl-4'
                } ${isExpanded
                    ? 'bg-white/60 dark:bg-dark-bg/60 shadow-sm border border-gold-primary/20 text-[#1C2B36] dark:text-gold-light'
                    : 'text-[#5B7282] dark:text-dark-text-secondary hover:bg-gold-surface/40 dark:hover:bg-dark-bg/40 border border-transparent'
                }`}
        >
            <div className="flex-1 pr-2 flex flex-col gap-0">
                <span className={`text-[13px] leading-snug font-inter break-keep font-bold ${isExpanded ? 'text-[#1C2B36] dark:text-gold-light' : ''
                    } ${isSubchapter ? 'font-medium tracking-wide' : 'tracking-tight'}`}>
                    {chapter.chapterName}
                </span>
            </div>
            <motion.span
                animate={{ opacity: isExpanded ? 1 : 0.7 }}
                className="shrink-0 mt-0 text-[#A68B5C] px-2 py-0 rounded text-xs font-bold"
            >
                {count || 0}
            </motion.span>
        </motion.button>
    );
};

export default React.memo(ChapterButton);
