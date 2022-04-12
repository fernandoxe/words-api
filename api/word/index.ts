import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTodayWord } from '../../src/services/words';
import { words } from '../../data/words';

export default (_req: VercelRequest, res: VercelResponse) => {
  const todayWord = getTodayWord(words);
  res.json(todayWord);
};
