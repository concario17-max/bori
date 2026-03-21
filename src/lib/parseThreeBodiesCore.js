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
 * @property {string} label
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
      label: '귀경게 및 도입부\n(문단 1)',
    },
    {
      title: '게송',
      start: 2,
      end: 70,
      label: '게송\n(문단 2 - 문단 70)',
    },
  ];
}

/**
 * @returns {TocSection[]}
 */
export function createCommentarySections() {
  return [
    { title: '귀경게와 저술의 동기', start: 1, end: 15, label: '귀경게와 저술의 동기\n본문 (문단 1 - 문단 15)' },
    { title: '제1편 삼사의 정의', start: 16, end: 19, label: '제1편 삼사의 정의\n본문 (문단 16 - 문단 19)' },
    { title: '제2편 상사의 바라밀다승 / 1장. 상사의 바른방편 / 서문', start: 20, end: 21, label: '제2편 상사의 바라밀다승\n1장. 상사의 바른방편\n서문 (문단 20 - 문단 21)' },
    { title: '제2편 상사의 바라밀다승 / 1장. 상사의 바른방편 / 1. 삼보에 귀의하기', start: 22, end: 23, label: '제2편 상사의 바라밀다승\n1장. 상사의 바른방편\n1. 삼보에 귀의하기  (문단 22 - 문단 21)' },
    { title: '제2편 상사의 바라밀다승 / 1장. 상사의 바른방편 / 2. 삼보에 공양하기', start: 24, end: 56, label: '제2편 상사의 바라밀다승\n1장. 상사의 바른방편\n2. 삼보에 공양하기  (문단 24 - 문단 56)' },
    { title: '제2편 상사의 바라밀다승 / 1장. 상사의 바른방편 / 3. 삼보에 귀의하는 법', start: 57, end: 77, label: '제2편 상사의 바라밀다승\n1장. 상사의 바른방편\n3, 삼보에 귀의하는 법 (문단 57 - 문단 77)' },
    { title: '제2편 상사의 바라밀다승 / 2장. 원보리심과 행보리심 / 1. 보리심의 일으킴', start: 78, end: 107, label: '제2편 상사의 바라밀다승\n2장. 원보리심과 행보리심\n1. 보리심의 일으킴 (문단 78 - 문단 107)' },
    { title: '제2편 상사의 바라밀다승 / 2장. 원보리심과 행보리심 / 2. 원심의 가르침', start: 108, end: 142, label: '제2편 상사의 바라밀다승\n2장. 원보리심과 행보리심\n2. 원심의 가르침 (문단 108 - 문단 142)' },
    { title: '제2편 상사의 바라밀다승 / 2장. 원보리심과 행보리심 / 3. 행심(行心)의 가르침', start: 143, end: 156, label: '제2편 상사의 바라밀다승\n2장. 원보리심과 행보리심\n3. 행심(行心)의 가르침 (문단 143 - 문단 156)' },
    { title: '제2편 상사의 바라밀다승 / 3장. 증상계학을 닦는 법 / 1. 보살계와 별해탈계의 관계', start: 157, end: 173, label: '제2편 상사의 바라밀다승\n3장. 증상계학을 닦는 법\n1. 보살계와 별해탈계의 관계 (문단 157 - 문단 173)' },
    { title: '제2편 상사의 바라밀다승 / 3장. 증상계학을 닦는 법 / 2. 일곱 가지의 별해탈계', start: 174, end: 216, label: '제2편 상사의 바라밀다승\n3장. 증상계학을 닦는 법\n2. 일곱 가지의 별해탈계 (문단 174 - 문단 216)' },
    { title: '제2편 상사의 바라밀다승 / 3장. 증상계학을 닦는 법 / 3. 대승의 보살계(菩薩戒)', start: 217, end: 310, label: '제2편 상사의 바라밀다승\n3장. 증상계학을 닦는 법\n3. 대승의 보살계(菩薩戒) (문단 217 - 문단 310)' },
    { title: '제2편 상사의 바라밀다승 / 4장. 증상정학을 닦는 법 / 1. 계학(戒學)과 정학(定學)의 관계', start: 311, end: 312, label: '제2편 상사의 바라밀다승\n4장. 증상정학을 닦는 법\n1. 계학(戒學)과 정학(定學)의 관계 (문단 311 - 문단 312)' },
    { title: '제2편 상사의 바라밀다승 / 4장. 증상정학을 닦는 법 / 2. 삼매의 신통력(神通力)', start: 313, end: 340, label: '제2편 상사의 바라밀다승\n4장. 증상정학을 닦는 법\n2. 삼매의 신통력(神通力)  (문단 313 - 문단 340)' },
    { title: '제2편 상사의 바라밀다승 / 4장. 증상정학을 닦는 법 / 3. 사마타(止)의 행상', start: 341, end: 368, label: '제2편 상사의 바라밀다승\n4장. 증상정학을 닦는 법\n3. 사마타(止)의 행상  (문단 341 - 문단 368)' },
    { title: '제2편 상사의 바라밀다승 / 5장. 증상혜학(增上慧學)을 닦는 법 / 1. 위빠사나(觀)의 본질', start: 369, end: 370, label: '제2편 상사의 바라밀다승\n5장. 증상혜학(增上慧學)을 닦는 법\n1. 위빠사나(觀)의 본질  (문단 369 - 문단 370)' },
    { title: '제2편 상사의 바라밀다승 / 5장. 증상혜학(增上慧學)을 닦는 법 / 2. 방편과 반야의 쌍운(雙運)', start: 371, end: 396, label: '제2편 상사의 바라밀다승\n5장. 증상혜학(增上慧學)을 닦는 법\n2. 방편과 반야의 쌍운(雙運) (문단 371 - 문단 396)' },
    { title: '제2편 상사의 바라밀다승 / 5장. 증상혜학(增上慧學)을 닦는 법 / 3. 사대증인(四大證因)을 통한 위빠사나(觀)의 수습', start: 397, end: 417, label: '제2편 상사의 바라밀다승\n5장. 증상혜학(增上慧學)을 닦는 법\n3. 사대증인(四大證因)을 통한 위빠사나(觀)의 수습 (문단 397 - 문단 417)' },
    { title: '제2편 상사의 바라밀다승 / 5장. 증상혜학(增上慧學)을 닦는 법 / 4. 반야바라밀에 대한 아사리들의 견해', start: 418, end: 431, label: '제2편 상사의 바라밀다승\n5장. 증상혜학(增上慧學)을 닦는 법\n4. 반야바라밀에 대한 아사리들의 견해 (문단 418 - 문단 431)' },
    { title: '제2편 상사의 바라밀다승 / 5장. 증상혜학(增上慧學)을 닦는 법 / 5. 유가수행의 핵심', start: 432, end: 447, label: '제2편 상사의 바라밀다승\n5장. 증상혜학(增上慧學)을 닦는 법\n5. 유가수행의 핵심 (문단 432 - 문단 447)' },
    { title: '제2편 상사의 바라밀다승 / 5장. 증상혜학(增上慧學)을 닦는 법 / 6. 성언(聖言)에 의한 무자성의 결택', start: 448, end: 463, label: '제2편 상사의 바라밀다승\n5장. 증상혜학(增上慧學)을 닦는 법\n6. 성언(聖言)에 의한 무자성의 결택 (문단 448 - 문단 463)' },
    { title: '제2편 상사의 바라밀다승 / 5장. 증상혜학(增上慧學)을 닦는 법 / 7. 중관논사의 법통', start: 464, end: 470, label: '제2편 상사의 바라밀다승\n5장. 증상혜학(增上慧學)을 닦는 법\n7. 중관논사의 법통 (문단 464 - 문단 470)' },
    { title: '제2편 상사의 바라밀다승 / 5장. 증상혜학(增上慧學)을 닦는 법 / 8. 무분별의 위빠사나(勝觀)의 수습', start: 471, end: 478, label: '제2편 상사의 바라밀다승\n5장. 증상혜학(增上慧學)을 닦는 법\n8. 무분별의 위빠사나(勝觀)의 수습 (문단 471 - 문단 478)' },
    { title: '제2편 상사의 바라밀다승 / 6장. 오도(五道)의 차제 / 1. 오도(五道)의 행상', start: 479, end: 485, label: '제2편 상사의 바라밀다승\n6장. 오도(五道)의 차제\n1. 오도(五道)의 행상 (문단 479 - 문단 485)' },
    { title: '제2편 상사의 바라밀다승 / 6장. 오도(五道)의 차제 / 2. 대승(大乘)의 위대함', start: 486, end: 494, label: '제2편 상사의 바라밀다승\n6장. 오도(五道)의 차제\n2. 대승(大乘)의 위대함 (문단 486 - 문단 494)' },
    { title: '제3편 진언대승(眞言大乘)의 길 / 1. 진언승의 뛰어난 방편', start: 495, end: 499, label: '제3편 진언대승(眞言大乘)의 길\n1. 진언승의 뛰어난 방편 (문단 495 - 문단 499)' },
    { title: '제3편 진언대승(眞言大乘)의 길 / 2. 진언승의 종류', start: 500, end: 509, label: '제3편 진언대승(眞言大乘)의 길\n2. 진언승의 종류  (문단 500 - 문단 509)' },
    { title: '제3편 진언대승(眞言大乘)의 길 / 3. 관정(灌頂)과 아사리의 공경', start: 510, end: 519, label: '제3편 진언대승(眞言大乘)의 길\n3. 관정(灌頂)과 아사리의 공경 (문단 510 - 문단 519)' },
    { title: '제3편 진언대승(眞言大乘)의 길 / 4. 밀주(密呪)에 대한 곡해', start: 520, end: 530, label: '제3편 진언대승(眞言大乘)의 길\n4. 밀주(密呪)에 대한 곡해 (문단 520 - 문단 530)' },
    { title: '제3편 진언대승(眞言大乘)의 길 / 5. 관정(灌頂)의 범주', start: 531, end: 539, label: '제3편 진언대승(眞言大乘)의 길\n5. 관정(灌頂)의 범주 (문단 531 - 문단 539)' },
    { title: '제3편 진언대승(眞言大乘)의 길 / 6. 맺는말', start: 540, end: 543, label: '제3편 진언대승(眞言大乘)의 길\n6. 맺는말 (문단 540 - 문단 543)' },
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
      chapterName: section.label,
      title: section.title,
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
      chapterName: section.label,
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
