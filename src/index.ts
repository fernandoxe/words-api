import Fastify from 'fastify';
import cors from 'fastify-cors';
import date from './api/date';
import words from './api/words';
import wordsTweet from './api/words/tweet';

const PORT = process.env.PORT || 5000;

const fastify = Fastify({logger: true});

fastify.register(cors, {
  origin: [
    '*',
  ],
  methods: [
    'GET',
  ],
});

fastify.get('/date', date);

fastify.get('/words', words);
fastify.get('/words/tweet', wordsTweet);

fastify.get('*', (_req, res) => {
  res.status(404).send('404 not found');
});

fastify.listen(PORT, (err, address) => {
  if(err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
