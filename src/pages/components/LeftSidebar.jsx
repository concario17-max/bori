import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import SidebarHeader from '../../components/Sidebar/SidebarHeader';
import SidebarChapterList from '../../components/Sidebar/SidebarChapterList';
import SidebarVerseList from '../../components/Sidebar/SidebarVerseList';
import SidebarLayout from '../../components/ui/SidebarLayout';

const LeftSidebar = ({ chapters, onSelectParagraph, activeParagraphId, isPrayerPage = false }) => {
  const uiContext = useUI() || {
    isSidebarOpen: false,
    setIsSidebarOpen: () => {},
    isDesktopSidebarOpen: true,
  };
  const { isSidebarOpen, setIsSidebarOpen, isDesktopSidebarOpen } = uiContext;
  const isSingleChapter = (chapters?.length ?? 0) <= 1;

  const paragraphIndices = React.useMemo(() => {
    const map = {};
    let count = 1;

    chapters?.forEach((chapter) => {
      if (isPrayerPage) count = 1;

      if (chapter.isGroup && chapter.subchapters) {
        chapter.subchapters.forEach((subchapter) => {
          if (isPrayerPage) count = 1;
          subchapter.paragraphs?.forEach((paragraph) => {
            map[paragraph.id] = count++;
          });
        });
      } else {
        chapter.paragraphs?.forEach((paragraph) => {
          map[paragraph.id] = count++;
        });
      }
    });

    return map;
  }, [chapters, isPrayerPage]);

  const [expandedChapter, setExpandedChapter] = useState(() => {
    if (isSingleChapter && chapters?.[0]?.id) return chapters[0].id;
    if (!activeParagraphId || !chapters) return null;

    for (const chapter of chapters) {
      if (chapter.isGroup && chapter.subchapters) {
        const subchapter = chapter.subchapters.find((item) =>
          item.paragraphs?.some((paragraph) => paragraph.id === activeParagraphId),
        );
        if (subchapter) return `${chapter.id}-${subchapter.id}`;
      } else if (chapter.paragraphs?.some((paragraph) => paragraph.id === activeParagraphId)) {
        return chapter.id;
      }
    }

    return null;
  });

  React.useEffect(() => {
    if (isSingleChapter && chapters?.[0]?.id) {
      if (expandedChapter !== chapters[0].id) {
        setExpandedChapter(chapters[0].id);
      }
      return;
    }

    if (!activeParagraphId || !chapters) return;

    let targetChapterId = null;
    for (const chapter of chapters) {
      if (chapter.isGroup && chapter.subchapters) {
        const subchapter = chapter.subchapters.find((item) =>
          item.paragraphs?.some((paragraph) => paragraph.id === activeParagraphId),
        );
        if (subchapter) {
          targetChapterId = `${chapter.id}-${subchapter.id}`;
          break;
        }
      } else if (chapter.paragraphs?.some((paragraph) => paragraph.id === activeParagraphId)) {
        targetChapterId = chapter.id;
        break;
      }
    }

    if (targetChapterId && targetChapterId !== expandedChapter) {
      setExpandedChapter(targetChapterId);
    }
  }, [activeParagraphId, chapters, expandedChapter, isSingleChapter]);

  const toggleChapter = React.useCallback(
    (chapterId) => {
      if (isSingleChapter) return;
      setExpandedChapter((prev) => (prev === chapterId ? null : chapterId));
    },
    [isSingleChapter],
  );

  return (
    <SidebarLayout
      isOpen={isSidebarOpen}
      isDesktopOpen={isDesktopSidebarOpen}
      onClose={() => setIsSidebarOpen(false)}
      position="left"
      widthClass="w-80"
      className="dark:bg-dark-bg/95"
    >
      <SidebarHeader setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex min-h-0 flex-1 flex-col bg-white/80 dark:bg-dark-bg/95">
        {!isSingleChapter ? (
          <SidebarChapterList
            chapters={chapters}
            expandedChapter={expandedChapter}
            toggleChapter={toggleChapter}
            onSelectParagraph={onSelectParagraph}
          />
        ) : null}

        <SidebarVerseList
          chapters={chapters}
          expandedChapter={expandedChapter}
          activeParagraphId={activeParagraphId}
          paragraphIndices={paragraphIndices}
          onSelectParagraph={onSelectParagraph}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
    </SidebarLayout>
  );
};

export default React.memo(
  LeftSidebar,
  (prevProps, nextProps) =>
    prevProps.activeParagraphId === nextProps.activeParagraphId &&
    prevProps.chapters === nextProps.chapters,
);
