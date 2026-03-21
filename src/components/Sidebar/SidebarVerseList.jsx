import React from 'react';

function getCommentaryPreview(paragraph) {
  const english = paragraph.text?.english?.split('\n').map((line) => line.trim()).filter(Boolean) ?? [];
  const preview = english.find((line) => !line.includes('Geshe Sonam Rinchen') && !line.includes('Richard Sherburne')) ?? english[0] ?? '';
  return preview;
}

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
  const isCommentaryList = expandedChapter.startsWith('commentary-');

  return (
    <div className="custom-scrollbar h-full flex-1 overflow-y-auto bg-transparent animate-[fadeIn_0.5s_ease-out]">
      <div className="space-y-0.5 px-2.5 py-2">
        {foundChapter.paragraphs.map((paragraph) => {
          const isActive = activeParagraphId === paragraph.id;
          const label = isCommentaryList
            ? getCommentaryPreview(paragraph)
            : paragraph.title || paragraph.chapterTitle;

          return (
            <button
              key={paragraph.id}
              onClick={() => {
                if (onSelectParagraph) onSelectParagraph(paragraph);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={`w-full rounded-xl border px-2.5 py-1.5 text-left transition-all ${
                isActive
                  ? 'border-gold-primary/30 bg-white/75 shadow-sm dark:border-gold-primary/20 dark:bg-dark-bg/65'
                  : 'border-transparent bg-transparent hover:border-gold-border/18 hover:bg-gold-surface/25 dark:hover:border-dark-border/45 dark:hover:bg-dark-bg/40'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span
                  className={`mt-0.5 inline-flex min-w-[28px] justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    isActive
                      ? 'bg-gold-surface text-gold-primary dark:bg-dark-surface dark:text-gold-light'
                      : 'bg-sand-primary/80 text-text-secondary/75 dark:bg-dark-surface/60 dark:text-dark-text-secondary/70'
                  }`}
                >
                  {paragraphIndices[paragraph.id] || paragraph.id}
                </span>
                <span
                  className={`block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] leading-5 ${
                    isActive
                      ? 'font-semibold text-text-primary dark:text-dark-text-primary'
                      : 'text-text-secondary dark:text-dark-text-secondary'
                  }`}
                >
                  {label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(SidebarVerseList);
