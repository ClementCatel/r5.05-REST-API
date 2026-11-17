import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  const name = c.req.query('name') ?? 'inconnu';
  return c.json({ message: `Bonjour ${name} !` });
});

export default app;
