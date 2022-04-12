import type { VercelRequest, VercelResponse } from '@vercel/node';
import Twit from 'twit';
import { words } from '../../../../data/words';
import { words as wordsConfig } from '../../../../.config';
import { twyd } from '../../../../src/services/tw';
import * as constants from '../../../../src/constants/words';

const T = new Twit({
  consumer_key: wordsConfig.consumer_key,
  consumer_secret: wordsConfig.consumer_secret,
  access_token: wordsConfig.access_token,
  access_token_secret: wordsConfig.access_token_secret,
});

module.exports = async (_req: VercelRequest, res: VercelResponse) => {
  try {
    const response = await twyd(words, T, constants);
    res.status(200).send(response);
  } catch(error) {
    res.status(500).send(`Error: ${error.message} (${error.code})`);
  }
};
