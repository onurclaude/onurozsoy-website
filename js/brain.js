(function () {
  const canvas = document.getElementById("brain");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Left-to-right spectrum along the brain (front -> back).
  const STOPS = [
    [255, 184, 41],  // saffron
    [236, 72, 153],  // magenta
    [128, 82, 255],  // iris
    [59, 130, 246],  // blue
    [21, 200, 164],  // teal
  ];

  function spectrum(t) {
    t = Math.min(0.9999, Math.max(0, t)) * (STOPS.length - 1);
    const i = Math.floor(t), f = t - i;
    const a = STOPS[i], b = STOPS[i + 1];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  }

  // Mini site designs. Each draws inside a unit box (w x h centred on 0,0) and
  // returns nothing; `aspect` is width / height. Coordinates are in [-.5, .5].
  function rr(c, x, y, w, h, r) {
    if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h);
  }
  const TEMPLATES = [
    { aspect: 1.5, draw(c, w, h) { // landing page
      rr(c, -w / 2, -h / 2, w, h, 2);
      c.moveTo(-w / 2, -h * 0.34); c.lineTo(w / 2, -h * 0.34);
      c.rect(-w * 0.42, -h * 0.44, w * 0.1, h * 0.07);
      c.rect(w * 0.22, -h * 0.43, w * 0.2, h * 0.05);
      c.rect(-w * 0.4, -h * 0.2, w * 0.5, h * 0.09);
      c.rect(-w * 0.4, -h * 0.05, w * 0.34, h * 0.05);
      for (let i = 0; i < 3; i++) c.rect(-w * 0.42 + i * w * 0.29, h * 0.12, w * 0.26, h * 0.3);
      return [-w * 0.4, -h * 0.2, w * 0.5, h * 0.09];
    } },
    { aspect: 0.55, draw(c, w, h) { // mobile menu
      rr(c, -w / 2, -h / 2, w, h, 4);
      c.moveTo(-w * 0.14, -h * 0.45); c.lineTo(w * 0.14, -h * 0.45);
      c.rect(-w * 0.4, -h * 0.36, w * 0.8, h * 0.16);
      for (let i = 0; i < 3; i++) {
        const y = -h * 0.1 + i * h * 0.22;
        c.rect(-w * 0.4, y, w * 0.22, h * 0.14);
        c.moveTo(-w * 0.1, y + h * 0.03); c.lineTo(w * 0.3, y + h * 0.03);
        c.moveTo(-w * 0.1, y + h * 0.1); c.lineTo(w * 0.1, y + h * 0.1);
      }
      return [-w * 0.4, -h * 0.36, w * 0.8, h * 0.16];
    } },
    { aspect: 1.6, draw(c, w, h) { // NFC / review card
      rr(c, -w / 2, -h / 2, w, h, 5);
      c.moveTo(w * 0.36 + w * 0.07, -h * 0.28);
      c.arc(w * 0.36, -h * 0.28, w * 0.07, 0, 6.283);
      c.moveTo(w * 0.36 + w * 0.13, -h * 0.28);
      c.arc(w * 0.36, -h * 0.28, w * 0.13, 0, 6.283);
      c.moveTo(-w * 0.4, h * 0.05); c.lineTo(w * 0.1, h * 0.05);
      for (let i = 0; i < 5; i++) c.rect(-w * 0.4 + i * w * 0.07, h * 0.22, w * 0.05, w * 0.05);
      return [-w * 0.4, -h * 0.4, w * 0.2, h * 0.18];
    } },
    { aspect: 1.4, draw(c, w, h) { // dashboard
      rr(c, -w / 2, -h / 2, w, h, 2);
      c.moveTo(-w * 0.26, -h / 2); c.lineTo(-w * 0.26, h / 2);
      c.moveTo(-w * 0.26, -h * 0.34); c.lineTo(w / 2, -h * 0.34);
      for (let i = 0; i < 4; i++) {
        const bh = h * (0.18 + 0.12 * ((i * 7) % 4));
        c.rect(-w * 0.1 + i * w * 0.14, h * 0.42 - bh, w * 0.09, bh);
      }
      for (let i = 0; i < 4; i++) c.rect(-w * 0.42, -h * 0.24 + i * h * 0.14, w * 0.12, h * 0.05);
      return [-w * 0.1, h * 0.42 - h * 0.42, w * 0.09, h * 0.42];
    } },
    { aspect: 1.15, draw(c, w, h) { // blog / portfolio
      rr(c, -w / 2, -h / 2, w, h, 3);
      c.rect(-w * 0.42, -h * 0.42, w * 0.84, h * 0.4);
      c.moveTo(-w * 0.42, h * 0.1); c.lineTo(w * 0.3, h * 0.1);
      c.moveTo(-w * 0.42, h * 0.24); c.lineTo(w * 0.42, h * 0.24);
      c.moveTo(-w * 0.42, h * 0.36); c.lineTo(w * 0.1, h * 0.36);
      return [-w * 0.42, -h * 0.42, w * 0.84, h * 0.4];
    } },
    { aspect: 1.5, draw(c, w, h) { // browser window
      rr(c, -w / 2, -h / 2, w, h, 3);
      c.moveTo(-w / 2, -h * 0.34); c.lineTo(w / 2, -h * 0.34);
      for (let i = 0; i < 3; i++) { c.moveTo(-w * 0.4 + i * w * 0.07 + w * 0.02, -h * 0.42); c.arc(-w * 0.4 + i * w * 0.07, -h * 0.42, w * 0.02, 0, 6.283); }
      c.rect(-w * 0.1, -h * 0.46, w * 0.5, h * 0.09);
      c.rect(-w * 0.4, -h * 0.2, w * 0.8, h * 0.55);
      return [-w * 0.4, -h * 0.2, w * 0.8, h * 0.55];
    } },
  ];

  // Brain-shaped density: cerebrum ellipsoid + cerebellum + brainstem, wrinkled surface, central fissure.
  function brainValue(x, y, z) {
    const cerebrum = Math.sqrt(Math.pow(x / 1.3, 2) + Math.pow((y - 0.1) / 0.85, 2) + Math.pow(z / 0.82, 2));
    const cerebellum = Math.sqrt(Math.pow((x + 0.78) / 0.52, 2) + Math.pow((y + 0.55) / 0.32, 2) + Math.pow(z / 0.5, 2));
    const stemR = Math.sqrt(Math.pow(z, 2) + Math.pow(x + 0.3 + (y + 0.6) * 0.25, 2));
    const stem = y < -0.35 && y > -1.0 ? stemR / 0.14 : 9;
    return Math.min(cerebrum, cerebellum, stem);
  }

  function buildPoints(count) {
    const pts = [];
    let guard = 0;
    while (pts.length < count && guard++ < count * 600) {
      const x = (Math.random() * 2 - 1) * 1.4;
      const y = (Math.random() * 2 - 1) * 1.05;
      const z = (Math.random() * 2 - 1) * 0.9;
      const v = brainValue(x, y, z);
      if (v > 1) continue;
      const gyri = 0.05 * Math.sin(8 * x + 3 * y) * Math.sin(7 * z + 2 * x) + 0.03 * Math.sin(13 * y + 5 * z);
      if (v < 0.78 + gyri && Math.random() > 0.05) continue;
      if (y > 0.05 && Math.abs(z) < 0.06 && x > -0.9) continue;
      // keep cards from piling up on top of each other
      let ok = true;
      for (let i = 0; i < pts.length; i++) {
        const q = pts[i];
        const d2 = (q.x - x) * (q.x - x) + (q.y - y) * (q.y - y) + (q.z - z) * (q.z - z);
        if (d2 < 0.012) { ok = false; break; }
      }
      if (!ok) continue;
      const hueT = (x + 1.4) / 2.8 + (Math.random() - 0.5) * 0.1;
      const len = Math.hypot(x, y, z) || 1;
      const dist = 0.7 + Math.random() * 0.9;
      pts.push({
        x, y, z,
        tpl: Math.floor(Math.random() * TEMPLATES.length),
        size: 15 + Math.random() * 11,
        tilt: (Math.random() - 0.5) * 0.5,
        spin: (Math.random() - 0.5) * 0.5,
        rgb: spectrum(hueT),
        phase: Math.random() * Math.PI * 2,
        delay: Math.random() * 0.4,
        dx: (x / len + (Math.random() - 0.5) * 0.9) * dist,
        dy: (y / len + (Math.random() - 0.5) * 0.9) * dist,
        dz: (z / len + (Math.random() - 0.5) * 0.9) * dist,
      });
    }
    return pts;
  }

  let W = 0, H = 0, dpr = 1, points = [], ambient = [], items = [];

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = W < 520 ? 150 : 260;
    if (points.length !== n) points = buildPoints(n);
    ambient = Array.from({ length: W < 520 ? 8 : 16 }, () => ({
      x: Math.random(), y: Math.random(), size: 9 + Math.random() * 8,
      tpl: Math.floor(Math.random() * TEMPLATES.length),
      rgb: spectrum(Math.random()), tilt: (Math.random() - 0.5) * 0.6,
      vx: (Math.random() - 0.5) * 0.004, vy: (Math.random() - 0.5) * 0.004,
    }));
  }

  // Interaction: drag to rotate (with inertia), click to scatter / gather.
  const view = { yaw: 0.35, pitch: -0.06, vYaw: 0, vPitch: 0 };
  const drag = { active: false, moved: 0, x: 0, y: 0, t: 0 };
  let scattered = false, spread = 0;

  canvas.style.cursor = "grab";
  canvas.style.touchAction = "pan-y";

  canvas.addEventListener("pointerdown", (e) => {
    drag.active = true; drag.moved = 0; drag.x = e.clientX; drag.y = e.clientY; drag.t = performance.now();
    view.vYaw = 0; view.vPitch = 0;
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = "grabbing";
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drag.active) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag.x = e.clientX; drag.y = e.clientY;
    drag.moved += Math.abs(dx) + Math.abs(dy);
    view.yaw += dx * 0.009;
    view.pitch = Math.max(-0.9, Math.min(0.9, view.pitch + dy * 0.007));
    view.vYaw = dx * 0.009; view.vPitch = dy * 0.007;
  });
  function endDrag() {
    if (!drag.active) return;
    drag.active = false;
    canvas.style.cursor = "grab";
    if (drag.moved < 6 && performance.now() - drag.t < 450) {
      scattered = !scattered;
      if (reduced) { spread = scattered ? 1 : 0; draw(0, 0); }
    }
  }
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  function card(tpl, cx, cy, h, rot, rgb, alpha, fillA) {
    const T = TEMPLATES[tpl];
    const w = h * T.aspect;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.beginPath();
    const accent = T.draw(ctx, w, h);
    const col = (rgb[0] | 0) + "," + (rgb[1] | 0) + "," + (rgb[2] | 0);
    ctx.lineWidth = 1;
    ctx.lineJoin = "round";
    if (fillA > 0) {
      ctx.fillStyle = "rgba(0,0,0," + fillA + ")";
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(" + col + "," + alpha + ")";
    ctx.stroke();
    ctx.fillStyle = "rgba(" + col + "," + alpha * 0.45 + ")";
    ctx.fillRect(accent[0], accent[1], accent[2], accent[3]);
    ctx.restore();
  }

  function draw(t, dt) {
    ctx.clearRect(0, 0, W, H);
    if (!reduced) {
      spread = Math.max(0, Math.min(1, spread + (scattered ? 1 : -1) * dt / 1.5));
      if (!drag.active) {
        view.yaw += view.vYaw + 0.0016 * (scattered ? 2 : 1);
        view.pitch = Math.max(-0.9, Math.min(0.9, view.pitch + view.vPitch));
        view.vYaw *= 0.95; view.vPitch *= 0.9;
        view.pitch += (-0.06 - view.pitch) * 0.01;
      }
    }

    const yaw = view.yaw, pitch = view.pitch;
    const cy_ = Math.cos(yaw), sy_ = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const scale = Math.min(W / 3.0, H / 2.5);
    const cx = W / 2, cy = H / 2 + scale * 0.05;
    const wave = (t * 0.00055) % 1.6 - 0.2;
    const breathe = 1 + (reduced ? 0 : Math.sin(t * 0.0012) * 0.012);

    for (const a of ambient) {
      if (!reduced) {
        a.x += a.vx * 0.2; a.y += a.vy * 0.2;
        if (a.x < -0.05) a.x = 1.05; if (a.x > 1.05) a.x = -0.05;
        if (a.y < -0.05) a.y = 1.05; if (a.y > 1.05) a.y = -0.05;
      }
      card(a.tpl, a.x * W, a.y * H, a.size, a.tilt, a.rgb, 0.18, 0);
    }

    items.length = 0;
    for (const p of points) {
      let k = 0;
      if (spread > 0) {
        const u = Math.max(0, Math.min(1, (spread - p.delay) / 0.6));
        k = u * u * (3 - 2 * u);
      }
      const fl = k * 0.035 * Math.sin(t * 0.0012 + p.phase);
      const x = (p.x + p.dx * k) * breathe + fl;
      const y = (p.y + p.dy * k) * breathe + fl;
      const z = (p.z + p.dz * k) * breathe;
      const x1 = x * cy_ + z * sy_;
      const z1 = -x * sy_ + z * cy_;
      const y2 = y * cp - z1 * sp;
      const z2 = y * sp + z1 * cp;
      const persp = 1 / (1 - z2 * 0.28);
      const d = Math.abs((p.x + 1.4) / 2.8 - wave);
      const pulse = d < 0.09 ? 1 + (1 - d / 0.09) * 0.45 : 1;
      items.push({
        p, z: z2, sx: cx + x1 * scale * persp, sy: cy - y2 * scale * persp,
        h: p.size * persp * pulse * (scale / 230),
        rot: p.tilt + (reduced ? 0 : Math.sin(t * 0.0006 * p.spin * 4 + p.phase) * 0.08) + k * p.spin * 2,
        a: Math.max(0.25, Math.min(1, 0.45 + (z2 + 1) * 0.35)) * (pulse > 1.2 ? 1 : 0.9),
      });
    }
    items.sort((a, b) => a.z - b.z);
    for (const it of items) card(it.p.tpl, it.sx, it.sy, it.h, it.rot, it.p.rgb, it.a, 0.72);
  }

  let visible = true, raf = 0, last = 0;
  function loop(t) {
    const dt = Math.min(0.05, (t - last) / 1000 || 0);
    last = t;
    if (visible) draw(t, dt);
    raf = requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener("resize", () => { resize(); if (reduced) draw(0, 0); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(canvas);
  }
  if (reduced) draw(0, 0); else raf = requestAnimationFrame(loop);
})();
