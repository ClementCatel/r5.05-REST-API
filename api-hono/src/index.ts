import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import usersRouter from './routes/users.js';
import helloRouter from './routes/hello.js';
import { requestId } from './middlewares/request-id.js';
import { errorLogger } from './middlewares/error-logger.js';

const host = 'localhost';
const port = 8000;

const app = new Hono();

app.use(logger());
app.use(requestId);
app.use(errorLogger);

app.get('/', (c) => {
  return c.text('Bonjour depuis Hono !');
});

app.route('/users', usersRouter);
app.route('/hello', helloRouter);

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
