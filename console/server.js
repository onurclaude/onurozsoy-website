const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');

const ROOT = path.join(__dirname, '..');
const VISITS_FILE = process.env.VISITS_FILE || '/data/visits/summary.json';
const IMAGES_DIR = process.env.IMAGES_DIR ? path.resolve(process.env.IMAGES_DIR) : path.join(ROOT, 'images');
const INDEX_HTML = process.env.INDEX_HTML ? path.resolve(process.env.INDEX_HTML) : path.join(ROOT, 'index.html');

fs.mkdirSync(IMAGES_DIR, { recursive: true });

const SLOTS = [
  { id: 'oz-portrait', base: 'portrait', label: 'Portre Fotoğrafı' },
  { id: 'oz-pj-portofis', base: 'project-portofis', label: 'Port Ofis Proje Görseli' },
  { id: 'oz-pj-menu', base: 'project-menu', label: 'Dijital Menü Ekran Görüntüsü' },
  { id: 'oz-pj-nfc', base: 'project-nfc', label: 'NFC / QR Ürün Fotoğrafı' },
  { id: 'oz-menu-phone', base: 'menu-phone', label: 'Menü Telefon Görseli' },
];

const EXT_BY_MIME = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (EXT_BY_MIME[file.mimetype]) cb(null, true);
    else cb(new Error('Desteklenmeyen dosya türü: ' + file.mimetype));
  },
});

const ADMIN_USER = process.env.ADMIN_USER || 'onur';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  console.error('ADMIN_PASSWORD ortam değişkeni tanımlı değil. console/.env dosyasını kontrol edin.');
  process.exit(1);
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme === 'Basic' && encoded) {
    const [user, pass] = Buffer.from(encoded, 'base64').toString('utf8').split(':');
    if (user === ADMIN_USER && pass === ADMIN_PASSWORD) return next();
  }
  res.set('WWW-Authenticate', 'Basic realm="Onur Ozsoy Console"');
  res.status(401).send('Yetkilendirme gerekli.');
}

const app = express();
app.set('trust proxy', 1); // behind the nginx container; req.ip is the visitor
app.use('/images', express.static(IMAGES_DIR));
app.use('/console/admin', requireAuth, express.static(path.join(__dirname, 'public')));
app.use('/api', requireAuth);
app.get('/', (req, res) => res.redirect('/console/admin'));

function currentFileForSlot(base) {
  const exts = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
  for (const ext of exts) {
    const p = path.join(IMAGES_DIR, `${base}.${ext}`);
    if (fs.existsSync(p)) return `${base}.${ext}`;
  }
  return null;
}

// Ziyaretçi istatistikleri: sunucudaki /opt/visit-stats betiğinin ürettiği özet (salt okunur bağlanır).
app.get('/api/visits', (req, res) => {
  fs.readFile(VISITS_FILE, 'utf8', (err, data) => {
    if (err) return res.status(404).json({ error: 'no_data' });
    res.type('application/json').set('Cache-Control', 'no-store').send(data);
  });
});

app.get('/api/slots', (req, res) => {
  const data = SLOTS.map((s) => {
    const file = currentFileForSlot(s.base);
    return {
      ...s,
      file,
      url: file ? `/images/${file}?t=${fs.statSync(path.join(IMAGES_DIR, file)).mtimeMs}` : null,
    };
  });
  res.json(data);
});

app.post('/api/upload/:slotId', upload.single('image'), (req, res) => {
  const slot = SLOTS.find((s) => s.id === req.params.slotId);
  if (!slot) return res.status(404).json({ error: 'Bilinmeyen slot' });
  if (!req.file) return res.status(400).json({ error: 'Dosya bulunamadı' });

  const ext = EXT_BY_MIME[req.file.mimetype];
  const newFilename = `${slot.base}.${ext}`;

  // Remove any previous file for this slot with a different extension
  for (const oldExt of Object.values(EXT_BY_MIME)) {
    if (oldExt === ext) continue;
    const oldPath = path.join(IMAGES_DIR, `${slot.base}.${oldExt}`);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  fs.writeFileSync(path.join(IMAGES_DIR, newFilename), req.file.buffer);

  updateIndexHtml(slot.id, newFilename);

  res.json({ ok: true, file: newFilename, url: `/images/${newFilename}?t=${Date.now()}` });
});

function updateIndexHtml(slotId, newFilename) {
  if (!fs.existsSync(INDEX_HTML)) return;
  let html = fs.readFileSync(INDEX_HTML, 'utf8');
  const re = new RegExp(
    `(<img id="${slotId}" src=")images/[^"]+(")`
  );
  if (re.test(html)) {
    html = html.replace(re, `$1images/${newFilename}$2`);
    fs.writeFileSync(INDEX_HTML, html, 'utf8');
  }
}

// ---- public contact form (not behind Basic Auth; nginx proxies only this path) ----
const MAIL_TO = process.env.MAIL_TO || 'onur@ozsoyonur.com';
const SMTP_READY = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
const mailer = SMTP_READY
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;
if (!SMTP_READY) {
  console.warn('SMTP_HOST / SMTP_USER / SMTP_PASS tanımlı değil: iletişim formu mail gönderemez (503 döner).');
}

const RATE_LIMIT = 5; // submissions per IP per hour
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  if (hits.size > 2000) hits.clear();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

const clean = (v, max) => String(v == null ? '' : v).replace(/\r/g, '').trim().slice(0, max);
const oneLine = (v, max) => clean(v, max).replace(/\s+/g, ' ');

app.post('/contact', express.json({ limit: '20kb' }), async (req, res) => {
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // honeypot field filled: a bot, pretend success

  const name = oneLine(b.name, 120);
  const email = oneLine(b.email, 200);
  const brief = clean(b.message || b.brief, 5000);
  const subject = oneLine(b.subject, 120);
  if (!name || !brief || !/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(email)) {
    return res.status(400).json({ error: 'invalid' });
  }
  if (rateLimited(req.ip)) return res.status(429).json({ error: 'rate_limited' });
  if (!mailer) return res.status(503).json({ error: 'not_configured' });

  const text = [
    `Ad: ${name}`,
    `E-posta: ${email}`,
    `Konu: ${subject || '—'}`,
    '',
    'Mesaj:',
    brief,
  ].join('\n');

  try {
    await mailer.sendMail({
      from: process.env.SMTP_FROM || `"ozsoyonur.com" <${process.env.SMTP_USER}>`,
      to: MAIL_TO,
      replyTo: { name: name.replace(/["<>]/g, ''), address: email },
      subject: `İletişim formu — ${subject || name}`,
      text,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Mail gönderilemedi:', err.message);
    res.status(502).json({ error: 'send_failed' });
  }
});

const PORT = process.env.PORT || 4173;
app.listen(PORT, () => {
  console.log(`Görsel yükleme konsolu çalışıyor: http://localhost:${PORT}`);
});
