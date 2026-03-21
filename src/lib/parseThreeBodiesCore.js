/** @typedef {import('../types').ReadingChapter} ReadingChapter */
/** @typedef {import('../types').ReadingParagraph} ReadingParagraph */

const BODHI_TITLE = '\uBCF4\uB9AC\uB3C4\uB4F1\uB860';
const COMMENTARY_TITLE = '\uBCF4\uB9AC\uB3C4\uB4F1\uB860 \uB09C\uCC98\uC11D';

/**
 * @typedef ParsedKoreanEntry
 * @property {number} number
 * @property {number | null} verseNumber
 * @property {string} title
 * @property {string} tibetan
 * @property {string} korean
 */

/**
 * @typedef ParsedCommentaryEntry
 * @property {number} number
 * @property {string} english
 * @property {string} korean
 */

/**
 * @typedef ParsedCommentaryTocEntry
 * @property {string} title
 * @property {number} start
 * @property {number} end
 */

/**
 * @param {string} value
 * @returns {string}
 */
function normalizeWhitespace(value) {
  return value.replace(/\r/g, '').replace(/[ \t]+/g, ' ').trim();
}

/**
 * @param {string} title
 * @returns {number | null}
 */
function parseVerseNumber(title) {
  const match = title.match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

/**
 * @param {string} source
 * @returns {ParsedKoreanEntry[]}
 */
export function parseKoreanEntries(source) {
  const pattern =
    /\[([^\]]+)\]\s*\*\s*[^:]+:\s*([\s\S]*?)\s*\*\s*[^:]+:\s*([\s\S]*?)(?=\n\s*\[[^\]]+\]|\s*$)/g;
  /** @type {ParsedKoreanEntry[]} */
  const entries = [];
  let match;
  let sequence = 1;

  while ((match = pattern.exec(source)) !== null) {
    const title = normalizeWhitespace(match[1]);
    entries.push({
      number: sequence++,
      verseNumber: parseVerseNumber(title),
      title,
      tibetan: normalizeWhitespace(match[2]),
      korean: normalizeWhitespace(match[3]),
    });
  }

  return entries;
}

/**
 * @param {string} text
 * @returns {string}
 */
function stripLeadingVerseNumber(text) {
  return normalizeWhitespace(text).replace(/^\d+\s+/, '');
}

/**
 * @param {string} source
 * @returns {Map<number, string>}
 */
export function parseEnglishEntries(source) {
  const pattern = /\[(\d+)[^\]]*\]\s*([\s\S]*?)(?=\n\s*\[\d+[^\]]*\]|\s*$)/g;
  const entries = new Map();
  let match;

  while ((match = pattern.exec(source)) !== null) {
    const verseNumber = Number(match[1]);
    const body = match[2]
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const translationMatch = line.match(/^\*\s*\d+\.\s*([^:]+):\s*(.*)$/);
        if (!translationMatch) return null;
        const translator = normalizeWhitespace(translationMatch[1]);
        const text = stripLeadingVerseNumber(translationMatch[2]);
        return `${translator}\n${text}`;
      })
      .filter(Boolean)
      .join('\n\n');

    entries.set(verseNumber, body);
  }

  return entries;
}

/**
 * @param {string} source
 * @returns {ParsedCommentaryEntry[]}
 */
export function parseCommentaryEntries(source) {
  const pattern = /\[문단\s*(\d+)\]\s*([\s\S]*?)(?=\n\s*\[문단\s*\d+\]|\s*$)/g;
  /** @type {ParsedCommentaryEntry[]} */
  const entries = [];
  let match;

  while ((match = pattern.exec(source)) !== null) {
    const number = Number(match[1]);
    const block = match[2];
    const englishMatch = block.match(/English:\s*([\s\S]*?)\n\s*Korean:/);
    const koreanMatch = block.match(/Korean:\s*([\s\S]*?)\s*$/);

    entries.push({
      number,
      english: englishMatch ? normalizeWhitespace(englishMatch[1]) : '',
      korean: koreanMatch ? normalizeWhitespace(koreanMatch[1]) : '',
    });
  }

  return entries;
}

/**
 * @param {string} source
 * @returns {ParsedCommentaryTocEntry[]}
 */
