/** @typedef {import('../types').ReadingChapter} ReadingChapter */
/** @typedef {import('../types').ReadingParagraph} ReadingParagraph */

/**
 * @typedef ParsedKoreanEntry
 * @property {number} number
 * @property {number | null} verseNumber
 * @property {string} title
 * @property {string} tibetan
 * @property {string} korean
 */

/**
 * @typedef ParsedTocEntry
 * @property {string} title
 * @property {number} start
 * @property {number} end
 */

const BODHI_TITLE = '\uBCF4\uB9AC\uB3C4\uB4F1\uB860';

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
 * @returns {ParsedTocEntry[]}
 */
export function parseToc(source) {
  const pattern = /(.*?)\s*\([^0-9]*(\d+)(?:\s*~\s*[^0-9]*(\d+))?\)/g;
  /** @type {ParsedTocEntry[]} */
  const chapters = [];
  let match;

  while ((match = pattern.exec(source)) !== null) {
    chapters.push({
      title: normalizeWhitespace(match[1]),
      start: Number(match[2]),
      end: match[3] ? Number(match[3]) : Number(match[2]),
    });
  }

  return chapters;
}

/**
 * @param {ParsedTocEntry[]} chapters
 * @returns {ParsedTocEntry[]}
 */
export function normalizeReadingToc(chapters) {
  return chapters;
}

/**
 * @param {ParsedKoreanEntry[]} koreanEntries
 * @returns {ParsedTocEntry[]}
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
 * @param {ParsedTocEntry[]} toc
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
 * @param {ReadingChapter[]} chapters
 * @returns {ReadingParagraph[]}
 */
export function flattenParagraphs(chapters) {
  return chapters.flatMap((chapter) => chapter.paragraphs);
}
