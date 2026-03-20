import React from 'react';

/**
 * @param {{ children: React.ReactNode }} props
 */
function SectionLabel({ children }) {
  return (
    <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.38em] text-gold-deep/70 dark:text-gold-light/65">
      {children}
    </p>
  );
}

/**
 * @param {{ english: string }} props
 */
function EnglishTranslation({ english }) {
  const blocks = english
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const [translator, ...rest] = block.split('\n');
      return {
        translator: translator?.trim() ?? '',
        body: rest.join('\n').trim(),
      };
    });

  if (blocks.length === 0) return null;

  return (
    <div className="mx-auto mt-4 max-w-4xl space-y-5">
      {blocks.map((block, index) => (
        <div
          key={`${block.translator}-${index}`}
          className="rounded-[1.25rem] border border-gold-border/12 bg-white/55 px-4 py-4 dark:border-dark-border/45 dark:bg-dark-bg/25"
        >
          <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-deep/72 dark:text-gold-light/70">
            {block.translator}
          </p>
          <p className="mt-3 whitespace-pre-line text-left font-korean text-[17px] leading-[1.9] tracking-[-0.01em] text-text-primary/92 dark:text-dark-text-primary/92 sm:text-[19px] sm:leading-[1.95]">
            {block.body}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * @param {{
 *   english: string,
 *   korean: string
 * }} props
 */
function TranslationSection({ english, korean }) {
  return (
    <section className="mb-10 space-y-8 sm:space-y-10">
      {english ? (
        <div className="rounded-[1.8rem] border border-gold-border/18 bg-white/55 px-5 py-6 shadow-[0_20px_50px_rgba(120,93,48,0.05)] backdrop-blur-lg dark:border-dark-border/55 dark:bg-dark-surface/35 sm:px-8 sm:py-8">
          <SectionLabel>English Rendering</SectionLabel>
          <EnglishTranslation english={english} />
        </div>
      ) : null}

      {korean ? (
        <div className="rounded-[1.8rem] border border-gold-border/18 bg-gradient-to-b from-sand-primary/75 to-white/60 px-5 py-6 shadow-[0_20px_50px_rgba(120,93,48,0.06)] backdrop-blur-lg dark:border-dark-border/55 dark:from-dark-surface/45 dark:to-dark-bg/35 sm:px-8 sm:py-8">
          <SectionLabel>Korean Translation</SectionLabel>
          <p className="mt-4 font-korean break-keep text-[16px] leading-[2] tracking-[-0.01em] text-text-primary dark:text-dark-text-primary sm:text-[18px] sm:leading-[2.1]">
            {korean.replace(/[\r\n]+/g, ' ')}
          </p>
        </div>
      ) : null}
    </section>
  );
}

export default React.memo(TranslationSection);
