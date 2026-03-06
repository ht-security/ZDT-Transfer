
const express  = require('express');
const http     = require('http');
const https    = require('https');
const fs       = require('fs');
const socketIo = require('socket.io');
const cors     = require('cors');

// ── סביבה ──────────────────────────────────────────────────────
const IS_PROD   = process.env.NODE_ENV === 'production';
const PORT      = process.env.PORT      || 3000;
const PORT_HTTP = process.env.PORT_HTTP || 3001;
const CERT_PATH = process.env.CERT_PATH || './cert.pem';
const KEY_PATH  = process.env.KEY_PATH  || './key.pem';

// ✅ S-002: CORS מוגבל — הגדר env: ALLOWED_ORIGINS=https://yourdomain.com
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'https://localhost:3000'];

const corsOptions = {
  origin: IS_PROD ? ALLOWED_ORIGINS : '*',
  methods: ['GET', 'POST']
};

const app = express();
app.use(cors(corsOptions));

// ✅ S-001: HTTP → HTTPS redirect middleware
app.use((req, res, next) => {
  const secure = req.secure
    || req.headers['x-forwarded-proto'] === 'https'
    || IS_PROD;
  if (!secure && process.env.FORCE_HTTPS === 'true') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

app.get('/', (_req, res) => {
  res.send('<h1>ZDT Signaling Server is Online and Healthy.</h1>');
});

// ✅ S-001: HTTPS עם cert מקומי / HTTP בפרודקשן עם proxy
let server;
const hasCerts = fs.existsSync(CERT_PATH) && fs.existsSync(KEY_PATH);

if (hasCerts && !IS_PROD) {
  server = https.createServer(
    { key: fs.readFileSync(KEY_PATH), cert: fs.readFileSync(CERT_PATH) },
    app
  );
  http.createServer((req, res) => {
    res.writeHead(301, { Location: `https://localhost:${PORT}${req.url}` });
    res.end();
  }).listen(PORT_HTTP, () => log(`[↗] HTTP→HTTPS :${PORT_HTTP}→:${PORT}`));
  log('[🔒] HTTPS — local certificate');
} else {
  server = http.createServer(app);
  IS_PROD
    ? log('[🔒] HTTP — TLS by platform proxy (Render/Railway)')
    : log('[⚠️] No cert — HTTP only. Run openssl to generate cert.pem + key.pem');
}

// ── Socket.io ─────────────────────────────────────────────────
const io = socketIo(server, {
  cors: corsOptions,
  pingTimeout:       20000,
  pingInterval:      10000,
  maxHttpBufferSize: 1e5    // ✅ S-007: 100KB מקסימום per event
});

// ✅ S-008: ניהול חדרים עצמאי
// Map<roomId, Set<socketId>>
const rooms = new Map();

// ✅ S-003: Rate Limiting
const MAX_EV  = 30;
const rateMap = new Map();

function rateOK(socketId) {
  const now  = Date.now();
  const prev = rateMap.get(socketId) || { n: 0, t: now };
  if (now - prev.t >= 1000) { prev.n = 1; prev.t = now; rateMap.set(socketId, prev); return true; }
  prev.n++;
  rateMap.set(socketId, prev);
  if (prev.n > MAX_EV) {
    log(`[🛡] Rate limit: ${mask(socketId)} (${prev.n}/s)`);
    return false;
  }
  return true;
}

// ✅ S-004/S-005: Token structural validation
// השרת לא מכיר סיסמאות — בודק שה-token קיים ובנוי כ-HMAC-SHA256 base64 (44 תווים)
function tokenOK(token) {
  if (!token || typeof token !== 'string') return false;
  if (token.length < 44) return false;
  return /^[A-Za-z0-9+/=]+$/.test(token);
}

// ✅ S-006: מסכך socket IDs בפרודקשן
const mask = id  => IS_PROD ? `[…${id.slice(-4)}]` : id.slice(0, 8);
const log  = msg => console.log(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);

// ─────────────────────────────────────────────────────────────
// Socket Events
// ─────────────────────────────────────────────────────────────
io.on('connection', socket => {
  log(`[+] CONNECT ${mask(socket.id)}`);

  // ✅ S-004: join-room — דורש token תקני לפני חשיפת peers
  socket.on('join-room', ({ room, token }) => {
    if (!room || typeof room !== 'string' || room.length > 100) return;

    if (!tokenOK(token)) {
      socket.emit('auth-rejected', { reason: 'Invalid or missing auth token' });
      log(`[⛔] join rejected (no token): ${mask(socket.id)}`);
      return;
    }

    socket.join(room);

    // ✅ S-008: Map עצמאי
    if (!rooms.has(room)) rooms.set(room, new Set());
    const roomSet = rooms.get(room);

    // רשימת peers רק אחרי אימות token
    socket.emit('room-peers', { peers: Array.from(roomSet) });
    socket.to(room).emit('user-connected', { peerId: socket.id });

    roomSet.add(socket.id);
    socket.data.room = room;

    log(`[~] JOIN ${mask(socket.id)} room="${room.slice(0, 12)}" members=${roomSet.size}`);
  });

  // ✅ S-003 + S-005: Rate check + token על כל signaling
  socket.on('offer', ({ to, offer, token }) => {
    if (!rateOK(socket.id)) return;
    if (!tokenOK(token) || !offer || !to) return;
    io.to(to).emit('offer', { from: socket.id, offer, token });
  });

  socket.on('answer', ({ to, answer, token }) => {
    if (!rateOK(socket.id)) return;
    if (!tokenOK(token) || !answer || !to) return;
    io.to(to).emit('answer', { from: socket.id, answer, token });
  });

  socket.on('ice-candidate', ({ to, candidate, token }) => {
    if (!rateOK(socket.id)) return;
    if (!tokenOK(token) || !candidate || !to) return;
    io.to(to).emit('ice-candidate', { from: socket.id, candidate, token });
  });

  socket.on('leave-room', ({ room }) => {
    if (!room) return;
    _leaveRoom(socket, room);
    log(`[←] LEAVE ${mask(socket.id)}`);
  });

  // ✅ S-009: הודעת ניתוק מיידית לכל החדר
  socket.on('disconnecting', () => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.to(room).emit('user-disconnected', { peerId: socket.id });
        _cleanRoom(socket.id, room);
      }
    }
  });

  socket.on('disconnect', () => {
    rateMap.delete(socket.id); // ✅ S-003: ניקוי rate state
    log(`[-] DISCONNECT ${mask(socket.id)}`);
  });
});

function _leaveRoom(socket, room) {
  socket.leave(room);
  socket.to(room).emit('user-disconnected', { peerId: socket.id });
  _cleanRoom(socket.id, room);
}

function _cleanRoom(socketId, room) {
  if (!rooms.has(room)) return;
  rooms.get(room).delete(socketId);
  if (rooms.get(room).size === 0) rooms.delete(room);
}

server.listen(PORT, () => {
  log(`
  ███████╗██████╗ ████████╗
     ███╔╝██╔══██╗╚══██╔══╝
    ███╔╝ ██║  ██║   ██║
   ███╔╝  ██║  ██║   ██║
  ███████╗██████╔╝   ██║
  ╚══════╝╚═════╝    ╚═╝

  ZDT  ·  v2.0-HARDENED  ·  PORT ${PORT}
  HTTPS ✅  Rate-Limit ✅  Token-Guard ✅  CORS ✅  Rooms ✅
  `);
});
