import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { db } from '../db.js';

const userSchema = z.object({
  name: z.string().trim().min(1).max(50),
  email: z.email(),
});

const idSchema = z.object({
  id: z.uuid(),
});

const searchSchema = z.object({
  search: z.string().max(100).optional(),
});

const app = new Hono();

app.get('/', zValidator('query', searchSchema), (c) => {
  const search = c.req.valid('query').search ?? '';
  const users = db.prepare('SELECT id, name, email FROM users WHERE name LIKE ?').all(`%${search}%`);
  return c.json(users);
});

app.get('/:id', zValidator('param', idSchema), (c) => {
  const id = c.req.valid('param').id;
  const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(id);

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

  db.prepare('INSERT INTO users (id, name, email) VALUES (?, ?, ?)').run(user.id, user.name, user.email);
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
