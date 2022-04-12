import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRandomWord } from '../../../src/services/words';
import { words } from '../../../data/words';

export default (_req: VercelRequest, res: VercelResponse) => {
  const randomWord = getRandomWord(words);
  res.json(randomWord);
};
