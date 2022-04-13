import Twit from 'twit';
import { FastifyReply, FastifyRequest } from 'fastify';
import { words } from '../../../../data/words';
import { words as wordsConfig, headers } from '../../../../.config';
import { tw, twyd } from '../../../services/tw';
import * as constants from '../../../constants/words';

const T = new Twit({
  consumer_key: wordsConfig.consumer_key,
  consumer_secret: wordsConfig.consumer_secret,
  access_token: wordsConfig.access_token,
  access_token_secret: wordsConfig.access_token_secret,
});

export default async (req: FastifyRequest, res: FastifyReply) => {
  try {
    if(req.headers.wordstk !== headers.wordstk) throw Error('Request error');

    const { yesterday } = <{yesterday: string}>req.query;
    
    if(yesterday === '1') {
      const twydResponse = await twyd(words, T, constants);
      res.status(200).type('text/html').send(twydResponse);
    } else {
      const twResponse = await tw(T, constants);
      res.status(200).send(twResponse);
    }
  } catch(error: any) {
    res.status(500).send(`Error: ${error.message} (${error.code})`);
  }
};
