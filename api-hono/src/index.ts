import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import usersRouter from './routes/users.js';
import { requestId } from './middlewares/request-id.js';

const host = 'localhost';
const port = 8000;

const app = new Hono();

app.use(logger());
app.use(requestId);

app.get('/', (c) => {
  return c.text('Bonjour depuis Hono !');
});

app.get('/hello', (c) => {
  const name = c.req.query('name') ?? 'inconnu';
  return c.json({ message: `Bonjour ${name} !` });
});

app.route('/users', usersRouter);

app.notFound((c) => {
  return c.json({ error: 'Route introuvable' }, 404);
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }

  console.error(err);
  return c.json({ error: 'Erreur interne du serveur' }, 500);
});

serve({
  fetch: app.fetch,
  hostname: host,
  port: port,
}, () => {
  console.log(`Serveur démarré sur http://${host}:${port}`);
});
