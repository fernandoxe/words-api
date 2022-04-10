import { FIRST_DAY, DAY_MS } from '../constants';
import { Word } from '../interfaces';

export const getToday = () => new Date(new Date().setHours(0, 0, 0, 0));

export const getDateParsed = (date: Date) => date.toISOString().slice(0,10);

export const getDaysFromFirstDay = (date: Date) => {
  const firstDay = new Date(FIRST_DAY)
  const days = Math.round(Math.abs((date.valueOf() - firstDay.valueOf()) / DAY_MS));
  return days;
};

export const getTodayWord = (words: Word[]) => {
  const today = getToday();
  const date = getDateParsed(today);
  const daysFromFirstDay = getDaysFromFirstDay(today);
  return {
    word: words[daysFromFirstDay % words.length],
    date,
  };
};

export const getRandomWord = (words: Word[]) => {
  return words[Math.floor(Math.random() * words.length)];
};
