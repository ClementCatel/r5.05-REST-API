import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const helloSchema = z.object({
  name: z.string().max(20).optional(),
});

const app = new Hono();

app.get('/', zValidator('query', helloSchema), (c) => {
  const name = c.req.valid('query').name ?? 'inconnu';
  return c.json({ message: `Bonjour ${name} !` });
});

export default app;
