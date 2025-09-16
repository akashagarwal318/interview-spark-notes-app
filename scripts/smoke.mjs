// Minimal backend smoke test: health -> login -> list questions -> create question -> stats
// Runs without external deps (requires Node 18+ for global fetch)

const portsToTry = [5000, 5001, 5002, 5003];
const baseCandidates = portsToTry.map(p => `http://localhost:${p}/api`);

async function tryHealth(url) {
  try {
    const res = await fetch(`${url}/health`, { method: 'GET' });
    if (!res.ok) return false;
    const j = await res.json().catch(() => ({}));
    return j && (j.status === 'success');
  } catch {
    return false;
  }
}

async function pickBaseUrl() {
  for (const u of baseCandidates) {
    if (await tryHealth(u)) return u;
  }
  throw new Error('Backend API not reachable on 5000-5003. Please start backend.');
}

async function request(url, { method = 'GET', token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text; }
  if (!res.ok) {
    const msg = (json && json.message) || text || `HTTP ${res.status}`;
    throw new Error(`${method} ${url} -> ${res.status} ${msg}`);
  }
  return json;
}

function randSuffix() {
  return Math.random().toString(36).slice(2, 7);
}

async function main() {
  if (typeof fetch !== 'function') {
    console.error('This script requires Node 18+ for global fetch.');
    process.exit(1);
  }
  const base = await pickBaseUrl();
  console.log(`API: ${base}`);

  // 1) Login as default admin (created on server start if not present)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const candidatePasswords = [process.env.ADMIN_PASSWORD, 'admin123', 'change-me-now'].filter(Boolean);
  let login;
  let tokenVal;
  for (const pw of candidatePasswords) {
    try {
      const res = await request(`${base}/auth/login`, {
        method: 'POST',
        body: { email: adminEmail, password: pw }
      });
      login = res;
  tokenVal = login?.data?.token;
  if (tokenVal) break;
    } catch (e) {
      // try next password
    }
  }
  if (!tokenVal) throw new Error('No token returned from /auth/login (tried multiple default passwords)');
  const token = login?.data?.token;
  if (!token) throw new Error('No token returned from /auth/login');
  console.log('Login: OK');

  // 2) Get questions
  await request(`${base}/questions?page=1&limit=5`, { token: tokenVal });
  console.log('GET /questions: OK');

  // 3) Create a question
  const payload = {
    round: 'smoke-test',
    question: `Smoke question ${randSuffix()}`,
    answer: 'This is a smoke test answer with more than ten characters.',
    tags: ['smoke', 'test'],
    difficulty: 'easy'
  };
  const created = await request(`${base}/questions`, { method: 'POST', token: tokenVal, body: payload });
  const qId = created?.data?.question?._id;
  if (!qId) throw new Error('Question create failed: no _id');
  console.log('POST /questions: OK');

  // 4) Stats
  await request(`${base}/stats`, { token: tokenVal });
  console.log('GET /stats: OK');

  console.log('Smoke test: PASS');
}

main().catch((e) => {
  console.error('Smoke test: FAIL');
  console.error(e.message || e);
  process.exit(1);
});
