import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const host = 'localhost';
const port = 8000;

const users = [
  { id: '64fd0138-4b59-4bed-ba01-f9e5cec16000', name: 'Alice' },
  { id: 'a7fdf5d3-a65e-4424-905d-4c7f77d535bd', name: 'Bob' },
];

const app = new Hono();

app.get('/', (c) => {
  return c.text('Bonjour depuis Hono !');
});

app.get('/users', (c) => {
  return c.json(users);
});

app.get('/hello', (c) => {
  const name = c.req.query('name') ?? 'inconnu';
  return c.json({ message: `Bonjour ${name} !` });
});

app.get('/users/:id', (c) => {
  const id = c.req.param('id');
  const user = users.find((u) => u.id === id);

  if (!user) {
    return c.json({ error: 'Utilisateur introuvable' }, 404);
  }

  return c.json(user);
});

app.post('/users', async (c) => {
  const body = await c.req.json();

  const user = {
    id: crypto.randomUUID(),
    name: body.name,
  };

  users.push(user);
  return c.json(user, 201);
});

serve({
  fetch: app.fetch,
  hostname: host,
  port: port,
}, () => {
  console.log(`Serveur démarré sur http://${host}:${port}`);
});
