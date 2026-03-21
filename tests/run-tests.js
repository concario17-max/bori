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
  createDefaultToc,
  createReadingData,
  flattenParagraphs,
  parseEnglishEntries,
  parseKoreanEntries,
} from '../src/lib/parseThreeBodiesCore.js';
import { resolveStoredActiveParagraph } from '../src/lib/readingState.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const BODHI_TITLE = '\uBCF4\uB9AC\uB3C4\uB4F1\uB860';

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

  const koreanEntries = parseKoreanEntries(koreanSource);
  const englishEntries = parseEnglishEntries(englishSource);
  const toc = createDefaultToc(koreanEntries);
  const chapters = createReadingData(koreanEntries, englishEntries, toc);
  const flatParagraphs = flattenParagraphs(chapters);
  const firstEnglishParagraph = flatParagraphs[1]?.text.english ?? '';

  assert.equal(koreanEntries.length, 70);
  assert.equal(englishEntries.size, 68);
  assert.equal(toc.length, 1);
  assert.equal(toc[0].start, 1);
  assert.equal(toc[0].title, BODHI_TITLE);
  assert.equal(chapters.length, 1);
  assert.equal(flatParagraphs.length, 70);
  assert.equal(flatParagraphs[0]?.paragraphNumber, 1);
  assert.equal(flatParagraphs.at(-1)?.paragraphNumber, 70);
  assert.equal(flatParagraphs[0]?.title, '귀경게 및 도입부');
  assert.equal(flatParagraphs[1]?.title, '제1송');
  assert.match(firstEnglishParagraph, /^Geshe Sonam Rinchen\n/m);
  assert.match(firstEnglishParagraph, /^Richard Sherburne\n/m);
  assert.doesNotMatch(firstEnglishParagraph, /^Geshe Sonam Rinchen:\s*1/m);
  assert.doesNotMatch(firstEnglishParagraph, /^Richard Sherburne:\s*1/m);
  assert.equal(flatParagraphs.at(-1)?.title, '결어');
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
      id: '1.2',
      title: '제1송',
      paragraphNumber: 2,
      chapterTitle: BODHI_TITLE,
      text: {
        tibetan: 'b',
        pronunciation: '',
        english: 'b',
        korean: 'b',
      },
    },
  ];

  assert.equal(
    resolveStoredActiveParagraph(JSON.stringify('1.2'), paragraphs[0], paragraphs)?.id,
    '1.2',
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
