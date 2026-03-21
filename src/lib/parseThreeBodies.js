import koSource from '../../1. 보리 티벳-한글.txt?raw';
import enSource from '../../2. 보리 영어 2개.txt?raw';
import commentarySource from '../../4.보리난처석 영-한.txt?raw';
import {
  createBodhiGroup,
  createCommentaryGroup,
  flattenParagraphs,
  parseCommentaryEntries,
  parseEnglishEntries,
  parseKoreanEntries,
} from './parseThreeBodiesCore';

export {
  createBodhiGroup,
  createCommentaryGroup,
  flattenParagraphs,
  parseCommentaryEntries,
  parseEnglishEntries,
  parseKoreanEntries,
} from './parseThreeBodiesCore';

export function buildReadingData() {
  const koreanEntries = parseKoreanEntries(koSource);
  const englishEntries = parseEnglishEntries(enSource);
  const commentaryEntries = parseCommentaryEntries(commentarySource);

  return [
    createBodhiGroup(koreanEntries, englishEntries),
    createCommentaryGroup(commentaryEntries),
  ];
}
