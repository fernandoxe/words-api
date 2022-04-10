import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRandomWord } from '../../../src/services';
import { words } from '../../../data/taylor';

export default (_req: VercelRequest, res: VercelResponse) => {
  const randomWord = getRandomWord(words);
  res.json(randomWord);
};
