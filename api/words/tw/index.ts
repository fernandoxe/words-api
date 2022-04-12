import type { VercelRequest, VercelResponse } from '@vercel/node';
import Twit from 'twit';
import { words } from '../../../data/words';
import { words as wordsConfig, headers } from '../../../.config';
import { tw, twyd } from '../../../src/services/tw';
import * as constants from '../../../src/constants/words';

const T = new Twit({
  consumer_key: wordsConfig.consumer_key,
  consumer_secret: wordsConfig.consumer_secret,
  access_token: wordsConfig.access_token,
  access_token_secret: wordsConfig.access_token_secret,
});

module.exports = async (req: VercelRequest, res: VercelResponse) => {
  try {
    if(req.headers.wordstk !== headers.wordstk) throw Error('Request error');

    if(req.query.yd === '1') {
      const twydResponse = await twyd(words, T, constants);
      res.status(200).send(twydResponse);
    } else {
      const twResponse = await tw(T, constants);
      res.status(200).send(twResponse);
    }
  } catch(error) {
    res.status(500).send(`Error: ${error.message} (${error.code})`);
  }
};
