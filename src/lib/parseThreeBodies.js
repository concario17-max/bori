import koSource from '../../1. 보리 티벳-한글.txt?raw';
import enSource from '../../2. 보리 영어 2개.txt?raw';
import {
  createDefaultToc,
  createReadingData,
  flattenParagraphs,
  normalizeReadingToc,
  parseEnglishEntries,
  parseKoreanEntries,
} from './parseThreeBodiesCore';

export {
  createDefaultToc,
  createReadingData,
  flattenParagraphs,
  normalizeReadingToc,
  parseEnglishEntries,
  parseKoreanEntries,
} from './parseThreeBodiesCore';

export function buildReadingData() {
  const koreanEntries = parseKoreanEntries(koSource);
  return createReadingData(
    koreanEntries,
    parseEnglishEntries(enSource),
    normalizeReadingToc(createDefaultToc(koreanEntries)),
  );
}
