import { Pool } from 'pg';

export const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/orders',
});

export const query = (text: string, params?: any[]) => db.query(text, params);
