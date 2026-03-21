import koSource from '../../1. 보리 티벳-한글.txt?raw';
import enSource from '../../2. 보리 영어 2개.txt?raw';
import commentaryTocSource from '../../3.보리난처석 목차.txt?raw';
import commentarySource from '../../4.보리난처석 영-한.txt?raw';
import {
  createCommentaryGroup,
  createDefaultToc,
  createReadingData,
  flattenParagraphs,
  parseCommentaryEntries,
  parseCommentaryToc,
  parseEnglishEntries,
  parseKoreanEntries,
} from './parseThreeBodiesCore';

export {
  createCommentaryGroup,
  createDefaultToc,
  createReadingData,
  flattenParagraphs,
  parseCommentaryEntries,
  parseCommentaryToc,
  parseEnglishEntries,
  parseKoreanEntries,
} from './parseThreeBodiesCore';

export function buildReadingData() {
  const koreanEntries = parseKoreanEntries(koSource);
  const rootChapters = createReadingData(
    koreanEntries,
    parseEnglishEntries(enSource),
    createDefaultToc(koreanEntries),
  );

  const commentaryGroup = createCommentaryGroup(
    parseCommentaryEntries(commentarySource),
    parseCommentaryToc(commentaryTocSource),
  );

  return [...rootChapters, commentaryGroup];
}
