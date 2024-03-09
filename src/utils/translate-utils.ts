import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let EnCapitalized = require('../../lang/characters.en-cap.json');
let EnToJp = require('../../lang/characters.en-to-jp.json');
let JpToEn = require('../../lang/characters.jp-to-en.json');

export function translateNames(message: string): string {
  return translateList(parseNames(message));
}

export function parseNames(message: string): string[] {
  let namesToTranslate: string[] = [];

  // Check English names
  let split = splitMessage(message);
  let multiWordTokens = getMultiWordTokens();
  split = combineMultiWords(split, multiWordTokens);

  // @TODO: Need a way to check for certain character names that have
  // spaces like "Yae Miko" or "Kuki Shinobu"

  split.forEach(word => {
    if (word in EnToJp) {
      namesToTranslate.push(word);
    }
  });

  // Check Japanese names
  Object.keys(JpToEn).forEach(name => {
    if (message.includes(name)) {
      namesToTranslate.push(name);
    }
  });

  return namesToTranslate;
}

export function translateList(names: string[]): string {
  return names
    .map(
      name =>
        `${EnCapitalized[name] ? EnCapitalized[name] : name} <=> ${
          EnToJp[name] ? EnToJp[name] : JpToEn[name]
        }`
    )
    .join('\n');
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
  let newList: string[] = [];

  multiWordTokens.forEach(token => {
    let tokenSplit = token.split(' ');

    newList.findIndex(word => word === tokenSplit[0]);
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
    .replace(/'s$/g, '');
}
