import { neon } from '@neondatabase/serverless';
import type { VercelRequest, VercelResponse } from '@vercel/node';

function db() {
  const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error('No database connection string found (POSTGRES_URL or DATABASE_URL)');
  return neon(url);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const sql = db();

    if (req.method === 'GET') {
      const rows = await sql`SELECT data FROM projects ORDER BY (data->>'createdAt') DESC`;
      return res.status(200).json(rows.map(r => r.data));
    }

    if (req.method === 'POST') {
      const project = req.body;
      const data = JSON.stringify(project);
      await sql`INSERT INTO projects (id, data) VALUES (${project.id}, ${data}::jsonb)`;
      return res.status(201).json(project);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
}
