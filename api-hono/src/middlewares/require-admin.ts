import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

export const requireAdmin = createMiddleware(async (c, next) => {
  const payload = c.get('jwtPayload') as { role: string };

  if (payload.role !== 'admin') {
    throw new HTTPException(403, { message: 'Action non autorisée' });
  }

  await next();
});
