import React from 'react';
import { X } from 'lucide-react';

/** @typedef {import('../../types').SidebarLayoutProps} SidebarLayoutProps */

/**
 * @param {SidebarLayoutProps} props
 */
function SidebarLayout({
  isOpen,
  isDesktopOpen,
  onClose,
  title,
  children,
  position = 'left',
  widthClass = 'w-80',
  className = '',
  bodyClassName = '',
}) {
  const isLeft = position === 'left';
  const mobileTranslateClosed = isLeft ? '-translate-x-full' : 'translate-x-full';
  const placementClass = isLeft ? 'left-0' : 'right-0';
  const borderClass = isLeft ? 'border-r' : 'border-l';

  const mobileStateClass = isOpen
    ? `${widthClass} translate-x-0 shadow-2xl`
    : `${widthClass} ${mobileTranslateClosed}`;

  const desktopStateClass = isDesktopOpen
    ? 'xl:relative xl:inset-auto xl:top-0 xl:h-full xl:w-full xl:translate-x-0 xl:opacity-100 xl:pointer-events-auto xl:shadow-none'
    : 'xl:relative xl:inset-auto xl:top-0 xl:h-full xl:w-full xl:translate-x-0 xl:opacity-0 xl:pointer-events-none xl:shadow-none xl:border-transparent';

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-x-0 bottom-0 top-16 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 xl:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed bottom-0 top-16 ${placementClass} z-50 flex h-[calc(100dvh-64px)] flex-col overflow-hidden overscroll-contain bg-white/80 font-inter backdrop-blur-xl transition-all duration-300 dark:bg-dark-bg/95 xl:sticky xl:z-20 xl:min-w-0 ${borderClass} border-gold-primary/20 dark:border-dark-border/50 ${mobileStateClass} ${desktopStateClass} ${className}`}
      >
        {title ? (
          <div className="flex shrink-0 items-center justify-between border-b border-gold-border/30 p-4 dark:border-dark-border/60 xl:hidden">
            <span className="font-crimson text-lg font-bold text-text-primary dark:text-dark-text-primary">
              {title}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="-mr-2 rounded-full p-2 text-text-secondary transition-colors hover:bg-gold-surface dark:text-dark-text-secondary dark:hover:bg-dark-surface"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="absolute right-4 top-4 z-50 xl:hidden">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-text-secondary transition-colors hover:bg-gold-surface dark:text-dark-text-secondary dark:hover:bg-dark-surface"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className={`flex flex-1 min-h-0 flex-col overflow-hidden ${bodyClassName}`}>{children}</div>
      </aside>
    </>
  );
}

export default React.memo(SidebarLayout);
