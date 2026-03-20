import React from 'react';

const SidebarVerseList = ({
  chapters,
  expandedChapter,
  activeParagraphId,
  paragraphIndices,
  onSelectParagraph,
  setIsSidebarOpen,
  title,
  count,
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
      <div className="sticky top-0 z-10 border-b border-gold-border/20 bg-white/88 px-4 py-4 backdrop-blur-md dark:border-dark-border/50 dark:bg-dark-bg/92">
        <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.34em] text-gold-deep/72 dark:text-gold-light/68">
          Reading Index
        </p>
        <h2 className="mt-2 font-korean text-[1.05rem] font-semibold leading-6 text-text-primary dark:text-dark-text-primary">
          {title || foundChapter.chapterName || foundChapter.title}
        </h2>
        <p className="mt-1 text-[12px] tracking-[0.08em] text-text-secondary/70 dark:text-dark-text-secondary/75">
          총 {count || foundChapter.paragraphs.length}개 구간
        </p>
      </div>

      <div className="space-y-1 px-3 py-3">
        {foundChapter.paragraphs.map((paragraph) => {
          const isActive = activeParagraphId === paragraph.id;

          return (
            <button
              key={paragraph.id}
              onClick={() => {
                if (onSelectParagraph) onSelectParagraph(paragraph);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={`w-full rounded-xl border px-3 py-2.5 text-left transition-all ${
                isActive
                  ? 'border-gold-primary/30 bg-white/75 shadow-sm dark:border-gold-primary/20 dark:bg-dark-bg/65'
                  : 'border-transparent bg-transparent hover:border-gold-border/18 hover:bg-gold-surface/25 dark:hover:border-dark-border/45 dark:hover:bg-dark-bg/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 inline-flex min-w-[32px] justify-center rounded-full px-2 py-1 text-[11px] font-bold ${
                    isActive
                      ? 'bg-gold-surface text-gold-primary dark:bg-dark-surface dark:text-gold-light'
                      : 'bg-sand-primary/80 text-text-secondary/75 dark:bg-dark-surface/60 dark:text-dark-text-secondary/70'
                  }`}
                >
                  {paragraphIndices[paragraph.id] || paragraph.id}
                </span>
                <span
                  className={`break-keep whitespace-normal font-korean text-[14px] leading-6 ${
                    isActive
                      ? 'font-semibold text-text-primary dark:text-dark-text-primary'
                      : 'text-text-secondary dark:text-dark-text-secondary'
                  }`}
                >
                  {paragraph.title || paragraph.chapterTitle}
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
