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
  const users = db.prepare('SELECT id, name, email FROM users WHERE name LIKE ? OR email LIKE ?').all(`%${search}%`, `%${search}%`);
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

app.put('/:id', zValidator('param', idSchema), zValidator('json', userSchema), (c) => {
  const id = c.req.valid('param').id;
  const data = c.req.valid('json');

  const existingUser = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(data.email, id);

  if (existingUser) {
    throw new HTTPException(409, { message: 'Adresse e-mail déjà utilisée' });
  }

  const result = db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?').run(data.name, data.email, id);

  if (result.changes === 0) {
    throw new HTTPException(404, { message: 'Utilisateur introuvable' });
  }

  return c.json({ id: id, name: data.name, email: data.email });
});

app.delete('/:id', zValidator('param', idSchema), (c) => {
  const id = c.req.valid('param').id;
  const result = db.prepare('DELETE FROM users WHERE id = ?').run(id);

  if (result.changes === 0) {
    throw new HTTPException(404, { message: 'Utilisateur introuvable' });
  }

  return c.body(null, 204);
});

export default app;
