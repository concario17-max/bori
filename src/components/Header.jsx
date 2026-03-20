import React from 'react';
import { BookOpenText, Menu, MessageSquareText, MoonStar, SunMedium } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { DESKTOP_FRAME_COLUMNS_DEFAULT } from './ui/desktopFrame';

/** @typedef {import('../types').UIContextValue} UIContextValue */

const TITLE_TEXT = '보리도등론';

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

function Header() {
  const ui = useUI() ?? createFallbackUIContext();
  const ThemeIcon = ui.isDarkMode ? SunMedium : MoonStar;
  const isCommentaryOpen =
    ui.activeRightPanel === 'commentary' || ui.activeDesktopRightPanel === 'commentary';
  /** @type {React.CSSProperties & {'--desktop-frame-columns': string}} */
  const desktopHeaderStyle = {
    '--desktop-frame-columns': DESKTOP_FRAME_COLUMNS_DEFAULT,
  };

  const commentaryLabel = isCommentaryOpen ? '해설 패널 닫기' : '해설 패널 열기';

  return (
    <header className="fixed left-0 top-0 z-[60] h-16 w-full border-b border-sand-tertiary bg-white/80 backdrop-blur-md dark:border-dark-border/60 dark:bg-dark-bg/75">
      <div className="flex h-full items-center justify-between px-4 sm:px-8 xl:hidden">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={ui.toggleSidebar}
            className="rounded-lg p-2 text-gold-primary transition-colors hover:bg-gold-surface"
            aria-label="목차 열기"
          >
            <Menu className="h-6 w-6" />
          </button>

          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-primary/20 bg-white/70 text-gold-primary dark:border-dark-border/60 dark:bg-dark-surface/60 dark:text-gold-light">
            <BookOpenText className="h-5 w-5" />
          </span>
          <span className="truncate font-serif text-[13px] font-bold tracking-[0.03em] text-charcoal-main dark:text-dark-text-primary sm:text-[16px]">
            {TITLE_TEXT}
          </span>
        </div>

        <div className="ml-2 flex shrink-0 items-center justify-end gap-2 sm:ml-3">
          <button
            type="button"
            onClick={() => ui.toggleRightPanel('commentary')}
            className="inline-flex items-center gap-2 rounded-full border border-gold-primary/20 bg-white/70 px-3 py-2 text-gold-primary transition-colors hover:bg-gold-surface dark:border-dark-border/60 dark:bg-dark-surface/60 dark:text-gold-light"
            aria-label={commentaryLabel}
          >
            <MessageSquareText className="h-4 w-4" />
            <span className="hidden text-xs font-semibold tracking-wide sm:inline">해설</span>
          </button>

          <button
            type="button"
            onClick={ui.toggleTheme}
            className="inline-flex items-center justify-center rounded-full border border-gold-primary/20 bg-white/70 p-2 text-gold-primary transition-colors hover:bg-gold-surface dark:border-dark-border/60 dark:bg-dark-surface/60 dark:text-gold-light"
            aria-label={ui.isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            <ThemeIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="desktop-header-grid hidden h-full items-center" style={desktopHeaderStyle}>
        <div className="desktop-header-main flex h-full min-w-0 items-center justify-between gap-6 px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={ui.toggleSidebar}
              className="rounded-lg p-2 text-gold-primary transition-colors hover:bg-gold-surface"
              aria-label="목차 열기"
            >
              <Menu className="h-6 w-6" />
            </button>

            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-primary/20 bg-white/70 text-gold-primary dark:border-dark-border/60 dark:bg-dark-surface/60 dark:text-gold-light">
              <BookOpenText className="h-5 w-5" />
            </span>
            <span className="truncate font-serif text-[16px] font-bold tracking-[0.03em] text-charcoal-main dark:text-dark-text-primary">
              {TITLE_TEXT}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => ui.toggleRightPanel('commentary')}
              className="inline-flex items-center gap-2 rounded-full border border-gold-primary/20 bg-white/70 px-3 py-2 text-gold-primary transition-colors hover:bg-gold-surface dark:border-dark-border/60 dark:bg-dark-surface/60 dark:text-gold-light"
              aria-label={commentaryLabel}
            >
              <MessageSquareText className="h-4 w-4" />
              <span className="text-xs font-semibold tracking-wide">해설</span>
            </button>

            <button
              type="button"
              onClick={ui.toggleTheme}
              className="inline-flex items-center justify-center rounded-full border border-gold-primary/20 bg-white/70 p-2 text-gold-primary transition-colors hover:bg-gold-surface dark:border-dark-border/60 dark:bg-dark-surface/60 dark:text-gold-light"
              aria-label={ui.isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              <ThemeIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
