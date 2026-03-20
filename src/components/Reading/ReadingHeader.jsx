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
  const entryLabel = paragraphTitle || `Section ${globalIndex || `${chapterStr}-${verseStr}` || verseId}`;

  return (
    <div className="mb-8 pt-2 text-center sm:mb-10 sm:pt-4">
      <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.38em] text-gold-deep/70 dark:text-gold-light/65">
        {sectionLabel}
      </p>
      <h2 className="mt-4 font-korean text-[1.6rem] font-semibold tracking-[-0.02em] text-text-primary dark:text-dark-text-primary sm:text-[2rem]">
        {entryLabel}
      </h2>
      <p className="mt-3 font-inter text-[11px] tracking-[0.22em] text-text-secondary/70 dark:text-dark-text-secondary/75">
        SECTION {globalIndex || verseId}
      </p>
    </div>
  );
}

export default React.memo(ReadingHeader);
