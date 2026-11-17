import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { HTTPException } from 'hono/http-exception';

const registerSchema = z.object({
  name: z.string().trim().min(1).max(50),
  email: z.email(),
  password: z.string().min(8).max(72),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

const passwordSchema = z.object({
  email: z.email(),
  currentPassword: z.string(),
  newPassword: z.string().min(8).max(72),
});

const app = new Hono();

app.post('/register', zValidator('json', registerSchema), async (c) => {
  const data = c.req.valid('json');

  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(data.email);

  if (existingUser) {
    throw new HTTPException(409, { message: 'Adresse e-mail déjà utilisée' });
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = {
    id: crypto.randomUUID(),
    name: data.name,
    email: data.email,
  };

  db.prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)').run(user.id, user.name, user.email, passwordHash);

  return c.json(user, 201);
});

app.post('/login', zValidator('json', loginSchema), async (c) => {
  const data = c.req.valid('json');

  const user = db.prepare('SELECT id, name, email, password_hash FROM users WHERE email = ?').get(data.email) as { id: string; name: string; email: string; password_hash: string } | undefined;

  if (!user || !(await bcrypt.compare(data.password, user.password_hash))) {
    throw new HTTPException(401, { message: 'Adresse e-mail ou mot de passe incorrect' });
  }

  return c.json({ id: user.id, name: user.name, email: user.email });
});

app.put('/password', zValidator('json', passwordSchema), async (c) => {
  const data = c.req.valid('json');

  const user = db.prepare('SELECT id, password_hash FROM users WHERE email = ?').get(data.email) as { id: string; password_hash: string } | undefined;

  if (!user || !(await bcrypt.compare(data.currentPassword, user.password_hash))) {
    throw new HTTPException(401, { message: 'Adresse e-mail ou mot de passe incorrect' });
  }

  const passwordHash = await bcrypt.hash(data.newPassword, 10);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, user.id);

  return c.body(null, 204);
});

export default app;
