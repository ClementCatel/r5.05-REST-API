const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('Variable JWT_SECRET manquante');
}

export const JWT_SECRET = jwtSecret;
