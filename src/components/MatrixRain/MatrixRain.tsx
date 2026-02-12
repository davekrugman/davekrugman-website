'use client';

import { useEffect, useRef } from 'react';
import styles from './MatrixRain.module.css';

const CHAR_SIZE = 13;
const COL_SPACING = 16;
const MAX_SPLASHES = 80;
const COLLISION_RADIUS = 18;
const COLLISION_RADIUS_SQ = COLLISION_RADIUS * COLLISION_RADIUS;
const UMBRELLA_Y_OFFSET = 21;

// Atlas constants
const ATLAS_LEVELS = 21; // opacity levels: 0.00, 0.05, ..., 1.00
const ATLAS_CHARS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
const ATLAS_CHAR_COUNT = ATLAS_CHARS.length; // 95 printable ASCII

// Pre-compute character index lookup (charCode -> atlas column)
const CHAR_TO_ATLAS: number[] = new Array(128).fill(0);
for (let i = 0; i < ATLAS_CHAR_COUNT; i++) {
  CHAR_TO_ATLAS[ATLAS_CHARS.charCodeAt(i)] = i;
}

// Pre-compute opacity strings for splash particles (which still use fillRect)
const OPACITY_CACHE: string[] = [];
for (let i = 0; i <= 100; i++) {
  OPACITY_CACHE[i] = `rgba(0,255,65,${(i / 100).toFixed(2)})`;
}

function getOpacityColor(opacity: number): string {
  const idx = (opacity * 100) | 0;
  return OPACITY_CACHE[idx < 0 ? 0 : idx > 100 ? 100 : idx];
}

// Convert a string to atlas column indices for fast lookup
function stringToAtlasIndices(str: string): number[] {
  const indices: number[] = new Array(str.length);
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    indices[i] = code < 128 ? CHAR_TO_ATLAS[code] : 0;
  }
  return indices;
}

interface Atlas {
  canvas: HTMLCanvasElement;
  cellW: number;
  cellH: number;
}

function buildAtlas(dpr: number): Atlas {
  const cellW = Math.ceil(CHAR_SIZE * 1.2);
  const cellH = Math.ceil(CHAR_SIZE * 1.4);

  const atlasCanvas = document.createElement('canvas');
  atlasCanvas.width = ATLAS_CHAR_COUNT * cellW * dpr;
  atlasCanvas.height = ATLAS_LEVELS * cellH * dpr;

  const actx = atlasCanvas.getContext('2d')!;
  actx.scale(dpr, dpr);
  actx.font = `${CHAR_SIZE}px 'IBM Plex Mono', monospace`;
  actx.textAlign = 'center';
  actx.textBaseline = 'middle';

  for (let li = 0; li < ATLAS_LEVELS; li++) {
    const opacity = li / (ATLAS_LEVELS - 1);
    actx.fillStyle = `rgba(0,255,65,${opacity.toFixed(2)})`;
    for (let ci = 0; ci < ATLAS_CHAR_COUNT; ci++) {
      const x = ci * cellW + cellW / 2;
      const y = li * cellH + cellH / 2;
      actx.fillText(ATLAS_CHARS[ci], x, y);
    }
  }

  return { canvas: atlasCanvas, cellW, cellH };
}

interface CharParticle {
  baseX: number;
  x: number;
  y: number;
  vy: number;
  vx: number;
  baseSpeed: number;
  charIndex: number; // index into the column's atlasIndices array
  opacity: number;
  trailPos: number;
  trailLength: number;
  deflected: boolean;
  rotation: number;
  rotationSpeed: number;
}

interface Column {
  x: number;
  particles: CharParticle[];
  speed: number;
  trailLength: number;
  stringIdx: number;       // which string from the CSV this column uses
  atlasIndices: number[];  // pre-computed atlas indices for this column's string
  strLen: number;          // length of the string
}

