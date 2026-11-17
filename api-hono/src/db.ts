import { DatabaseSync } from 'node:sqlite';

export const db = new DatabaseSync('database.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  );

  INSERT OR IGNORE INTO users (id, name, email, password_hash) VALUES
    ('64fd0138-4b59-4bed-ba01-f9e5cec16000', 'Alice', 'alice@example.com', '$2b$10$sktm2zHiXQZ9ovucX31gH.bFB/lSD/URmwE0WhaR8ZCpfJ7T2DCqq'),
    ('a7fdf5d3-a65e-4424-905d-4c7f77d535bd', 'Bob', 'bob@example.com', '$2b$10$z5oyErehRyzEH/MNc.EodecxnL9trK6gMF4hToM/cCPXY4sMXOeyW');
`);
