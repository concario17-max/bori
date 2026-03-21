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
  createBodhiGroup,
  createCommentaryGroup,
  createBodhiSections,
  createCommentarySections,
  flattenParagraphs,
  parseCommentaryEntries,
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
  const commentarySource = await loadFixture('4.보리난처석 영-한.txt');

  const koreanEntries = parseKoreanEntries(koreanSource);
  const englishEntries = parseEnglishEntries(englishSource);
  const commentaryEntries = parseCommentaryEntries(commentarySource);
  const bodhiGroup = createBodhiGroup(koreanEntries, englishEntries);
  const commentaryGroup = createCommentaryGroup(commentaryEntries);
  const flatParagraphs = flattenParagraphs([bodhiGroup, commentaryGroup]);
  const bodhiSections = createBodhiSections();
  const commentarySections = createCommentarySections();

  assert.equal(bodhiGroup.title, BODHI_TITLE);
  assert.equal(bodhiGroup.isGroup, true);
  assert.equal(bodhiGroup.subchapters?.length, 2);
  assert.deepEqual(bodhiSections[0].headings, []);
  assert.equal(bodhiSections[0].actionLabel, '귀경게 및 도입부');
  assert.equal(bodhiSections[1].actionLabel, '게송');
  assert.equal(bodhiGroup.subchapters?.[0]?.paragraphs?.length, 1);
  assert.equal(bodhiGroup.subchapters?.[1]?.paragraphs?.length, 69);
  assert.equal(bodhiGroup.subchapters?.[1]?.tocActionLabel, '게송');

  assert.equal(commentaryGroup.title, COMMENTARY_TITLE);
  assert.equal(commentaryGroup.isGroup, true);
  assert.equal(commentaryGroup.subchapters?.length, commentarySections.length);
  assert.deepEqual(commentarySections[0].headings, []);
  assert.equal(commentarySections[0].actionLabel, '귀경게와 저술의 동기');
  assert.deepEqual(commentarySections[2].headings, ['제2편 상사의 바라밀다승', '1장. 상사의 바른방편']);
  assert.equal(commentarySections[2].actionLabel, '서문');
  assert.equal(commentarySections[3].actionLabel, '1. 삼보에 귀의하기');
  assert.equal(commentaryGroup.subchapters?.[0]?.paragraphs?.[0]?.paragraphNumber, 1);
  assert.equal(commentaryGroup.subchapters?.at(-1)?.paragraphs?.at(-1)?.paragraphNumber, 543);
  assert.deepEqual(commentaryGroup.subchapters?.[2]?.tocHeadings, ['제2편 상사의 바라밀다승', '1장. 상사의 바른방편']);
  assert.equal(commentaryGroup.subchapters?.[2]?.tocActionLabel, '서문');

  assert.equal(flatParagraphs[0]?.chapterTitle, '귀경게 및 도입부');
  assert.equal(flatParagraphs[1]?.chapterTitle, '게송');
  assert.equal(flatParagraphs[70]?.chapterTitle, '귀경게와 저술의 동기');
}

function runReadingStateTests() {
  const paragraphs = [
    {
      id: 'bodhi.1.1',
      title: '귀경게 및 도입부',
      paragraphNumber: 1,
      chapterTitle: '귀경게 및 도입부',
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
    'bodhi.1.1',
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
