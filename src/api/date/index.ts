import { FastifyReply, FastifyRequest } from 'fastify';

export default (_req: FastifyRequest, res: FastifyReply) => {
  const date = new Date();
  res.send({ date: date});
};
