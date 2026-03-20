import React from 'react';

const SidebarVerseList = ({
  chapters,
  expandedChapter,
  activeParagraphId,
  paragraphIndices,
  onSelectParagraph,
  setIsSidebarOpen,
}) => {
  if (!expandedChapter) return null;

  let foundChapter = null;
  for (const chapter of chapters) {
    if (chapter.id === expandedChapter) {
      foundChapter = chapter;
      break;
    }
    if (chapter.isGroup && chapter.subchapters) {
      const subchapter = chapter.subchapters.find(
        (item) => `${chapter.id}-${item.id}` === expandedChapter,
      );
      if (subchapter) {
        foundChapter = subchapter;
        break;
      }
    }
  }

  if (!foundChapter || !foundChapter.paragraphs) return null;

  return (
    <div className="custom-scrollbar h-full flex-1 overflow-y-auto bg-transparent animate-[fadeIn_0.5s_ease-out]">
      <div className="space-y-0 px-3 py-1.5">
        {foundChapter.paragraphs.map((paragraph) => {
          const isActive = activeParagraphId === paragraph.id;

          return (
            <button
              key={paragraph.id}
              onClick={() => {
                if (onSelectParagraph) onSelectParagraph(paragraph);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-start gap-2.5 rounded-lg px-3 py-1.5 text-left text-[16px] transition-all ${
                isActive
                  ? 'border border-gold-primary/30 bg-white/60 font-medium text-text-primary shadow-sm dark:border-gold-primary/20 dark:bg-dark-bg/60 dark:text-gold-light'
                  : 'border border-transparent text-text-secondary hover:bg-gold-surface/30 hover:text-text-primary dark:text-dark-text-secondary dark:hover:bg-dark-bg/40'
              }`}
            >
              <span
                className={`mt-[3px] min-w-[40px] whitespace-nowrap text-[14px] font-bold ${
                  isActive
                    ? 'text-gold-primary'
                    : 'text-text-secondary/60 dark:text-dark-text-secondary/60'
                }`}
              >
                {paragraphIndices[paragraph.id] || paragraph.id}
              </span>
              <span className="truncate break-keep font-noto text-[15px] leading-relaxed opacity-90">
                {paragraph.title || paragraph.chapterTitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(SidebarVerseList);
