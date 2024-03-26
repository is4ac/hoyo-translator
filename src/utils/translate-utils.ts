import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let EnCapitalized = require('../../lang/characters.en-cap.json');
let EnToJp = require('../../lang/characters.en-to-jp.json');
let JpToEn = require('../../lang/characters.jp-to-en.json');

export function translateNames(message: string): string {
  return translateList(parseNames(message));
}

export function parseNames(message: string): string[] {
  let namesToTranslate = new Set<string>();

  // Check English names
  let split = splitMessage(message);
  let multiWordTokens = getMultiWordTokens();
  split = combineMultiWords(split, multiWordTokens);

  split.forEach(word => {
    if (word in EnToJp) {
      namesToTranslate.add(word);
    }
  });

  // Check Japanese names
  Object.keys(JpToEn).forEach(name => {
    if (message.includes(name)) {
      namesToTranslate.add(name);
    }
  });

  return [...namesToTranslate];
}

export function translateList(names: string[]): string {
  // Uses a map and set in order to dedupe the list
  const translatedMap = new Map<string, string>();
  const uniqueTranslatedNames = new Set<string>();

  names.forEach(name => {
    let translated = EnToJp[name] ? EnToJp[name] : JpToEn[name];

    if (!uniqueTranslatedNames.has(translated)) {
      uniqueTranslatedNames.add(translated);
      translatedMap.set(name, translated);
    }
  });

  const resultList = [];
  for (let [name, translated] of translatedMap.entries()) {
    resultList.push(`${EnCapitalized[name] ? EnCapitalized[name] : name} <=> ${translated}`);
  }

  return resultList.join('\n');
}

function getMultiWordTokens(): string[] {
  let tokens: string[] = [];

  Object.keys(EnToJp).forEach(name => {
    if (name.includes(' ')) {
      tokens.push(name);
    }
  });

  return tokens;
}

function combineMultiWords(wordList: string[], multiWordTokens: string[]): string[] {
  let newList = [...wordList];

  multiWordTokens.forEach(token => {
    let tokenSplit = token.split(' ');

    let startIndex = wordList.findIndex(word => word === tokenSplit[0]);

    // Check if all consecutive tokens match up in word list
    if (startIndex > -1) {
      for (let tokenIndex = 1; tokenIndex < tokenSplit.length; tokenIndex++) {
        if (tokenSplit[tokenIndex] !== wordList[startIndex + tokenIndex]) {
          return;
        }
      }

      newList.push(token);
    }
  });

  return newList;
}

/**
 * Splits the message into individual words and strips it of any special characters
 */
function splitMessage(message: string): string[] {
  let parsed = message.split(' ');

  parsed = parsed.map(word => stripSpecialChars(word)).map(word => word.toLocaleLowerCase());

  return parsed;
}

/**
 * Strips away all leading and trailing special characters from a string.
 * Also removes any ending 's
 * Thanks: https://stackoverflow.com/a/58469435
 */
function stripSpecialChars(word: string): string {
  return word
    .replace(/(^| +)[!-/:-@[-`{-~]*([^ ]*?)[!-/:-@[-`{-~]*(?=\s|$)/gi, '$1$2')
    .replace(/['’‘]s$/g, '');
}
