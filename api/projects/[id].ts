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
    const id = req.query.id as string;

    if (req.method === 'PUT') {
      const project = req.body;
      const data = JSON.stringify(project);
      await sql`
        INSERT INTO projects (id, data) VALUES (${id}, ${data}::jsonb)
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
      `;
      return res.status(200).json(project);
    }

    if (req.method === 'DELETE') {
      await sql`DELETE FROM projects WHERE id = ${id}`;
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
}
