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
 * @typedef TocSection
 * @property {string} title
 * @property {number} start
 * @property {number} end
 * @property {string[]} headings
 * @property {string} actionLabel
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
 * @returns {TocSection[]}
 */
export function createBodhiSections() {
  return [
    {
      title: '귀경게 및 도입부',
      start: 1,
      end: 1,
      headings: [],
      actionLabel: '귀경게 및 도입부',
    },
    {
      title: '게송',
      start: 2,
      end: 70,
      headings: [],
      actionLabel: '게송',
    },
  ];
}

/**
 * @returns {TocSection[]}
 */
export function createCommentarySections() {
  return [
    { title: '귀경게와 저술의 동기', start: 1, end: 15, headings: [], actionLabel: '귀경게와 저술의 동기' },
    { title: '제1편 삼사의 정의', start: 16, end: 19, headings: ['제1편 삼사의 정의'], actionLabel: '본문' },
    { title: '제2편 상사의 바라밀다승 / 1장. 상사의 바른방편 / 서문', start: 20, end: 21, headings: ['제2편 상사의 바라밀다승', '1장. 상사의 바른방편'], actionLabel: '서문' },
    { title: '제2편 상사의 바라밀다승 / 1장. 상사의 바른방편 / 1. 삼보에 귀의하기', start: 22, end: 23, headings: ['제2편 상사의 바라밀다승', '1장. 상사의 바른방편'], actionLabel: '1. 삼보에 귀의하기' },
    { title: '제2편 상사의 바라밀다승 / 1장. 상사의 바른방편 / 2. 삼보에 공양하기', start: 24, end: 56, headings: ['제2편 상사의 바라밀다승', '1장. 상사의 바른방편'], actionLabel: '2. 삼보에 공양하기' },
    { title: '제2편 상사의 바라밀다승 / 1장. 상사의 바른방편 / 3. 삼보에 귀의하는 법', start: 57, end: 77, headings: ['제2편 상사의 바라밀다승', '1장. 상사의 바른방편'], actionLabel: '3. 삼보에 귀의하는 법' },
    { title: '제2편 상사의 바라밀다승 / 2장. 원보리심과 행보리심 / 1. 보리심의 일으킴', start: 78, end: 107, headings: ['제2편 상사의 바라밀다승', '2장. 원보리심과 행보리심'], actionLabel: '1. 보리심의 일으킴' },
    { title: '제2편 상사의 바라밀다승 / 2장. 원보리심과 행보리심 / 2. 원심의 가르침', start: 108, end: 142, headings: ['제2편 상사의 바라밀다승', '2장. 원보리심과 행보리심'], actionLabel: '2. 원심의 가르침' },
    { title: '제2편 상사의 바라밀다승 / 2장. 원보리심과 행보리심 / 3. 행심(行心)의 가르침', start: 143, end: 156, headings: ['제2편 상사의 바라밀다승', '2장. 원보리심과 행보리심'], actionLabel: '3. 행심(行心)의 가르침' },
    { title: '제2편 상사의 바라밀다승 / 3장. 증상계학을 닦는 법 / 1. 보살계와 별해탈계의 관계', start: 157, end: 173, headings: ['제2편 상사의 바라밀다승', '3장. 증상계학을 닦는 법'], actionLabel: '1. 보살계와 별해탈계의 관계' },
    { title: '제2편 상사의 바라밀다승 / 3장. 증상계학을 닦는 법 / 2. 일곱 가지의 별해탈계', start: 174, end: 216, headings: ['제2편 상사의 바라밀다승', '3장. 증상계학을 닦는 법'], actionLabel: '2. 일곱 가지의 별해탈계' },
    { title: '제2편 상사의 바라밀다승 / 3장. 증상계학을 닦는 법 / 3. 대승의 보살계(菩薩戒)', start: 217, end: 310, headings: ['제2편 상사의 바라밀다승', '3장. 증상계학을 닦는 법'], actionLabel: '3. 대승의 보살계(菩薩戒)' },
    { title: '제2편 상사의 바라밀다승 / 4장. 증상정학을 닦는 법 / 1. 계학(戒學)과 정학(定學)의 관계', start: 311, end: 312, headings: ['제2편 상사의 바라밀다승', '4장. 증상정학을 닦는 법'], actionLabel: '1. 계학(戒學)과 정학(定學)의 관계' },
    { title: '제2편 상사의 바라밀다승 / 4장. 증상정학을 닦는 법 / 2. 삼매의 신통력(神通力)', start: 313, end: 340, headings: ['제2편 상사의 바라밀다승', '4장. 증상정학을 닦는 법'], actionLabel: '2. 삼매의 신통력(神通力)' },
    { title: '제2편 상사의 바라밀다승 / 4장. 증상정학을 닦는 법 / 3. 사마타(止)의 행상', start: 341, end: 368, headings: ['제2편 상사의 바라밀다승', '4장. 증상정학을 닦는 법'], actionLabel: '3. 사마타(止)의 행상' },
    { title: '제2편 상사의 바라밀다승 / 5장. 증상혜학(增上慧學)을 닦는 법 / 1. 위빠사나(觀)의 본질', start: 369, end: 370, headings: ['제2편 상사의 바라밀다승', '5장. 증상혜학(增上慧學)을 닦는 법'], actionLabel: '1. 위빠사나(觀)의 본질' },
    { title: '제2편 상사의 바라밀다승 / 5장. 증상혜학(增上慧學)을 닦는 법 / 2. 방편과 반야의 쌍운(雙運)', start: 371, end: 396, headings: ['제2편 상사의 바라밀다승', '5장. 증상혜학(增上慧學)을 닦는 법'], actionLabel: '2. 방편과 반야의 쌍운(雙運)' },
    { title: '제2편 상사의 바라밀다승 / 5장. 증상혜학(增上慧學)을 닦는 법 / 3. 사대증인(四大證因)을 통한 위빠사나(觀)의 수습', start: 397, end: 417, headings: ['제2편 상사의 바라밀다승', '5장. 증상혜학(增上慧學)을 닦는 법'], actionLabel: '3. 사대증인(四大證因)을 통한 위빠사나(觀)의 수습' },
    { title: '제2편 상사의 바라밀다승 / 5장. 증상혜학(增上慧學)을 닦는 법 / 4. 반야바라밀에 대한 아사리들의 견해', start: 418, end: 431, headings: ['제2편 상사의 바라밀다승', '5장. 증상혜학(增上慧學)을 닦는 법'], actionLabel: '4. 반야바라밀에 대한 아사리들의 견해' },
    { title: '제2편 상사의 바라밀다승 / 5장. 증상혜학(增上慧學)을 닦는 법 / 5. 유가수행의 핵심', start: 432, end: 447, headings: ['제2편 상사의 바라밀다승', '5장. 증상혜학(增上慧學)을 닦는 법'], actionLabel: '5. 유가수행의 핵심' },
    { title: '제2편 상사의 바라밀다승 / 5장. 증상혜학(增上慧學)을 닦는 법 / 6. 성언(聖言)에 의한 무자성의 결택', start: 448, end: 463, headings: ['제2편 상사의 바라밀다승', '5장. 증상혜학(增上慧學)을 닦는 법'], actionLabel: '6. 성언(聖言)에 의한 무자성의 결택' },
    { title: '제2편 상사의 바라밀다승 / 5장. 증상혜학(增上慧學)을 닦는 법 / 7. 중관논사의 법통', start: 464, end: 470, headings: ['제2편 상사의 바라밀다승', '5장. 증상혜학(增上慧學)을 닦는 법'], actionLabel: '7. 중관논사의 법통' },
    { title: '제2편 상사의 바라밀다승 / 5장. 증상혜학(增上慧學)을 닦는 법 / 8. 무분별의 위빠사나(勝觀)의 수습', start: 471, end: 478, headings: ['제2편 상사의 바라밀다승', '5장. 증상혜학(增上慧學)을 닦는 법'], actionLabel: '8. 무분별의 위빠사나(勝觀)의 수습' },
    { title: '제2편 상사의 바라밀다승 / 6장. 오도(五道)의 차제 / 1. 오도(五道)의 행상', start: 479, end: 485, headings: ['제2편 상사의 바라밀다승', '6장. 오도(五道)의 차제'], actionLabel: '1. 오도(五道)의 행상' },
    { title: '제2편 상사의 바라밀다승 / 6장. 오도(五道)의 차제 / 2. 대승(大乘)의 위대함', start: 486, end: 494, headings: ['제2편 상사의 바라밀다승', '6장. 오도(五道)의 차제'], actionLabel: '2. 대승(大乘)의 위대함' },
    { title: '제3편 진언대승(眞言大乘)의 길 / 1. 진언승의 뛰어난 방편', start: 495, end: 499, headings: ['제3편 진언대승(眞言大乘)의 길'], actionLabel: '1. 진언승의 뛰어난 방편' },
    { title: '제3편 진언대승(眞言大乘)의 길 / 2. 진언승의 종류', start: 500, end: 509, headings: ['제3편 진언대승(眞言大乘)의 길'], actionLabel: '2. 진언승의 종류' },
    { title: '제3편 진언대승(眞言大乘)의 길 / 3. 관정(灌頂)과 아사리의 공경', start: 510, end: 519, headings: ['제3편 진언대승(眞言大乘)의 길'], actionLabel: '3. 관정(灌頂)과 아사리의 공경' },
    { title: '제3편 진언대승(眞言大乘)의 길 / 4. 밀주(密呪)에 대한 곡해', start: 520, end: 530, headings: ['제3편 진언대승(眞言大乘)의 길'], actionLabel: '4. 밀주(密呪)에 대한 곡해' },
    { title: '제3편 진언대승(眞言大乘)의 길 / 5. 관정(灌頂)의 범주', start: 531, end: 539, headings: ['제3편 진언대승(眞言大乘)의 길'], actionLabel: '5. 관정(灌頂)의 범주' },
    { title: '제3편 진언대승(眞言大乘)의 길 / 6. 맺는말', start: 540, end: 543, headings: ['제3편 진언대승(眞言大乘)의 길'], actionLabel: '6. 맺는말' },
  ];
}

