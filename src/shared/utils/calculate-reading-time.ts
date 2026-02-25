const WORDS_PER_MINUTE = 200;
const MIN_READING_TIME_MINUTES = 1;

const wordPattern = /[A-Za-z0-9]+/g;

export function calculateReadingTime(text: string): number {
  const words = text.match(wordPattern);
  const wordCount = words ? words.length : 0;
  const minutes = Math.round(wordCount / WORDS_PER_MINUTE);
  return Math.max(MIN_READING_TIME_MINUTES, minutes);
}
