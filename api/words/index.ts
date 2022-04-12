import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRandomWord, getTodayWord } from '../../src/services/words';
import { words } from '../../data/words';

export default (req: VercelRequest, res: VercelResponse) => {
  if(req.query.random === '1') {
    const randomWord = getRandomWord(words);
    res.status(200).json(randomWord);
  } else {
    const todayWord = getTodayWord(words);
    res.status(200).json(todayWord);
  }
};
