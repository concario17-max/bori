export const DESKTOP_FRAME_COLUMNS_DEFAULT = '20% 60% 20%';
export const DESKTOP_FRAME_COLUMNS_LEFT_CLOSED = '0% 60% 40%';
export const DESKTOP_FRAME_COLUMNS_RIGHT_CLOSED = '20% 80% 0%';
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
