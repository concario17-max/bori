import React from 'react';

/** @typedef {import('../../types').AppShellProps} AppShellProps */

/**
 * @param {AppShellProps} props
 */
function AppShell({
  header,
  sidebar,
  rightPanel,
  children,
  isMobilePanelOpen = false,
  desktopGridColumns,
}) {
  /** @type {(React.CSSProperties & {'--desktop-frame-columns': string}) | undefined} */
  const desktopGridStyle = desktopGridColumns
    ? { '--desktop-frame-columns': desktopGridColumns }
    : undefined;

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-sand-primary text-charcoal-main transition-colors duration-500 dark:bg-dark-bg dark:text-dark-text-primary">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.65)_0%,_transparent_62%)] dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05)_0%,_transparent_62%)]" />

      <div className="relative z-10 flex h-full flex-1 flex-col overflow-hidden">
        {header}

        <div
          className={`relative flex flex-1 overflow-hidden ${
            desktopGridColumns ? 'desktop-frame-grid' : ''
          }`}
          style={desktopGridStyle}
        >
          {sidebar}

          <main
            id="main-scroll-container"
            className={`min-w-0 flex-1 ${
              isMobilePanelOpen ? 'touch-none overflow-hidden' : 'overflow-y-auto'
            } ${desktopGridColumns ? 'desktop-frame-main' : ''}`}
          >
            {children}
          </main>

          {rightPanel}
        </div>
      </div>
    </div>
  );
}

export default React.memo(AppShell);
