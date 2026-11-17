import { createMiddleware } from 'hono/factory';

export const requestId = createMiddleware(async (c, next) => {
  await next();
  c.header('X-Request-Id', crypto.randomUUID());
});
