import type { VercelRequest, VercelResponse } from '@vercel/node';

export default (_req: VercelRequest, res: VercelResponse) => {
  const date = new Date();
  res.json({ date: date.toLocaleString() });
};
