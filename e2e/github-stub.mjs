import http from 'http';

let currentUser = 'testuser';

const CALLBACK_BASE = 'http://localhost:3000';

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  // GET /login/oauth/authorize → redirect back to app callback
  if (req.method === 'GET' && url.pathname === '/login/oauth/authorize') {
    const state = url.searchParams.get('state') ?? '';
    const redirect = `${CALLBACK_BASE}/api/auth/callback?code=fake-code&state=${state}`;
    res.writeHead(302, { Location: redirect });
    res.end();
    return;
  }

  // POST /login/oauth/access_token → return fake access token
  if (req.method === 'POST' && url.pathname === '/login/oauth/access_token') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ access_token: 'fake-token' }));
    return;
  }

  // GET /user → return configured user
  if (req.method === 'GET' && url.pathname === '/user') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ login: currentUser }));
    return;
  }

  // POST /test/set-user → change which user to return (test control endpoint)
  if (req.method === 'POST' && url.pathname === '/test/set-user') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const { login } = JSON.parse(body);
        currentUser = login;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch {
        res.writeHead(400);
        res.end('Bad Request');
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(3001, () => {
  console.log('GitHub stub server running on http://localhost:3001');
});
