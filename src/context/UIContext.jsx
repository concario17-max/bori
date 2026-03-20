import React from 'react';

/** @typedef {import('../types').RightPanelType} RightPanelType */
/** @typedef {import('../types').UIContextValue} UIContextValue */

const UIContext = React.createContext(/** @type {UIContextValue | undefined} */ (undefined));
const THEME_STORAGE_KEY = 'bodhi-lamp-theme';
const DESKTOP_QUERY = '(min-width: 1280px)';
const DESKTOP_SIDEBAR_STORAGE_KEY = 'bodhi-lamp-desktop-sidebar';
const DESKTOP_RIGHT_PANEL_STORAGE_KEY = 'bodhi-lamp-desktop-right-panel';

/**
 * @returns {boolean}
 */
const isDesktopLayout = () =>
  typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches;

/**
 * @returns {boolean}
 */
function loadStoredTheme() {
  if (typeof window === 'undefined') return false;

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'dark') return true;
  if (savedTheme === 'light') return false;

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * @returns {boolean}
 */
function loadStoredDesktopSidebar() {
  if (typeof window === 'undefined') return true;

  const savedState = window.localStorage.getItem(DESKTOP_SIDEBAR_STORAGE_KEY);
  return savedState === null ? true : JSON.parse(savedState);
}

/**
 * @returns {RightPanelType}
 */
function loadStoredDesktopRightPanel() {
  if (typeof window === 'undefined') return 'commentary';

  const savedState = window.localStorage.getItem(DESKTOP_RIGHT_PANEL_STORAGE_KEY);
  return savedState === null ? 'commentary' : JSON.parse(savedState);
}

/**
 * @param {{ children: React.ReactNode }} props
 */
export function UIProvider({ children }) {
  const [isDesktopViewport, setIsDesktopViewport] = React.useState(isDesktopLayout);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [activeRightPanel, setActiveRightPanel] = React.useState(/** @type {RightPanelType} */ (null));
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = React.useState(loadStoredDesktopSidebar);
  const [activeDesktopRightPanel, setActiveDesktopRightPanel] = React.useState(loadStoredDesktopRightPanel);
  const [isDarkMode, setIsDarkMode] = React.useState(loadStoredTheme);

  React.useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQueryList = window.matchMedia(DESKTOP_QUERY);
    /**
     * @param {MediaQueryList | MediaQueryListEvent} event
     */
    const handleChange = (event) => {
      setIsDesktopViewport(event.matches);

      if (event.matches) {
        setIsSidebarOpen(false);
        setActiveRightPanel(null);
      }
    };

    handleChange(mediaQueryList);
    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, []);

  const toggleSidebar = React.useCallback(() => {
    if (isDesktopViewport) {
      setIsDesktopSidebarOpen((prev) => {
        const next = !prev;
        window.localStorage.setItem(DESKTOP_SIDEBAR_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      return;
    }

    setIsSidebarOpen((prev) => !prev);
  }, [isDesktopViewport]);

  const toggleRightPanel = React.useCallback(
    /**
     * @param {'commentary'} [panel]
     */
    (panel = 'commentary') => {
      if (isDesktopViewport) {
        setActiveDesktopRightPanel((prev) => {
          const next = prev === panel ? null : panel;
          window.localStorage.setItem(DESKTOP_RIGHT_PANEL_STORAGE_KEY, JSON.stringify(next));
          return next;
        });
        return;
      }

      setActiveRightPanel((prev) => (prev === panel ? null : panel));
    },
    [isDesktopViewport],
  );

  const closeRightPanel = React.useCallback(() => {
    if (isDesktopViewport) {
      setActiveDesktopRightPanel(null);
      window.localStorage.setItem(DESKTOP_RIGHT_PANEL_STORAGE_KEY, JSON.stringify(null));
      return;
    }

    setActiveRightPanel(null);
  }, [isDesktopViewport]);

  const toggleTheme = React.useCallback(() => setIsDarkMode((prev) => !prev), []);

  const closeAllDrawers = React.useCallback(() => {
    setIsSidebarOpen(false);
    setActiveRightPanel(null);
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    window.localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const isRightPanelOpen = isDesktopViewport
    ? activeDesktopRightPanel === 'commentary'
    : activeRightPanel === 'commentary';

  /** @type {UIContextValue} */
  const providerValue = React.useMemo(
    () => ({
      isDesktopViewport,
      isSidebarOpen,
      setIsSidebarOpen,
      isDesktopSidebarOpen,
      setIsDesktopSidebarOpen,
      toggleSidebar,
      activeRightPanel,
      setActiveRightPanel,
      activeDesktopRightPanel,
      setActiveDesktopRightPanel,
      isRightPanelOpen,
      closeRightPanel,
      toggleRightPanel,
      isDarkMode,
      toggleTheme,
      closeAllDrawers,
    }),
    [
      isDesktopViewport,
      isSidebarOpen,
      isDesktopSidebarOpen,
      activeRightPanel,
      activeDesktopRightPanel,
      isRightPanelOpen,
      toggleSidebar,
      closeRightPanel,
      toggleRightPanel,
      isDarkMode,
      toggleTheme,
      closeAllDrawers,
    ],
  );

  return <UIContext.Provider value={providerValue}>{children}</UIContext.Provider>;
}

/**
 * @returns {UIContextValue | undefined}
 */
export function useUI() {
  return React.useContext(UIContext);
}
