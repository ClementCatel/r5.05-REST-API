import { jwt } from 'hono/jwt';
import { JWT_SECRET } from '../config.js';

export const requireAuth = jwt({ secret: JWT_SECRET, alg: 'HS256' });
