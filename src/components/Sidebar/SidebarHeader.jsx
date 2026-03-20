import React from 'react';
import { X } from 'lucide-react';

/**
 * @param {{ setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>> }} props
 */
function SidebarHeader({ setIsSidebarOpen }) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-gold-border/30 p-4 dark:border-[#333] lg:hidden">
      <span className="font-crimson text-lg font-bold text-text-primary dark:text-dark-text-primary">
        보리도등론
      </span>
      <button
        type="button"
        onClick={() => setIsSidebarOpen(false)}
        className="-mr-2 rounded-full p-2 text-text-secondary transition-colors hover:bg-gold-surface dark:text-dark-text-secondary dark:hover:bg-dark-surface"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

export default React.memo(SidebarHeader);
