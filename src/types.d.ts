import type { Dispatch, ReactNode, SetStateAction } from 'react';

export type RightPanelType = 'commentary' | null;

export interface ReadingText {
  tibetan: string;
  pronunciation: string;
  english: string;
  korean: string;
}

export interface ReadingParagraph {
  id: string;
  title: string;
  paragraphNumber: number;
  chapterTitle: string;
  text: ReadingText;
}

export interface ReadingChapter {
  id: string;
  chapterName: string;
  title: string;
  paragraphs: ReadingParagraph[];
}

export interface UIContextValue {
  isDesktopViewport: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  isDesktopSidebarOpen: boolean;
  setIsDesktopSidebarOpen: Dispatch<SetStateAction<boolean>>;
  toggleSidebar: () => void;
  activeRightPanel: RightPanelType;
  setActiveRightPanel: Dispatch<SetStateAction<RightPanelType>>;
  activeDesktopRightPanel: RightPanelType;
  setActiveDesktopRightPanel: Dispatch<SetStateAction<RightPanelType>>;
  isRightPanelOpen: boolean;
  closeRightPanel: () => void;
  toggleRightPanel: (panel?: 'commentary') => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  closeAllDrawers: () => void;
}

export interface AppShellProps {
  header: ReactNode;
  sidebar: ReactNode;
  rightPanel: ReactNode;
  children: ReactNode;
  isMobilePanelOpen?: boolean;
  desktopGridColumns: string;
}

export interface SidebarLayoutProps {
  isOpen: boolean;
  isDesktopOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  position?: 'left' | 'right';
  widthClass?: string;
  className?: string;
  bodyClassName?: string;
}
