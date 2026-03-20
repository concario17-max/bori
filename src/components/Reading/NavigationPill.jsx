import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const NavigationPill = ({ globalIndex, verseId, onPrevious, onNext }) => {
  return (
    <div className="mb-8 mt-10 flex justify-center sm:mt-12">
      <div className="flex w-full max-w-[360px] items-center justify-between rounded-[1.6rem] border border-gold-border/22 bg-white/72 px-4 py-3 shadow-[0_20px_50px_rgba(120,93,48,0.08)] backdrop-blur-xl dark:border-dark-border/60 dark:bg-dark-surface/58 sm:max-w-[420px] sm:px-5">
        <button
          onClick={onPrevious}
          disabled={!onPrevious}
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-gold-surface/35 hover:text-gold-primary disabled:opacity-30 disabled:hover:bg-transparent dark:text-slate-500 dark:hover:text-gold-light"
          aria-label="이전 문단"
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>

        <div className="text-center">
          <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-deep/70 dark:text-gold-light/65">
            Continue Reading
          </p>
          <span className="mt-1 block font-serif text-lg text-slate-700 dark:text-gray-200">
            {globalIndex || verseId.replace('chapter-', '')}
          </span>
        </div>

        <button
          onClick={onNext}
          disabled={!onNext}
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-gold-surface/35 hover:text-gold-primary disabled:opacity-30 disabled:hover:bg-transparent dark:text-slate-500 dark:hover:text-gold-light"
          aria-label="다음 문단"
        >
          <ChevronRight size={20} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(NavigationPill);
