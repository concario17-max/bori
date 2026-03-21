import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DESKTOP_FRAME_COLUMNS_DEFAULT,
  DESKTOP_FRAME_COLUMNS_FULL_WIDTH,
  DESKTOP_FRAME_COLUMNS_LEFT_CLOSED,
  DESKTOP_FRAME_COLUMNS_RIGHT_CLOSED,
  getDesktopFrameColumns,
} from '../src/components/ui/desktopFrame.js';
import {
  BODHI_TITLE,
  COMMENTARY_TITLE,
  createCommentaryGroup,
  createDefaultToc,
  createReadingData,
  flattenParagraphs,
  parseCommentaryEntries,
  parseCommentaryToc,
  parseEnglishEntries,
  parseKoreanEntries,
} from '../src/lib/parseThreeBodiesCore.js';
import { resolveStoredActiveParagraph } from '../src/lib/readingState.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

async function loadFixture(name) {
  return readFile(path.join(projectRoot, name), 'utf8');
}

function runDesktopFrameTests() {
  assert.equal(getDesktopFrameColumns(true, true), DESKTOP_FRAME_COLUMNS_DEFAULT);
  assert.equal(getDesktopFrameColumns(false, true), DESKTOP_FRAME_COLUMNS_LEFT_CLOSED);
  assert.equal(getDesktopFrameColumns(true, false), DESKTOP_FRAME_COLUMNS_RIGHT_CLOSED);
  assert.equal(getDesktopFrameColumns(false, false), DESKTOP_FRAME_COLUMNS_FULL_WIDTH);
}

async function runParserTests() {
  const koreanSource = await loadFixture('1. 보리 티벳-한글.txt');
  const englishSource = await loadFixture('2. 보리 영어 2개.txt');
  const commentaryTocSource = await loadFixture('3.보리난처석 목차.txt');
  const commentarySource = await loadFixture('4.보리난처석 영-한.txt');

  const koreanEntries = parseKoreanEntries(koreanSource);
  const englishEntries = parseEnglishEntries(englishSource);
  const chapters = createReadingData(koreanEntries, englishEntries, createDefaultToc(koreanEntries));
  const commentaryEntries = parseCommentaryEntries(commentarySource);
  const commentaryToc = parseCommentaryToc(commentaryTocSource);
  const commentaryGroup = createCommentaryGroup(commentaryEntries, commentaryToc);
  const flatParagraphs = flattenParagraphs([...chapters, commentaryGroup]);

  assert.equal(chapters.length, 1);
  assert.equal(chapters[0].title, BODHI_TITLE);
  assert.equal(chapters[0].paragraphs?.length, 70);

  assert.equal(commentaryEntries.length, 545);
  assert.equal(commentaryToc[0].title, '귀경게와 저술의 동기');
  assert.equal(commentaryToc[0].start, 1);
  assert.equal(commentaryToc[0].end, 15);
  assert.equal(commentaryToc[3].title, '제2편 상사의 바라밀다승 / 1. 삼보에 귀의하기');
  assert.equal(commentaryToc[3].start, 22);
  assert.equal(commentaryToc[3].end, 23);
  assert.equal(commentaryGroup.title, COMMENTARY_TITLE);
  assert.equal(commentaryGroup.isGroup, true);
  assert.equal(commentaryGroup.subchapters?.length, commentaryToc.length);
  assert.equal(commentaryGroup.subchapters?.[0]?.paragraphs?.length, 15);
  assert.equal(commentaryGroup.subchapters?.[0]?.paragraphs?.[0]?.text.english.startsWith('I pay homage'), true);
  assert.equal(commentaryGroup.subchapters?.at(-1)?.paragraphs?.at(-1)?.paragraphNumber, 543);

  assert.equal(flatParagraphs.length, 70 + 545);
  assert.equal(flatParagraphs[0]?.chapterTitle, BODHI_TITLE);
  assert.equal(flatParagraphs[70]?.chapterTitle, '귀경게와 저술의 동기');
}

function runReadingStateTests() {
  const paragraphs = [
    {
      id: '1.1',
      title: '귀경게 및 도입부',
      paragraphNumber: 1,
      chapterTitle: BODHI_TITLE,
      text: {
        tibetan: 'a',
        pronunciation: '',
        english: 'a',
        korean: 'a',
      },
    },
    {
      id: 'commentary.1.1',
      title: '문단 1',
      paragraphNumber: 1,
      chapterTitle: '귀경게와 저술의 동기',
      text: {
        tibetan: '',
        pronunciation: '',
        english: 'b',
        korean: 'b',
      },
    },
  ];

  assert.equal(
    resolveStoredActiveParagraph(JSON.stringify('commentary.1.1'), paragraphs[0], paragraphs)?.id,
    'commentary.1.1',
  );
  assert.equal(
    resolveStoredActiveParagraph('{bad json', paragraphs[0], paragraphs)?.id,
    '1.1',
  );
}

async function main() {
  runDesktopFrameTests();
  await runParserTests();
  runReadingStateTests();
  console.log('All tests passed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
