import { createMiddleware } from 'hono/factory';

export const errorLogger = createMiddleware(async (c, next) => {
  await next();

  if (c.res.status >= 400) {
    console.log(`Erreur dans la réponse : ${c.req.method} ${c.res.status}`);
  }
});