/**
 * @param {ParsedKoreanEntry[]} koreanEntries
 * @param {Map<number, string>} englishEntries
 * @returns {ReadingChapter}
 */
export function createBodhiGroup(koreanEntries, englishEntries) {
  const sections = createBodhiSections();

  return {
    id: 'bodhi',
    chapterName: BODHI_TITLE,
    title: BODHI_TITLE,
    isGroup: true,
    subchapters: sections.map((section, index) => ({
      id: String(index + 1),
      chapterName: section.actionLabel,
      title: section.title,
      tocHeadings: section.headings,
      tocActionLabel: section.actionLabel,
      paragraphs: koreanEntries
        .filter((entry) => entry.number >= section.start && entry.number <= section.end)
        .map((entry, paragraphIndex) => ({
          id: `bodhi.${index + 1}.${paragraphIndex + 1}`,
          title: entry.title,
          paragraphNumber: entry.number,
          chapterTitle: section.title,
          text: {
            tibetan: entry.tibetan,
            pronunciation: '',
            english: entry.verseNumber ? englishEntries.get(entry.verseNumber) ?? '' : '',
            korean: entry.korean,
          },
        })),
    })),
  };
}

/**
 * @param {ParsedCommentaryEntry[]} entries
 * @returns {ReadingChapter}
 */
export function createCommentaryGroup(entries) {
  const sections = createCommentarySections();

  return {
    id: 'commentary',
    chapterName: COMMENTARY_TITLE,
    title: COMMENTARY_TITLE,
    isGroup: true,
    subchapters: sections.map((section, index) => ({
      id: String(index + 1),
      chapterName: section.actionLabel,
      title: section.title,
      tocHeadings: section.headings,
      tocActionLabel: section.actionLabel,
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
