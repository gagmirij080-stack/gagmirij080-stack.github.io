import React, { useEffect, useRef, useState } from "react";

const BRAND = "STUDIO";
const PALETTE = ["#22d3ee", "#a78bfa", "#f472b6", "#60a5fa"];
const FONT = '900 %spx Unbounded, Inter, sans-serif';

function fontPx(size) {
  return FONT.replace("%s", String(Math.round(size)));
}

function prefersReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function fontsReady() {
  return new Promise((resolve) => {
    let settled = false;
    const done = () => {
      if (!settled) {
        settled = true;
        resolve();
      }
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(done);
    setTimeout(done, 1500);
  });
}

function setupCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, rect.width);
  const h = Math.max(1, rect.height);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w, h, ctx };
}

function useResizeTick() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => setTick((v) => v + 1), 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
  }, []);
  return tick;
}

function useAnimEffect(fn, deps) {
  useEffect(() => {
    let alive = true;
    let stop = null;
    fontsReady().then(() => {
      if (alive) stop = fn();
    });
    return () => {
      alive = false;
      if (stop) stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    root.querySelectorAll(".reveal").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return ref;
}

function HeroIntro({ nonce }) {
  const canvasRef = useRef(null);
  const tick = useResizeTick();

  useAnimEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const { w, h, ctx } = setupCanvas(canvas);
    const reduce = prefersReduced();

    const off = document.createElement("canvas");
    off.width = Math.round(w);
    off.height = Math.round(h);
    const octx = off.getContext("2d", { willReadFrequently: true });
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    let fs = Math.min(h * 0.42, 160);
    octx.font = fontPx(fs);
    const mw = octx.measureText(BRAND).width;
    const maxW = w * 0.85;
    if (mw > maxW) {
      fs *= maxW / mw;
      octx.font = fontPx(fs);
    }
    octx.fillStyle = "#fff";
    octx.fillText(BRAND, off.width / 2, off.height / 2);
    const img = octx.getImageData(0, 0, off.width, off.height).data;
    const step = Math.max(3, Math.round(fs / 26));
    const pts = [];
    for (let y = 0; y < off.height; y += step) {
      for (let x = 0; x < off.width; x += step) {
        if (img[(y * off.width + x) * 4 + 3] > 140) pts.push([x, y]);
      }
    }

    const parts = pts.map(([tx, ty]) => {
      const ang = Math.random() * Math.PI * 2;
      const dist = Math.max(w, h) * (0.55 + Math.random() * 0.6);
      return {
        tx,
        ty,
        sx: w / 2 + Math.cos(ang) * dist,
        sy: h / 2 + Math.sin(ang) * dist,
        d: Math.random() * 0.85,
        col: PALETTE[(Math.random() * PALETTE.length) | 0],
        sz: 1.3 + Math.random() * 1.7,
        ph: Math.random() * Math.PI * 2,
      };
    });

    const bgCv = document.createElement("canvas");
    bgCv.width = Math.round(w);
    bgCv.height = Math.round(h);
    const bctx = bgCv.getContext("2d");
    const bg = bctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.75);
    bg.addColorStop(0, "#0b1030");
    bg.addColorStop(1, "#05060d");
    bctx.fillStyle = bg;
    bctx.fillRect(0, 0, w, h);

    const stars = Array.from({ length: 70 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.4 + Math.random() * 1.2,
      ph: Math.random() * Math.PI * 2,
    }));

    ctx.globalAlpha = 1;
    ctx.drawImage(bgCv, 0, 0, w, h);

    const ASSEMBLED = 2.85;
    const c1 = 1.35;
    const c3 = c1 + 1;

    const t0 = performance.now();
    let raf = 0;

    const frame = (now) => {
      const t = (now - t0) / 1000;
      const since = t - ASSEMBLED;
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 0.34;
      ctx.drawImage(bgCv, 0, 0, w, h);
      ctx.globalAlpha = 1;

      for (const s of stars) {
        ctx.globalAlpha = 0.2 + 0.45 * (0.5 + 0.5 * Math.sin(t * 2 + s.ph));
        ctx.fillStyle = "#dbeafe";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const glow = Math.min(1, Math.max(0, (t - 1.5) / 0.9));
      const pulse = 0.75 + 0.25 * Math.sin(t * 3);
      const burst = since >= 0 ? Math.exp(-since * 5) * 7 : 0;

      ctx.globalCompositeOperation = "lighter";
      for (const p of parts) {
        const lp = Math.min(1, Math.max(0, (t - p.d) / 2));
        const e = lp >= 1 ? 1 : 1 + c3 * Math.pow(lp - 1, 3) + c1 * Math.pow(lp - 1, 2);
        let x = p.sx + (p.tx - p.sx) * e;
        let y = p.sy + (p.ty - p.sy) * e;
        x += Math.sin(t * 2 + p.ph) * 2.4 * e + Math.sin(t * 26 + p.ph) * burst;
        y += Math.cos(t * 1.7 + p.ph) * 2.4 * e + Math.cos(t * 24 + p.ph) * burst;
        ctx.globalAlpha =
          Math.max(0, (0.35 + 0.65 * Math.min(1, lp * 1.4)) * (1 - 0.25 * glow));
        ctx.fillStyle = p.col;
        ctx.beginPath();
        ctx.arc(x, y, p.sz, 0, Math.PI * 2);
        ctx.fill();
      }

      if (since >= 0 && since < 1.6) {
        const ra = 1 - since / 1.6;
        ctx.strokeStyle = `rgba(103, 232, 249, ${ra * 0.75})`;
        ctx.lineWidth = 2 + 7 * ra;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, since * Math.max(w, h) * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = ra * ra * 0.16;
        ctx.fillStyle = "#e0f2fe";
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;
      }

      ctx.globalCompositeOperation = "source-over";
      if (glow > 0) {
        ctx.save();
        ctx.globalAlpha = glow * 0.4;
        ctx.font = fontPx(fs);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "#67e8f9";
        ctx.shadowBlur = 40 * pulse;
        ctx.fillStyle = "#e0f2fe";
        ctx.fillText(BRAND, w / 2, h / 2);
        ctx.restore();
      }

      if (t > 3.1) {
        const subA = Math.min(1, (t - 3.1) / 0.8);
        const subSize = Math.max(11, Math.round(fs * 0.1));
        const tracking = subSize * 0.55;
        ctx.save();
        ctx.font = `600 ${subSize}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.letterSpacing = `${tracking}px`;
        ctx.globalAlpha = subA * 0.85;
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("2D MOTION DESIGN", w / 2 + tracking / 2, h / 2 + fs * 0.75);
        ctx.letterSpacing = "0px";
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    if (reduce) {
      frame(t0 + 5000);
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(frame);
    }
    return () => cancelAnimationFrame(raf);
  }, [nonce, tick]);

  return <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full bg-[#05060d]" />;
}

function GradientBlob({ nonce }) {
  const canvasRef = useRef(null);
  const tick = useResizeTick();

  useAnimEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));

    const fallback = () => {
      canvas.style.backgroundImage =
        "linear-gradient(120deg, #1e1b4b, #0e7490, #6d28d9, #be185d)";
      canvas.style.backgroundSize = "300% 300%";
      canvas.style.animation = "gradient-shift 10s ease infinite";
      return null;
    };

    const gl = canvas.getContext("webgl", { antialias: true, alpha: false });
    if (!gl) return fallback();

    const vsrc = `
      attribute vec2 aPos;
      varying vec2 vUv;
      void main() {
        vUv = aPos * 0.5 + 0.5;
        gl_Position = vec4(aPos, 0.0, 1.0);
      }
    `;
    const fsrc = `
      precision mediump float;
      varying vec2 vUv;
      uniform vec2 uRes;
      uniform float uTime;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      void main() {
        vec2 uv = vUv - 0.5;
        uv.x *= uRes.x / uRes.y;
        float t = uTime * 0.35;
        uv += 0.08 * vec2(sin(uv.y * 3.2 + t * 1.3), cos(uv.x * 2.7 - t * 1.1));
        vec3 col = vec3(0.016, 0.02, 0.05);
        vec2 c1 = vec2(sin(t * 0.9) * 0.45, cos(t * 0.7) * 0.32);
        vec2 c2 = vec2(cos(t * 0.6 + 2.0) * 0.5, sin(t * 0.8 + 1.0) * 0.35);
        vec2 c3 = vec2(sin(t * 0.5 + 4.0) * 0.35, cos(t * 0.9 + 3.0) * 0.4);
        vec2 c4 = vec2(cos(t * 0.7 + 5.2) * 0.3, sin(t * 0.6 + 4.4) * 0.28);
        col += vec3(0.42, 0.26, 0.95) * exp(-7.0 * dot(uv - c1, uv - c1));
        col += vec3(0.10, 0.75, 0.95) * exp(-8.0 * dot(uv - c2, uv - c2));
        col += vec3(0.95, 0.35, 0.65) * exp(-9.0 * dot(uv - c3, uv - c3));
        col += vec3(0.15, 0.35, 1.00) * exp(-8.0 * dot(uv - c4, uv - c4));
        float vig = smoothstep(1.1, 0.2, length(vUv - 0.5) * 1.6);
        col *= 0.55 + 0.45 * vig;
        col += (hash(vUv * uRes + uTime) - 0.5) * 0.04;
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, vsrc);
    const fs = compile(gl.FRAGMENT_SHADER, fsrc);
    if (!vs || !fs) return fallback();
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return fallback();
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    gl.uniform2f(uRes, canvas.width, canvas.height);

    const reduce = prefersReduced();
    const t0 = performance.now();
    let raf = 0;
    const frame = (now) => {
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };
    if (reduce) {
      gl.uniform1f(uTime, 3);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      raf = requestAnimationFrame(frame);
    }
    return () => {
      cancelAnimationFrame(raf);
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    };
  }, [nonce, tick]);

  return <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />;
}

function KineticType({ nonce }) {
  const canvasRef = useRef(null);
  const tick = useResizeTick();

  useAnimEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const { w, h, ctx } = setupCanvas(canvas);
    const reduce = prefersReduced();
    const word = "MOTION";

    let fs = Math.min(h * 0.42, 110);
    ctx.font = fontPx(fs);
    const spacing = () => fs * 0.06;
    let widths = word.split("").map((ch) => ctx.measureText(ch).width);
    let total = widths.reduce((a, b) => a + b, 0) + spacing() * (word.length - 1);
    const maxW = w * 0.84;
    if (total > maxW) {
      fs *= maxW / total;
      ctx.font = fontPx(fs);
      widths = word.split("").map((ch) => ctx.measureText(ch).width);
      total = widths.reduce((a, b) => a + b, 0) + spacing() * (word.length - 1);
    }
    let cursor = (w - total) / 2;
    const letters = word.split("").map((ch, i) => {
      const cx = cursor + widths[i] / 2;
      cursor += widths[i] + spacing();
      return { ch, cx, col: PALETTE[i % PALETTE.length], wid: widths[i] };
    });

    const t0 = performance.now();
    let raf = 0;
    const frame = (now) => {
      const t = (now - t0) / 1000;
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#070918";
      ctx.fillRect(0, 0, w, h);

      const sp = fs * (0.06 + 0.04 * Math.sin(t * 1.6));
      const totalNow =
        letters.reduce((a, L) => a + L.wid, 0) + sp * (letters.length - 1);
      let cur = (w - totalNow) / 2;
      const cy = h / 2;

      for (let i = 0; i < letters.length; i++) {
        const L = letters[i];
        const cx = cur + L.wid / 2;
        cur += L.wid + sp;
        const ph = t * 2.4 - i * 0.5;
        const dy = -Math.abs(Math.sin(ph)) * h * 0.09;
        const s = 1 + 0.14 * Math.sin(ph + 1);
        const a = 0.5 + 0.5 * (0.5 + 0.5 * Math.sin(ph * 1.5));
        ctx.save();
        ctx.translate(cx, cy + dy);
        ctx.rotate(Math.sin(ph) * 0.07);
        ctx.scale(s, s);
        ctx.font = fontPx(fs);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.globalAlpha = a;
        ctx.shadowColor = L.col;
        ctx.shadowBlur = 24;
        ctx.fillStyle = L.col;
        ctx.fillText(L.ch, 0, 0);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = a * 0.9;
        ctx.fillStyle = "#f8fafc";
        ctx.fillText(L.ch, 0, 0);
        ctx.restore();
      }

      const by = cy + fs * 0.62;
      const x0 = (w - totalNow) / 2;
      const line = ctx.createLinearGradient(x0, 0, x0 + totalNow, 0);
      line.addColorStop(0, "rgba(34, 211, 238, 0.12)");
      line.addColorStop(0.5, "rgba(167, 139, 250, 0.55)");
      line.addColorStop(1, "rgba(244, 114, 182, 0.12)");
      ctx.globalAlpha = 1;
      ctx.strokeStyle = line;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x0, by);
      ctx.lineTo(x0 + totalNow, by);
      ctx.stroke();

      const gx = x0 + totalNow * (0.5 + 0.5 * Math.sin(t * 1.3));
      ctx.globalCompositeOperation = "lighter";
      const glint = ctx.createRadialGradient(gx, by, 0, gx, by, 26);
      glint.addColorStop(0, "rgba(103, 232, 249, 0.9)");
      glint.addColorStop(1, "rgba(103, 232, 249, 0)");
      ctx.fillStyle = glint;
      ctx.beginPath();
      ctx.arc(gx, by, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    if (reduce) {
      frame(t0 + 400);
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(frame);
    }
    return () => cancelAnimationFrame(raf);
  }, [nonce, tick]);

  return <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />;
}

function OrbitFlow({ nonce }) {
  const canvasRef = useRef(null);
  const tick = useResizeTick();

  useAnimEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const { w, h, ctx } = setupCanvas(canvas);
    const reduce = prefersReduced();
    const cx = w / 2;
    const cy = h / 2;
    const base = Math.min(w, h) * 0.5;
    const count = Math.round(Math.min(140, Math.max(60, w / 7)));

    const parts = Array.from({ length: count }, () => ({
      a: Math.random() * Math.PI * 2,
      r: (0.2 + Math.random() * 0.78) * base,
      sp: (0.2 + Math.random() * 0.55) * (Math.random() < 0.5 ? -1 : 1),
      hue: 170 + Math.random() * 160,
      sz: 1.1 + Math.random() * 1.8,
    }));

    ctx.fillStyle = "#060818";
    ctx.fillRect(0, 0, w, h);

    let mouse = null;
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => {
      mouse = null;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const drawFrame = (t, dt) => {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(6, 8, 24, 0.18)";
      ctx.fillRect(0, 0, w, h);

      const coreR = base * 0.16 * (1 + 0.08 * Math.sin(t * 3));
      ctx.globalCompositeOperation = "lighter";
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      core.addColorStop(0, "rgba(103, 232, 249, 0.5)");
      core.addColorStop(0.6, "rgba(103, 232, 249, 0.12)");
      core.addColorStop(1, "rgba(103, 232, 249, 0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      const range = Math.min(w, h) * 0.8;
      const positions = parts.map((p) => {
        p.a += p.sp * dt;
        const ox = cx + Math.cos(p.a) * p.r;
        const oy = cy + Math.sin(p.a) * p.r * 0.66;
        let x = ox;
        let y = oy;
        let d = Infinity;
        if (mouse) {
          d = Math.hypot(ox - mouse.x, oy - mouse.y);
          if (d < range) {
            const k = (1 - d / range) * 0.4;
            x += (mouse.x - ox) * k;
            y += (mouse.y - oy) * k;
          }
        }
        return { p, x, y, d };
      });

      if (mouse) {
        for (const it of positions) {
          if (it.d < 160) {
            ctx.globalAlpha = (1 - it.d / 160) * 0.4;
            ctx.strokeStyle = "#67e8f9";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(it.x, it.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalCompositeOperation = "lighter";
      for (const it of positions) {
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = `hsl(${Math.round((it.p.hue + t * 25) % 360)} 95% 65%)`;
        ctx.beginPath();
        ctx.arc(it.x, it.y, it.p.sz, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    if (reduce) {
      drawFrame(0, 0);
      return () => {
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerleave", onLeave);
      };
    }

    let raf = 0;
    let start = performance.now();
    let last = start;
    const frame = (now) => {
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      drawFrame((now - start) / 1000, dt);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [nonce, tick]);

  return <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />;
}

function MorphShape({ nonce }) {
  const canvasRef = useRef(null);
  const tick = useResizeTick();

  useAnimEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const { w, h, ctx } = setupCanvas(canvas);
    const reduce = prefersReduced();

    const shapes = [
      (th) => 1,
      (th) => 0.76 + 0.24 * Math.cos(5 * th),
      (th) => 0.8 + 0.2 * Math.sin(6 * th + 1),
      (th) => 0.72 + 0.28 * Math.abs(Math.cos(2 * th)),
    ];
    const N = shapes.length;
    const SAMPLES = 200;
    const R = Math.min(w, h) * 0.33;
    const cx = w / 2;
    const cy = h / 2;

    const points = (fn) => {
      const out = [];
      for (let k = 0; k <= SAMPLES; k++) {
        const th = (k / SAMPLES) * Math.PI * 2;
        const rr = R * fn(th);
        out.push([Math.cos(th) * rr, Math.sin(th) * rr]);
      }
      return out;
    };

    const path = (pts) => {
      ctx.beginPath();
      for (let k = 0; k < pts.length; k++) {
        if (k === 0) ctx.moveTo(pts[k][0], pts[k][1]);
        else ctx.lineTo(pts[k][0], pts[k][1]);
      }
      ctx.closePath();
    };

    const t0 = performance.now();
    let raf = 0;
    const frame = (now) => {
      const t = (now - t0) / 1000;
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#070918";
      ctx.fillRect(0, 0, w, h);

      const u = t / 2.6;
      const i = Math.floor(u) % N;
      const f = u - Math.floor(u);
      const sm = f * f * (3 - 2 * f);
      const blended = (th) => {
        const a = shapes[i](th);
        const b = shapes[(i + 1) % N](th);
        return a + (b - a) * sm;
      };
      const pts = points(blended);

      const grad = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      grad.addColorStop(0, "#22d3ee");
      grad.addColorStop(0.5, "#a78bfa");
      grad.addColorStop(1, "#f472b6");

      const prog = Math.min(1, sm * 1.6);
      const n = Math.max(2, Math.floor(SAMPLES * prog));

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.25);
      ctx.beginPath();
      for (let k = 0; k <= n; k++) {
        if (k === 0) ctx.moveTo(pts[k][0], pts[k][1]);
        else ctx.lineTo(pts[k][0], pts[k][1]);
      }
      if (prog >= 1) ctx.closePath();
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = grad;
      if (prog >= 1) ctx.fill();
      ctx.globalAlpha = 1;
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      ctx.shadowColor = "#22d3ee";
      ctx.shadowBlur = 26;
      ctx.strokeStyle = grad;
      ctx.stroke();

      if (prog < 1) {
        const hp = pts[n];
        ctx.fillStyle = "#e0f2fe";
        ctx.shadowBlur = 22;
        ctx.beginPath();
        ctx.arc(hp[0], hp[1], 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.setLineDash([6, 12]);
      ctx.rotate(t * 0.4);
      ctx.globalAlpha = 0.35;
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, R * 1.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.rotate(-t * 1.05);
      ctx.scale(0.55, 0.55);
      ctx.globalAlpha = 0.75;
      path(pts);
      ctx.shadowColor = "#f472b6";
      ctx.shadowBlur = 20;
      ctx.strokeStyle = "#f472b6";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    if (reduce) {
      frame(t0 + 700);
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(frame);
    }
    return () => cancelAnimationFrame(raf);
  }, [nonce, tick]);

  return <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />;
}

function FlowField({ nonce }) {
  const canvasRef = useRef(null);
  const tick = useResizeTick();

  useAnimEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const { w, h, ctx } = setupCanvas(canvas);
    const reduce = prefersReduced();

    const spawn = (p) => {
      const o = p || {};
      o.x = Math.random() * w;
      o.y = Math.random() * h;
      o.px = o.x;
      o.py = o.y;
      o.age = Math.random() * 5;
      o.life = 5 + Math.random() * 7;
      o.off = Math.random() * 70;
      return o;
    };
    const count = Math.round(Math.min(750, Math.max(320, (w * h) / 420)));
    const parts = Array.from({ length: count }, () => spawn());

    const field = (x, y, t) => {
      const a = 0.0016 * x + 0.3 * t;
      const b = 0.0021 * y - 0.23 * t;
      const c = 0.0013 * (x + y) + 0.17 * t;
      const d = 0.0011 * (x - y) - 0.11 * t;
      const dy =
        1.7 * 0.0021 * Math.cos(b) +
        1.3 * 0.0013 * Math.cos(c) -
        1.0 * 0.0011 * Math.cos(d);
      const dx =
        2.1 * 0.0016 * Math.cos(a) +
        1.3 * 0.0013 * Math.cos(c) +
        1.0 * 0.0011 * Math.cos(d);
      return [dy, -dx];
    };

    ctx.fillStyle = "#060814";
    ctx.fillRect(0, 0, w, h);

    let mouse = null;
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => {
      mouse = null;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    const cleanup = () => {
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };

    const step = (t, dt) => {
      const speed = 150;
      ctx.globalCompositeOperation = "lighter";
      for (const p of parts) {
        let [fx, fy] = field(p.x, p.y, t);
        const len = Math.hypot(fx, fy) || 1;
        fx /= len;
        fy /= len;
        if (mouse) {
          const mx = mouse.x - p.x;
          const my = mouse.y - p.y;
          const dm = Math.hypot(mx, my) + 1;
          if (dm < 190) {
            const k = (1 - dm / 190) * 1.8;
            fx += (-my / dm) * k;
            fy += (mx / dm) * k;
          }
        }
        p.px = p.x;
        p.py = p.y;
        p.x += fx * speed * dt;
        p.y += fy * speed * dt;
        p.age += dt;
        const ang = Math.atan2(fy, fx);
        const hue = (200 + ang * 57.3 + p.off + t * 10 + 720) % 360;
        ctx.strokeStyle = `hsla(${Math.round(hue)}, 95%, 62%, 0.5)`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        if (
          p.age > p.life ||
          p.x < -8 ||
          p.x > w + 8 ||
          p.y < -8 ||
          p.y > h + 8
        ) {
          spawn(p);
        }
      }
      ctx.globalCompositeOperation = "source-over";
    };

    if (reduce) {
      for (let i = 0; i < 130; i++) step(0, 1 / 40);
      return cleanup;
    }

    const t0 = performance.now();
    let raf = 0;
    let last = t0;
    const frame = (now) => {
      const t = (now - t0) / 1000;
      const dt = Math.min(0.04, Math.max(0.001, (now - last) / 1000));
      last = now;
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(6, 8, 20, 0.06)";
      ctx.fillRect(0, 0, w, h);
      step(t, dt);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, [nonce, tick]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full bg-[#060814]" />
  );
}

function WarpTunnel({ nonce }) {
  const canvasRef = useRef(null);
  const tick = useResizeTick();

  useAnimEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const { w, h, ctx } = setupCanvas(canvas);
    const reduce = prefersReduced();

    const FAR = 1600;
    const mkStar = (s) => {
      const o = s || {};
      const ang = Math.random() * Math.PI * 2;
      const rad = 50 + Math.random() * 600;
      o.x = Math.cos(ang) * rad;
      o.y = Math.sin(ang) * rad;
      o.z = 60 + Math.random() * FAR;
      o.hue =
        Math.random() < 0.7
          ? 190 + Math.random() * 30
          : [280, 335, 45][(Math.random() * 3) | 0];
      o.px = null;
      o.py = null;
      return o;
    };
    const stars = Array.from({ length: 340 }, () => mkStar());
    const rings = Array.from({ length: 7 }, (_, i) => ({
      z: 100 + i * (FAR / 7),
      hue: i % 2 ? 285 : 190,
    }));

    const target = { x: 0, y: 0 };
    const par = { x: 0, y: 0 };
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    const cleanup = () => {
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };

    const t0 = performance.now();
    let raf = 0;
    let last = t0;

    const draw = (t, dt) => {
      const speed = 240 + 90 * Math.sin(t * 0.5);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(4, 6, 16, 0.3)";
      ctx.fillRect(0, 0, w, h);

      par.x += (target.x - par.x) * 0.06;
      par.y += (target.y - par.y) * 0.06;
      const cx = w / 2 + par.x * 26;
      const cy = h / 2 + par.y * 20;
      const f = Math.min(w, h) * 0.9;
      const roll = t * 0.12;
      const cr = Math.cos(roll);
      const sr = Math.sin(roll);

      ctx.globalCompositeOperation = "lighter";

      const coreR = Math.min(w, h) * 0.14;
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      core.addColorStop(0, "rgba(103, 232, 249, 0.2)");
      core.addColorStop(1, "rgba(103, 232, 249, 0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fill();

      for (const ring of rings) {
        ring.z -= speed * dt;
        if (ring.z < 40) ring.z += FAR;
        const k = f / ring.z;
        const depth = 1 - Math.min(1, ring.z / FAR);
        ctx.strokeStyle = `hsla(${ring.hue}, 95%, 65%, ${0.12 + depth * 0.7})`;
        ctx.lineWidth = 1 + depth * 3;
        ctx.beginPath();
        ctx.arc(cx, cy, 430 * k, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (const s of stars) {
        s.z -= speed * dt;
        if (s.z < 25) {
          mkStar(s);
          s.z = FAR + Math.random() * 400;
        }
        const k = f / s.z;
        const rx = s.x * cr - s.y * sr;
        const ry = s.x * sr + s.y * cr;
        const sx = cx + rx * k;
        const sy = cy + ry * k;
        const depth = 1 - Math.min(1, s.z / FAR);
        if (s.px !== null) {
          ctx.strokeStyle = `hsla(${s.hue}, 95%, ${55 + depth * 35}%, ${
            0.15 + depth * 0.75
          })`;
          ctx.lineWidth = 0.6 + depth * 2.2;
          ctx.beginPath();
          ctx.moveTo(s.px, s.py);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        } else {
          ctx.fillStyle = `hsla(${s.hue}, 95%, 75%, ${0.3 + depth * 0.6})`;
          ctx.beginPath();
          ctx.arc(sx, sy, 0.8 + depth * 2, 0, Math.PI * 2);
          ctx.fill();
        }
        s.px = sx;
        s.py = sy;
      }

      ctx.globalCompositeOperation = "source-over";
    };

    if (reduce) {
      draw(2, 0.016);
      return cleanup;
    }

    const frame = (now) => {
      const dt = Math.min(0.04, Math.max(0, (now - last) / 1000));
      last = now;
      draw((now - t0) / 1000, dt);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, [nonce, tick]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full bg-[#04060f]" />
  );
}

function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed inset-x-0 top-0 z-30 h-[3px]">
      <div
        className="h-full bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 transition-[width] duration-75"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function ReplayButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-full border border-cyan-400/40 px-4 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/10 hover:text-white"
    >
      ↻ Повторить
    </button>
  );
}

function Card({ title, tag, desc, onReplay, children }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-[#070918] transition duration-300 hover:-translate-y-1.5 hover:border-cyan-400/30 hover:shadow-[0_20px_60px_-24px_rgba(34,211,238,0.5)]">
      <div className="relative h-[260px] sm:h-[300px]">{children}</div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="display text-lg font-bold text-white">{title}</h3>
            <span className="text-[11px] uppercase tracking-[0.2em] text-cyan-400/70">{tag}</span>
          </div>
          <ReplayButton onClick={onReplay} />
        </div>
        <p className="text-sm leading-relaxed text-slate-400">{desc}</p>
      </div>
    </article>
  );
}

export default function MotionApp() {
  const [heroNonce, setHeroNonce] = useState(0);
  const [cardNonces, setCardNonces] = useState([0, 0, 0, 0, 0, 0]);
  const rootRef = useReveal();
  const replayCard = (i) =>
    setCardNonces((v) => v.map((x, j) => (j === i ? x + 1 : x)));

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-[#05060d] text-slate-200 selection:bg-cyan-400/30"
    >
      <ScrollProgress />
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#05060d]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-baseline gap-3">
            <span className="display text-xl font-black text-white">{BRAND}</span>
            <span className="text-[11px] uppercase tracking-[0.3em] text-cyan-400/70">
              2D motion
            </span>
          </div>
          <nav className="flex items-center gap-5 text-sm">
            <a href="#works" className="text-slate-400 transition hover:text-white">
              Работы
            </a>
            <a href="#services" className="text-slate-400 transition hover:text-white">
              Услуги
            </a>
            <a
              href="#contact"
              className="rounded-full border border-cyan-400/40 px-4 py-1.5 text-cyan-300 transition hover:bg-cyan-400/10"
            >
              Контакты
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5">
        <section className="pt-10 sm:pt-16">
          <h1 className="reveal display text-3xl font-black leading-tight text-white sm:text-5xl">
            Анимация, которая{" "}
            <span className="animate-gradient bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              привлекает внимание
            </span>
          </h1>
          <p className="reveal mt-4 max-w-2xl text-slate-400">
            Портфолио 2D motion graphics: интро-логотип, шейдерные градиенты,
            kinetic typography, частицы и morphing. Всё нарисовано кодом — Canvas
            и WebGL, без видеофайлов.
          </p>
        </section>

        <section className="mt-8">
          <div className="reveal relative h-[46vh] min-h-[340px] overflow-hidden rounded-3xl border border-white/10">
            <HeroIntro nonce={heroNonce} />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-[#05060d] via-[#05060d]/60 to-transparent p-5">
              <p className="max-w-md text-sm text-slate-300">
                Интро-логотип: частицы собираются в название, неоновое свечение и
                idle-пульс
              </p>
              <span className="pointer-events-auto">
                <ReplayButton onClick={() => setHeroNonce((n) => n + 1)} />
              </span>
            </div>
          </div>
        </section>

        <section className="mt-12 overflow-hidden border-y border-white/10 py-4">
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-xs uppercase tracking-[0.35em] text-slate-500">
            {[0, 1].map((k) => (
              <React.Fragment key={k}>
                <span>Canvas 2D</span>
                <span className="text-cyan-400/60">WebGL</span>
                <span>GLSL</span>
                <span className="text-violet-400/60">Kinetic type</span>
                <span>Particles</span>
                <span>Morphing</span>
                <span className="text-pink-400/60">Интро-логотипы</span>
                <span>Титры</span>
                <span>Переходы</span>
              </React.Fragment>
            ))}
          </div>
        </section>

        <div className="reveal mt-16 flex items-end justify-between gap-4">
          <h2 className="display text-2xl font-black text-white sm:text-3xl">
            Работы
          </h2>
          <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
            6 анимаций
          </span>
        </div>

        <section id="works" className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="reveal">
            <Card
              title="Жидкие градиенты"
              tag="WebGL / GLSL"
              desc="Шейдер: четыре световых пятна искажают пространство и перетекают друг в друга. Бесшовный цикл, зерно и виньетка."
              onReplay={() => replayCard(0)}
            >
              <GradientBlob nonce={cardNonces[0]} />
            </Card>
          </div>
          <div className="reveal" style={{ transitionDelay: "90ms" }}>
            <Card
              title="Kinetic typography"
              tag="Canvas 2D"
              desc="Каждая буква движется в своей фазе: пружина, вращение, дыхание трекинга и бегущий блик под строкой."
              onReplay={() => replayCard(1)}
            >
              <KineticType nonce={cardNonces[1]} />
            </Card>
          </div>
          <div className="reveal" style={{ transitionDelay: "180ms" }}>
            <Card
              title="Частицы-орбита"
              tag="Canvas 2D / interactive"
              desc="Поток частиц по эллиптическим орбитам со шлейфом, пульсирующее ядро и силовые линии к курсору."
              onReplay={() => replayCard(2)}
            >
              <OrbitFlow nonce={cardNonces[2]} />
            </Card>
          </div>
          <div className="reveal" style={{ transitionDelay: "270ms" }}>
            <Card
              title="Morphing фигур"
              tag="Canvas 2D"
              desc="Интерполяция полярных кривых: контур дорисовывается на ходу, вокруг — пунктирное кольцо и внутренняя форма."
              onReplay={() => replayCard(3)}
            >
              <MorphShape nonce={cardNonces[3]} />
            </Card>
          </div>
          <div className="reveal" style={{ transitionDelay: "360ms" }}>
            <Card
              title="Поле потока"
              tag="Canvas / generative"
              desc="700+ частиц текут по полю вихревого шума: шлейфы окрашены по направлению движения, курсор закручивает поток в вихрь."
              onReplay={() => replayCard(4)}
            >
              <FlowField nonce={cardNonces[4]} />
            </Card>
          </div>
          <div className="reveal" style={{ transitionDelay: "450ms" }}>
            <Card
              title="Гиперпространство"
              tag="Canvas / pseudo-3D"
              desc="Перспективный туннель: звёзды-строки летят мимо камеры, неоновые кольца приближаются, мир медленно закручивается."
              onReplay={() => replayCard(5)}
            >
              <WarpTunnel nonce={cardNonces[5]} />
            </Card>
          </div>
        </section>

        <section id="services" className="mt-16">
          <div className="reveal flex items-end justify-between gap-4">
            <h2 className="display text-2xl font-black text-white sm:text-3xl">
              Что я делаю
            </h2>
            <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
              услуги
            </span>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              {
                t: "Интро и лого-анимация",
                d: "Анимированный логотип или название для роликов, соцсетей и презентаций — от 3 секунд.",
              },
              {
                t: "Титры и kinetic type",
                d: "Подписи, титры и типографические акценты с выверенным ритмом, трекингом и фазами.",
              },
              {
                t: "Переходы и эффекты",
                d: "Шейдерные фоны, частицы, morph-переходы и pseudo-3D для лендингов и рекламы.",
              },
            ].map((s, i) => (
              <div
                key={s.t}
                className="reveal rounded-3xl border border-white/10 bg-[#070918] p-6 transition duration-300 hover:border-cyan-400/25"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className="display text-sm font-bold text-cyan-400">
                  0{i + 1}
                </div>
                <h3 className="display mt-3 text-base font-bold text-white">
                  {s.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="contact"
          className="reveal mt-16 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b1030] to-[#070918] p-8 sm:p-12"
        >
          <h2 className="display text-2xl font-black text-white sm:text-4xl">
            Нужна motion-графика?
          </h2>
          <p className="mt-3 max-w-xl text-slate-400">
            Сделаю интро, титры, анимацию интерфейса или рекламный ролик для
            вашего бренда. Пишите — обсудим задачу.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <a
              href="mailto:gagik.mirijanyan.03@gmail.com"
              className="rounded-full border border-white/15 px-5 py-2 text-slate-200 transition hover:border-cyan-400/50 hover:text-white"
            >
              gagik.mirijanyan.03@gmail.com
            </a>
            <a
              href="https://t.me/Animation0403"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-5 py-2 text-slate-200 transition hover:border-cyan-400/50 hover:text-white"
            >
              @Animation0403
            </a>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-5 py-10 text-center text-xs text-slate-500">
        © 2026 {BRAND} · 2D motion graphics · всё нарисовано на Canvas и WebGL
      </footer>
    </div>
  );
}
