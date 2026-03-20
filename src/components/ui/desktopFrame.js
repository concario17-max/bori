export const DESKTOP_FRAME_COLUMNS_DEFAULT = '18% 64% 18%';
export const DESKTOP_FRAME_COLUMNS_LEFT_CLOSED = '0% 68% 32%';
export const DESKTOP_FRAME_COLUMNS_RIGHT_CLOSED = '18% 82% 0%';
export const DESKTOP_FRAME_COLUMNS_FULL_WIDTH = '0% 100% 0%';

export function getDesktopFrameColumns(isDesktopSidebarOpen, isDesktopRightPanelOpen) {
  if (!isDesktopRightPanelOpen) {
    return isDesktopSidebarOpen
      ? DESKTOP_FRAME_COLUMNS_RIGHT_CLOSED
      : DESKTOP_FRAME_COLUMNS_FULL_WIDTH;
  }

  return isDesktopSidebarOpen
    ? DESKTOP_FRAME_COLUMNS_DEFAULT
    : DESKTOP_FRAME_COLUMNS_LEFT_CLOSED;
}
