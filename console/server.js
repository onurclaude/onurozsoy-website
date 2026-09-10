const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');

const ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'images');
const INDEX_HTML = path.join(ROOT, 'index.html');

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

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(IMAGES_DIR));

function currentFileForSlot(base) {
  const exts = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
  for (const ext of exts) {
    const p = path.join(IMAGES_DIR, `${base}.${ext}`);
    if (fs.existsSync(p)) return `${base}.${ext}`;
  }
  return null;
}

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

const PORT = process.env.PORT || 4173;
app.listen(PORT, () => {
  console.log(`Görsel yükleme konsolu çalışıyor: http://localhost:${PORT}`);
});