interface SplashParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  active: boolean;
}

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnsRef = useRef<Column[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const frameRef = useRef<number>(0);
  const splashesRef = useRef<SplashParticle[]>([]);
  const splashIndexRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let currentDpr = 1;
    let atlas: Atlas | null = null;

    // Rain strings loaded from CSV — each string becomes a vertical column
    let rainStrings: string[] = [];
    let rainAtlasIndices: number[][] = [];

    // Cache canvas rect for mousemove
    let canvasRect = { left: 0, top: 0 };

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvasRect = { left: rect.left, top: rect.top };

      if (dpr !== currentDpr) {
        currentDpr = dpr;
        atlas = buildAtlas(dpr);
      }

      if (rainStrings.length > 0) {
        initColumns();
      }
    }

    function initColumns() {
      const numCols = Math.floor(w / COL_SPACING);
      const columns: Column[] = [];

      for (let c = 0; c < numCols; c++) {
        const x = c * COL_SPACING + COL_SPACING / 2;
        const speed = 1.05 + Math.random() * 1.05;
        const trailLength = 10 + Math.floor(Math.random() * 12);

        // Pick a random string for this column
        const stringIdx = Math.floor(Math.random() * rainStrings.length);
        const atlasIndices = rainAtlasIndices[stringIdx];
        const strLen = rainStrings[stringIdx].length;
        const charOffset = Math.floor(Math.random() * strLen);

        const startY = Math.random() * h * 2 - h;

        const particles: CharParticle[] = [];
        for (let i = 0; i < trailLength; i++) {
          particles.push({
            baseX: x,
            x: x,
            y: startY - i * CHAR_SIZE,
            vy: speed,
            vx: 0,
            baseSpeed: speed,
            charIndex: (charOffset + i) % strLen,
            opacity: 0,
            trailPos: i,
            trailLength,
            deflected: false,
            rotation: 0,
            rotationSpeed: 0,
          });
        }

        columns.push({ x, particles, speed, trailLength, stringIdx, atlasIndices, strLen });
      }

      columnsRef.current = columns;

      // Pre-allocate splash pool
      const splashes: SplashParticle[] = [];
      for (let i = 0; i < MAX_SPLASHES; i++) {
        splashes.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, size: 0, active: false });
      }
      splashesRef.current = splashes;
      splashIndexRef.current = 0;
    }

    function spawnSplash(x: number, y: number, nx: number, ny: number) {
      const splashes = splashesRef.current;
      const count = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const idx = splashIndexRef.current % MAX_SPLASHES;
        splashIndexRef.current++;
        const s = splashes[idx];
        s.x = x;
        s.y = y;
        s.vx = nx * (1 + Math.random() * 3) + (Math.random() - 0.5) * 2;
        s.vy = ny * (1 + Math.random() * 2) - Math.random() * 1.5;
        s.life = 0;
        s.maxLife = 15 + Math.floor(Math.random() * 20);
        s.size = 1 + Math.random() * 1.5;
        s.active = true;
      }
    }

    function handleMouseMove(e: MouseEvent) {
      mouseRef.current = {
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top,
      };
    }
    function handleMouseLeave() {
      mouseRef.current = null;
    }
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Pre-render umbrella to offscreen canvas
    const umbrellaCanvas = document.createElement('canvas');
    const umbrellaSize = 80;
    umbrellaCanvas.width = umbrellaSize;
    umbrellaCanvas.height = umbrellaSize;
    const uctx = umbrellaCanvas.getContext('2d')!;
    const ucx = umbrellaSize / 2;
    const ucy = umbrellaSize / 2;
    const green = '#00ff41';
    uctx.translate(ucx, ucy);
    uctx.lineCap = 'round';
    uctx.beginPath();
    uctx.arc(0, -2, 16, Math.PI, 0);
    uctx.closePath();
    uctx.fillStyle = green;
    uctx.fill();
    uctx.fillStyle = '#0a0a0c';
    uctx.beginPath(); uctx.arc(-8, -2, 5, 0, Math.PI); uctx.fill();
    uctx.beginPath(); uctx.arc(0, -2, 5, 0, Math.PI); uctx.fill();
    uctx.beginPath(); uctx.arc(8, -2, 5, 0, Math.PI); uctx.fill();
    uctx.strokeStyle = green;
    uctx.lineWidth = 2;
    uctx.beginPath(); uctx.moveTo(0, -18); uctx.lineTo(0, -22); uctx.stroke();
    uctx.beginPath(); uctx.moveTo(0, -2); uctx.lineTo(0, 16); uctx.stroke();
    uctx.beginPath(); uctx.arc(-3, 16, 3, 0, Math.PI, false); uctx.stroke();

    function animate() {
      if (!ctx || !atlas) return;

      const mouse = mouseRef.current;
      const columns = columnsRef.current;
      const splashes = splashesRef.current;
      const numCols = columns.length;
      const dpr = currentDpr;

      const aCellW = atlas.cellW;
      const aCellH = atlas.cellH;
      const aCellWDpr = aCellW * dpr;
      const aCellHDpr = aCellH * dpr;
      const aCanvas = atlas.canvas;
      const halfCellW = aCellW / 2;
      const halfCellH = aCellH / 2;

      ctx.clearRect(0, 0, w, h);

      const hasMouse = mouse !== null;
      const mx = hasMouse ? mouse!.x : 0;
      const my = hasMouse ? mouse!.y - 2 : 0;

      let lastColor = '';

      for (let ci = 0; ci < numCols; ci++) {
        const col = columns[ci];
        const parts = col.particles;
        const numParts = parts.length;
        const headParticle = parts[0];
        const colAtlas = col.atlasIndices;

        // --- Physics update ---
        for (let pi = 0; pi < numParts; pi++) {
          const p = parts[pi];

          if (!p.deflected) {
            p.vx += (p.baseX - p.x) * 0.03;
          }

          p.vy += (p.baseSpeed - p.vy) * 0.06;

          if (hasMouse) {
            const dx = p.x - mx;
            const dy = p.y - (my - UMBRELLA_Y_OFFSET);

            if (dy <= 0) {
              const distSq = dx * dx + dy * dy;
              if (distSq < COLLISION_RADIUS_SQ && distSq > 0) {
                p.deflected = true;
                const dist = Math.sqrt(distSq);
                const nx = dx / dist;
                const ny = dy / dist;

                p.x = mx + nx * (COLLISION_RADIUS + 2);
                p.y = (my - UMBRELLA_Y_OFFSET) + ny * (COLLISION_RADIUS + 2);

                const dot = p.vx * nx + p.vy * ny;
                if (dot < 0) {
                  p.vx -= dot * nx * 0.6;
                  p.vy -= dot * ny * 0.3;
                }

                p.vx += nx * 0.2;
                p.vy += ny * 0.1;

                p.rotationSpeed = (dx >= 0 ? 1 : -1) * (0.05 + Math.random() * 0.1);

                if (pi === 0 && Math.random() > 0.3) {
                  spawnSplash(p.x, p.y, nx, ny);
                }
              }
            }
          }

          p.vx *= p.deflected ? 0.99 : 0.94;
          p.x += p.vx;
          p.y += p.vy;

          if (p.deflected) {
            p.rotation += p.rotationSpeed;
          }

          p.opacity = pi === 0 ? 0.85 : (1 - pi / p.trailLength) * 0.45;
        }

        // Reset column when head goes past bottom
        if (headParticle.y > h + col.trailLength * CHAR_SIZE) {
          const newSpeed = 1.05 + Math.random() * 1.05;

          // Pick a new random string on reset
          const newStringIdx = Math.floor(Math.random() * rainStrings.length);
          col.stringIdx = newStringIdx;
          col.atlasIndices = rainAtlasIndices[newStringIdx];
          col.strLen = rainStrings[newStringIdx].length;
          const newOffset = Math.floor(Math.random() * col.strLen);

          for (let i = 0; i < numParts; i++) {
            const p = parts[i];
            p.x = col.x;
            p.baseX = col.x;
            p.y = -i * CHAR_SIZE - Math.random() * CHAR_SIZE * 3;
            p.vx = 0;
            p.vy = newSpeed;
            p.baseSpeed = newSpeed;
            p.charIndex = (newOffset + i) % col.strLen;
            p.deflected = false;
            p.rotation = 0;
            p.rotationSpeed = 0;
          }
          col.speed = newSpeed;
        }

        // --- Draw characters from atlas ---
        for (let pi = 0; pi < numParts; pi++) {
          const p = parts[pi];
          if (p.y < -CHAR_SIZE || p.y > h + CHAR_SIZE) continue;
          if (p.opacity <= 0.02) continue;

          const levelIdx = Math.round(p.opacity * (ATLAS_LEVELS - 1));
          const charIdx = colAtlas[p.charIndex];
          const srcX = charIdx * aCellWDpr;
          const srcY = levelIdx * aCellHDpr;

          if (p.deflected && p.rotation !== 0) {
            const cos = Math.cos(p.rotation);
            const sin = Math.sin(p.rotation);
            ctx.setTransform(
              dpr * cos, dpr * sin,
              -dpr * sin, dpr * cos,
              dpr * p.x, dpr * p.y
            );
            ctx.drawImage(
              aCanvas,
              srcX, srcY, aCellWDpr, aCellHDpr,
              -halfCellW, -halfCellH, aCellW, aCellH
            );
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          } else {
            ctx.drawImage(
              aCanvas,
              srcX, srcY, aCellWDpr, aCellHDpr,
              p.x - halfCellW, p.y - halfCellH, aCellW, aCellH
            );
          }
        }
      }

      // --- Update and draw splash particles ---
      for (let i = 0; i < MAX_SPLASHES; i++) {
        const s = splashes[i];
        if (!s.active) continue;

        s.life++;
        s.vy += 0.15;
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.97;

        if (s.life >= s.maxLife) {
          s.active = false;
          continue;
        }

        const color = getOpacityColor((1 - s.life / s.maxLife) * 0.7);
        if (color !== lastColor) {
          ctx.fillStyle = color;
          lastColor = color;
        }
        ctx.fillRect(s.x - s.size / 2, s.y - s.size / 2, s.size, s.size);
      }

      // Draw umbrella
      if (hasMouse) {
        ctx.drawImage(umbrellaCanvas, mx - ucx, my - UMBRELLA_Y_OFFSET + 2 - ucy);
      }

      frameRef.current = requestAnimationFrame(animate);
    }

    // Initialize: fetch CSV, wait for font, build atlas, start animation
    resize();
    window.addEventListener('resize', resize);

    Promise.all([
      fetch('/data/rain-strings.csv')
        .then(r => r.text())
        .then(text => {
          const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
          rainStrings = lines;
          rainAtlasIndices = lines.map(s => stringToAtlasIndices(s));
        }),
      document.fonts.ready,
    ]).then(() => {
      atlas = buildAtlas(currentDpr);
      initColumns();
      frameRef.current = requestAnimationFrame(animate);
    });

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
