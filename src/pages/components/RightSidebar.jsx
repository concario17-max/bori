import React from 'react';
import { MessageSquareText } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import SidebarLayout from '../../components/ui/SidebarLayout';

/** @typedef {import('../../types').ReadingParagraph} ReadingParagraph */
/** @typedef {import('../../types').UIContextValue} UIContextValue */

/**
 * @returns {UIContextValue}
 */
function createFallbackUIContext() {
  return {
    isDesktopViewport: false,
    isSidebarOpen: false,
    setIsSidebarOpen: () => {},
    isDesktopSidebarOpen: true,
    setIsDesktopSidebarOpen: () => {},
    toggleSidebar: () => {},
    activeRightPanel: null,
    setActiveRightPanel: () => {},
    activeDesktopRightPanel: 'commentary',
    setActiveDesktopRightPanel: () => {},
    isRightPanelOpen: true,
    closeRightPanel: () => {},
    toggleRightPanel: () => {},
    isDarkMode: false,
    toggleTheme: () => {},
    closeAllDrawers: () => {},
  };
}

/**
 * @param {{ activeParagraph: ReadingParagraph | null }} props
 */
function CommentaryPanel({ activeParagraph }) {
  const englishText = activeParagraph?.text.english || '이 구간에는 영어 번역이 없습니다.';
  const koreanText = activeParagraph?.text.korean || '이 구간에는 한글 번역이 없습니다.';
  const tibetanText = activeParagraph?.text.tibetan || '이 구간에는 티베트 원문이 없습니다.';

  return (
    <div className="custom-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto pr-1">
      <section className="rounded-[1.5rem] border border-gold-border/25 bg-white/65 p-5 shadow-sm dark:border-dark-border/60 dark:bg-dark-surface/55">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-deep/70 dark:text-gold-light/65">
          Reading Lens
        </p>
        <h3 className="mt-3 text-lg font-semibold text-text-primary dark:text-dark-text-primary">
          {activeParagraph?.title || activeParagraph?.chapterTitle || '보리도등론'}
        </h3>
        <p className="mt-3 font-korean text-[14px] leading-7 text-text-secondary dark:text-dark-text-secondary">
          선택한 구간의 티베트 원문과 영어 번역, 한글 번역을 나란히 보면서 비교해 읽을 수 있도록 정리한 참고 패널입니다.
        </p>
      </section>

      <section className="rounded-[1.5rem] border border-gold-border/20 bg-gold-surface/45 p-5 dark:border-dark-border/60 dark:bg-dark-bg/30">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-deep/70 dark:text-gold-light/65">
          Tibetan Anchor
        </p>
        <p className="mt-3 font-noto text-[14px] leading-7 text-text-primary dark:text-dark-text-primary">
          {tibetanText}
        </p>
      </section>

      <section className="rounded-[1.5rem] border border-gold-border/20 bg-white/60 p-5 dark:border-dark-border/60 dark:bg-dark-surface/50">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-deep/70 dark:text-gold-light/65">
          English Reference
        </p>
        <p className="mt-3 whitespace-pre-line font-korean text-[14px] leading-7 tracking-[-0.01em] text-text-primary dark:text-dark-text-primary">
          {englishText}
        </p>
      </section>

      <section className="rounded-[1.5rem] border border-gold-border/20 bg-white/60 p-5 dark:border-dark-border/60 dark:bg-dark-surface/50">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-deep/70 dark:text-gold-light/65">
          Korean Reference
        </p>
        <p className="mt-3 font-korean text-[14px] leading-7 text-text-primary dark:text-dark-text-primary">
          {koreanText}
        </p>
      </section>
    </div>
  );
}

/**
 * @param {{ activeParagraph: ReadingParagraph | null }} props
 */
function RightSidebar({ activeParagraph }) {
  const uiContext = useUI() ?? createFallbackUIContext();
  const { activeRightPanel, activeDesktopRightPanel, closeRightPanel } = uiContext;
  const isMobileOpen = activeRightPanel === 'commentary';
  const isDesktopOpen = activeDesktopRightPanel === 'commentary';

  return (
    <SidebarLayout
      isOpen={isMobileOpen}
      isDesktopOpen={isDesktopOpen}
      onClose={closeRightPanel}
      position="right"
      widthClass="w-[90vw] sm:w-[400px]"
      className="dark:bg-dark-bg/95"
    >
      <div className="relative flex h-full min-h-0 flex-col bg-white/80 p-6 dark:bg-dark-bg/95">
        <div className="mb-6 flex shrink-0 items-center gap-2 border-b border-gold-border/30 pb-4">
          <MessageSquareText className="h-5 w-5 text-[#A68B5C] dark:text-gold-light" />
          <h2 className="text-sm font-bold tracking-wide text-[#1C2B36] dark:text-dark-text-primary">
            해설
          </h2>
        </div>

        <CommentaryPanel activeParagraph={activeParagraph} />
      </div>
    </SidebarLayout>
  );
}

export default React.memo(
  RightSidebar,
  (prevProps, nextProps) => prevProps.activeParagraph?.id === nextProps.activeParagraph?.id,
);