export function parseCommentaryToc(source) {
  const lines = source
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  /** @type {ParsedCommentaryTocEntry[]} */
  const entries = [];
  /** @type {string[]} */
  const headingStack = [];

  for (const line of lines) {
    const rangeMatch = line.match(/^(.*?)(?:\s*\(|\s{2,})(?:본문\s*)?문단\s*(\d+)\s*-\s*문단\s*(\d+)\)?/);
    if (!rangeMatch) {
      headingStack.push(line.replace(/\*+/g, '').trim());
      continue;
    }

    const rawTitle = rangeMatch[1].replace(/\*+/g, '').trim().replace(/[.,]\s*$/, '');
    const start = Number(rangeMatch[2]);
    const end = Number(rangeMatch[3]);
    const parentContext = headingStack.at(-1) ?? '';
    let title = rawTitle;

    if (rawTitle === '본문' && parentContext) {
      title = parentContext;
    } else if (/^\d+장/.test(rawTitle) || /^\d+[.,]/.test(rawTitle)) {
      const majorContext = [...headingStack].reverse().find((item) => /^제\d+편/.test(item)) ?? '';
      title = majorContext ? `${majorContext} / ${rawTitle}` : rawTitle;
    }

    entries.push({ title, start, end });
  }

  return normalizeCommentaryToc(entries);
}

/**
 * @param {ParsedCommentaryTocEntry[]} entries
 * @returns {ParsedCommentaryTocEntry[]}
 */
export function normalizeCommentaryToc(entries) {
  return entries.map((entry, index) => {
    if (entry.end >= entry.start) return entry;
    const next = entries[index + 1];
    return {
      ...entry,
      end: next && next.start > entry.start ? next.start - 1 : entry.start,
    };
  });
}

/**
 * @param {ParsedKoreanEntry[]} koreanEntries
 * @returns {ParsedCommentaryTocEntry[]}
 */
export function createDefaultToc(koreanEntries) {
  if (koreanEntries.length === 0) return [];
  return [
    {
      title: BODHI_TITLE,
      start: koreanEntries[0].number,
      end: koreanEntries[koreanEntries.length - 1].number,
    },
  ];
}

/**
 * @param {ParsedKoreanEntry[]} koreanEntries
 * @param {Map<number, string>} englishEntries
 * @param {ParsedCommentaryTocEntry[]} toc
 * @returns {ReadingChapter[]}
 */
export function createReadingData(koreanEntries, englishEntries, toc) {
  return toc.map((chapter, chapterIndex) => ({
    id: String(chapterIndex + 1),
    chapterName: chapter.title,
    title: chapter.title,
    paragraphs: koreanEntries
      .filter((entry) => entry.number >= chapter.start && entry.number <= chapter.end)
      .map(
        /**
         * @returns {ReadingParagraph}
         */
        (entry, paragraphIndex) => ({
          id: `${chapterIndex + 1}.${paragraphIndex + 1}`,
          title: entry.title,
          paragraphNumber: entry.number,
          chapterTitle: chapter.title,
          text: {
            tibetan: entry.tibetan,
            pronunciation: '',
            english: entry.verseNumber ? englishEntries.get(entry.verseNumber) ?? '' : '',
            korean: entry.korean,
          },
        }),
      ),
  }));
}

/**
 * @param {ParsedCommentaryEntry[]} entries
 * @param {ParsedCommentaryTocEntry[]} toc
 * @returns {ReadingChapter}
 */
export function createCommentaryGroup(entries, toc) {
  return {
    id: 'commentary',
    chapterName: COMMENTARY_TITLE,
    title: COMMENTARY_TITLE,
    isGroup: true,
    subchapters: toc.map((section, index) => ({
      id: String(index + 1),
      chapterName: section.title,
      title: section.title,
      paragraphs: entries
        .filter((entry) => entry.number >= section.start && entry.number <= section.end)
        .map((entry, paragraphIndex) => ({
          id: `commentary.${index + 1}.${paragraphIndex + 1}`,
          title: `문단 ${entry.number}`,
          paragraphNumber: entry.number,
          chapterTitle: section.title,
          text: {
            tibetan: '',
            pronunciation: '',
            english: entry.english,
            korean: entry.korean,
          },
        })),
    })),
  };
}

/**
 * @param {ReadingChapter[]} chapters
 * @returns {ReadingParagraph[]}
 */
export function flattenParagraphs(chapters) {
  return chapters.flatMap((chapter) =>
    chapter.isGroup && chapter.subchapters
      ? chapter.subchapters.flatMap((subchapter) => subchapter.paragraphs ?? [])
      : chapter.paragraphs ?? [],
  );
}

export { BODHI_TITLE, COMMENTARY_TITLE };
