import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTodayWord } from '../../src/services';
import { words } from '../../data/taylor';

export default (_req: VercelRequest, res: VercelResponse) => {
  const todayWord = getTodayWord(words);
  res.json(todayWord);
};
