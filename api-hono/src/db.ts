import { DatabaseSync } from 'node:sqlite';

export const db = new DatabaseSync('database.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL
  );

  INSERT OR IGNORE INTO users (id, name, email) VALUES
    ('64fd0138-4b59-4bed-ba01-f9e5cec16000', 'Alice', 'alice@example.com'),
    ('a7fdf5d3-a65e-4424-905d-4c7f77d535bd', 'Bob', 'bob@example.com');
`);
