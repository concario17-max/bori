import React from 'react';

/**
 * @param {{
 *   chapterStr: string,
 *   verseStr: string,
 *   globalIndex: number,
 *   verseId: string,
 *   chapterTitle?: string,
 *   paragraphTitle?: string
 * }} props
 */
function ReadingHeader({
  chapterStr,
  verseStr,
  globalIndex,
  verseId,
  chapterTitle,
  paragraphTitle,
}) {
  const sectionLabel = chapterTitle || (verseStr ? `Chapter ${chapterStr}` : 'Text');
  const entryLabel =
    paragraphTitle ||
    (verseStr ? `문단 ${globalIndex || `${chapterStr}-${verseStr}`}` : `문단 ${globalIndex || verseId}`);

  return (
    <div className="mb-6 flex flex-col items-center justify-center pt-2 sm:mb-8 sm:pt-4">
      <div className="inline-flex items-center gap-3 rounded-full border border-gold-border/30 bg-white/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-text-secondary/80 shadow-[0_10px_30px_rgba(166,139,92,0.08)] backdrop-blur-md dark:border-dark-border/60 dark:bg-dark-surface/70 dark:text-dark-text-secondary/80 sm:px-5">
        <span>{sectionLabel}</span>
        <span className="text-gold-primary/60 dark:text-gold-light/60">·</span>
        <span className="text-text-primary dark:text-dark-text-primary">{entryLabel}</span>
      </div>
    </div>
  );
}

export default React.memo(ReadingHeader);
