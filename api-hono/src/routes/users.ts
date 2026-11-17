import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const users = [
  { id: '64fd0138-4b59-4bed-ba01-f9e5cec16000', name: 'Alice', email: 'alice@example.com' },
  { id: 'a7fdf5d3-a65e-4424-905d-4c7f77d535bd', name: 'Bob', email: 'bob@example.com' },
];

const userSchema = z.object({
  name: z.string().trim().min(1).max(50),
  email: z.email(),
});

const idSchema = z.object({
  id: z.uuid(),
});

const app = new Hono();

app.get('/', (c) => {
  return c.json(users);
});

app.get('/:id', zValidator('param', idSchema), (c) => {
  const id = c.req.valid('param').id;
  const user = users.find((u) => u.id === id);

  if (!user) {
    throw new HTTPException(404, { message: 'Utilisateur introuvable' });
  }

  return c.json(user);
});

app.post('/', zValidator('json', userSchema), (c) => {
  const data = c.req.valid('json');

  const user = {
    id: crypto.randomUUID(),
    name: data.name,
    email: data.email,
  };

  users.push(user);
  return c.json(user, 201);
});

app.put('/:id', zValidator('param', idSchema), zValidator('json', userSchema), (c) => {
  const id = c.req.valid('param').id;
  const data = c.req.valid('json');
  const user = users.find((u) => u.id === id);

  if (!user) {
    throw new HTTPException(404, { message: 'Utilisateur introuvable' });
  }

  user.name = data.name;
  user.email = data.email;
  return c.json(user);
});

app.delete('/:id', zValidator('param', idSchema), (c) => {
  const id = c.req.valid('param').id;
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    throw new HTTPException(404, { message: 'Utilisateur introuvable' });
  }

  users.splice(index, 1);
  return c.body(null, 204);
});

export default app;
