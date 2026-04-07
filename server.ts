// Local development API server — mirrors the /api Vercel functions
// Run via: tsx server.ts (started automatically by npm run dev)

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { neon } from '@neondatabase/serverless';

// Load .env.local
const envFile = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key && !process.env[key]) process.env[key] = val;
  }
}

function db() {
  const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error('No database connection string (POSTGRES_URL or DATABASE_URL)');
  return neon(url);
}

function send(res: http.ServerResponse, status: number, body: unknown) {
  const json = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(json);
}

async function readBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve({}); } });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url!, `http://localhost`);
  const method = req.method ?? 'GET';

  // CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE', 'Access-Control-Allow-Headers': 'Content-Type' });
    res.end();
    return;
  }

  try {
    // GET /api/setup
    if (url.pathname === '/api/setup' && method === 'GET') {
      const sql = db();
      await sql`CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, data JSONB NOT NULL)`;
      return send(res, 200, { ok: true, message: 'Database initialized' });
    }

    // GET|POST /api/projects
    if (url.pathname === '/api/projects') {
      const sql = db();
      if (method === 'GET') {
        const rows = await sql`SELECT data FROM projects ORDER BY (data->>'createdAt') DESC`;
        return send(res, 200, rows.map((r: Record<string, unknown>) => r.data));
      }
      if (method === 'POST') {
        const project = await readBody(req) as { id: string };
        await sql`INSERT INTO projects (id, data) VALUES (${project.id}, ${JSON.stringify(project)}::jsonb)`;
        return send(res, 201, project);
      }
    }

    // PUT|DELETE /api/projects/:id
    const match = url.pathname.match(/^\/api\/projects\/([^/]+)$/);
    if (match) {
      const id = match[1];
      const sql = db();
      if (method === 'PUT') {
        const project = await readBody(req);
        await sql`
          INSERT INTO projects (id, data) VALUES (${id}, ${JSON.stringify(project)}::jsonb)
          ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
        `;
        return send(res, 200, project);
      }
      if (method === 'DELETE') {
        await sql`DELETE FROM projects WHERE id = ${id}`;
        res.writeHead(204);
        res.end();
        return;
      }
    }

    send(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error(err);
    send(res, 500, { error: String(err) });
  }
});

const PORT = 4000;
server.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
