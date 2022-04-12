import type { VercelRequest, VercelResponse } from '@vercel/node';
import Twit from 'twit';
import { words as wordsConfig, headers } from '../../../.config';
import { tw } from '../../../src/services/tw';
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
    const response = await tw(T, constants);
    res.status(200).json(response);
  } catch(error) {
    res.status(500).send(`Error: ${error.message} (${error.code})`);
  }
};