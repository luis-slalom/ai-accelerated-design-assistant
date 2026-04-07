import { neon } from '@neondatabase/serverless';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
    if (!url) {
      return res.status(500).json({ error: 'No database connection string found (POSTGRES_URL or DATABASE_URL)' });
    }
    const sql = neon(url);
    await sql`CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, data JSONB NOT NULL)`;
    return res.status(200).json({ ok: true, message: 'Database initialized' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
}
