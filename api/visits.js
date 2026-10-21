const { kv } = require('@vercel/kv');

const KEY = 'visits:foxguardian';
const BOT = /bot|crawl|spider|slurp|lighthouse|headless|preview|facebookexternalhit|curl|wget/i;

// POST conta a visita (1x por sessão, feito pelo front); GET só lê o valor.
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const isBot = BOT.test(req.headers['user-agent'] || '');
    const value = req.method === 'POST' && !isBot ? await kv.incr(KEY) : Number((await kv.get(KEY)) || 0);
    return res.status(200).json({ value });
  } catch (err) {
    console.error('visits api error:', err && err.message);
    return res.status(500).json({ error: 'counter unavailable' });
  }
};
