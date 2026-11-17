import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

const users = [
  { id: '64fd0138-4b59-4bed-ba01-f9e5cec16000', name: 'Alice' },
  { id: 'a7fdf5d3-a65e-4424-905d-4c7f77d535bd', name: 'Bob' },
];

const app = new Hono();

app.get('/', (c) => {
  return c.json(users);
});

app.get('/:id', (c) => {
  const id = c.req.param('id');
  const user = users.find((u) => u.id === id);

  if (!user) {
    throw new HTTPException(404, { message: 'Utilisateur introuvable' });
  }

  return c.json(user);
});

app.post('/', async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch {
    throw new HTTPException(400, { message: 'Le corps de la requête doit être un JSON valide' });
  }

  const user = {
    id: crypto.randomUUID(),
    name: body.name,
  };

  users.push(user);
  return c.json(user, 201);
});

app.put('/:id', async (c) => {
  const id = c.req.param('id');
  const user = users.find((u) => u.id === id);

  if (!user) {
    throw new HTTPException(404, { message: 'Utilisateur introuvable' });
  }

  const body = await c.req.json();
  user.name = body.name;

  return c.json(user);
});

app.delete('/:id', (c) => {
  const id = c.req.param('id');
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    throw new HTTPException(404, { message: 'Utilisateur introuvable' });
  }

  users.splice(index, 1);
  return c.body(null, 204);
});

export default app;
