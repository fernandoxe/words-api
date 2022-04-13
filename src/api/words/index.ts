import { FastifyReply, FastifyRequest } from 'fastify';
import { getRandomWord, getTodayWord } from '../../services/words';
import { words } from '../../../data/words';

export default (req: FastifyRequest, res: FastifyReply) => {
  const { random } = <{random: string}>req.query;
  
  if(random === '1') {
    const randomWord = getRandomWord(words);
    res.status(200).send(randomWord);
  } else {
    const todayWord = getTodayWord(words);
    res.status(200).send(todayWord);
  }
};
