'use client';

import { useEffect, useRef } from 'react';
import styles from './MatrixRain.module.css';

// First 1000 digits of pi
const PI_DIGITS =
  '3141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006606315588174881520920962829254091715364367892590360011330530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749567351885752724891227938183011949129833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405132000568127145263560827785771342757789609173637178721468440901224953430146549585371050792279689258923542019956112129021960864034418159813629774771309960518707211349999998372978049951059731732816096318595024459455346908302642522308253344685035261931188171010003137838752886587533208381420617177669147303598253490428755468731159562863882353787593751957781857780532171226806613001927876611195909216420199';

const PI_LEN = PI_DIGITS.length;
const CHAR_SIZE = 13;
const COL_SPACING = 16;
const MAX_SPLASHES = 80;
const COLLISION_RADIUS = 18;
const COLLISION_RADIUS_SQ = COLLISION_RADIUS * COLLISION_RADIUS;

// Pre-compute opacity strings to avoid string allocation every frame
const OPACITY_CACHE: string[] = [];
for (let i = 0; i <= 100; i++) {
  OPACITY_CACHE[i] = `rgba(0,255,65,${(i / 100).toFixed(2)})`;
}

function getOpacityColor(opacity: number): string {
  const idx = (opacity * 100) | 0; // fast floor
  return OPACITY_CACHE[idx < 0 ? 0 : idx > 100 ? 100 : idx];
}

interface CharParticle {
  baseX: number;
  x: number;
  y: number;
  vy: number;
  vx: number;
  baseSpeed: number;
  charIndex: number;
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
  charOffset: number;
  speed: number;
  trailLength: number;
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
    let needsFontReset = true;

    // Cache canvas rect for mousemove (avoid getBoundingClientRect every move)
    let canvasRect = { left: 0, top: 0 };

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvasRect = { left: rect.left, top: rect.top };
      needsFontReset = true;
      initColumns();
    }

    function initColumns() {
      const numCols = Math.floor(w / COL_SPACING);
      const columns: Column[] = [];

      for (let c = 0; c < numCols; c++) {
        const x = c * COL_SPACING + COL_SPACING / 2;
        const speed = 1.05 + Math.random() * 1.05;
        const trailLength = 10 + Math.floor(Math.random() * 12);
        const charOffset = Math.floor(Math.random() * PI_LEN);

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
            charIndex: (charOffset + i) % PI_LEN,
            opacity: 0,
            trailPos: i,
            trailLength,
            deflected: false,
            rotation: 0,
            rotationSpeed: 0,
          });
        }

        columns.push({ x, particles, charOffset, speed, trailLength });
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

    // Spawn splash particles using ring buffer (no shift/splice)
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

    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking — use cached rect instead of getBoundingClientRect every move
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
    // Filled canopy
    uctx.beginPath();
    uctx.arc(0, -2, 16, Math.PI, 0);
    uctx.closePath();
    uctx.fillStyle = green;
    uctx.fill();
    // Cut scallops
    uctx.fillStyle = '#0a0a0c';
    uctx.beginPath(); uctx.arc(-8, -2, 5, 0, Math.PI); uctx.fill();
    uctx.beginPath(); uctx.arc(0, -2, 5, 0, Math.PI); uctx.fill();
    uctx.beginPath(); uctx.arc(8, -2, 5, 0, Math.PI); uctx.fill();
    // Tip
    uctx.strokeStyle = green;
    uctx.lineWidth = 2;
    uctx.beginPath(); uctx.moveTo(0, -18); uctx.lineTo(0, -22); uctx.stroke();
    // Handle
    uctx.beginPath(); uctx.moveTo(0, -2); uctx.lineTo(0, 16); uctx.stroke();
    // Hook
    uctx.beginPath(); uctx.arc(-3, 16, 3, 0, Math.PI, false); uctx.stroke();

    // Set font once
    ctx.font = `${CHAR_SIZE}px 'IBM Plex Mono', monospace`;
    ctx.textAlign = 'center';

    function animate() {
      if (!ctx) return;

      const mouse = mouseRef.current;
      const columns = columnsRef.current;
      const splashes = splashesRef.current;
      const numCols = columns.length;

      ctx.clearRect(0, 0, w, h);

      if (needsFontReset) {
        ctx.font = `${CHAR_SIZE}px 'IBM Plex Mono', monospace`;
        ctx.textAlign = 'center';
        needsFontReset = false;
      }

      // Mouse collision vars — hoist outside loop
      const hasMouse = mouse !== null;
      const mx = hasMouse ? mouse!.x : 0;
      const my = hasMouse ? mouse!.y - 2 : 0;

      let lastColor = '';

      for (let ci = 0; ci < numCols; ci++) {
        const col = columns[ci];
        const parts = col.particles;
        const numParts = parts.length;
        const headParticle = parts[0];

        // --- Physics update ---
        for (let pi = 0; pi < numParts; pi++) {
          const p = parts[pi];

          if (!p.deflected) {
            p.vx += (p.baseX - p.x) * 0.03;
          }

          p.vy += (p.baseSpeed - p.vy) * 0.06;

          if (hasMouse) {
            const dx = p.x - mx;
            const dy = p.y - my;

            if (dy <= 0) {
              const distSq = dx * dx + dy * dy;
              if (distSq < COLLISION_RADIUS_SQ && distSq > 0) {
                p.deflected = true;
                const dist = Math.sqrt(distSq);
                const nx = dx / dist;
                const ny = dy / dist;

                p.x = mx + nx * (COLLISION_RADIUS + 2);
                p.y = my + ny * (COLLISION_RADIUS + 2);

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
          const newOffset = Math.floor(Math.random() * PI_LEN);

          for (let i = 0; i < numParts; i++) {
            const p = parts[i];
            p.x = col.x;
            p.baseX = col.x;
            p.y = -i * CHAR_SIZE - Math.random() * CHAR_SIZE * 3;
            p.vx = 0;
            p.vy = newSpeed;
            p.baseSpeed = newSpeed;
            p.charIndex = (newOffset + i) % PI_LEN;
            p.deflected = false;
            p.rotation = 0;
            p.rotationSpeed = 0;
          }
          col.speed = newSpeed;
          col.charOffset = newOffset;
        }

        // --- Draw characters ---
        for (let pi = 0; pi < numParts; pi++) {
          const p = parts[pi];
          if (p.y < -CHAR_SIZE || p.y > h + CHAR_SIZE) continue;
          if (p.opacity <= 0.02) continue;

          const color = getOpacityColor(p.opacity);
          if (color !== lastColor) {
            ctx.fillStyle = color;
            lastColor = color;
          }

          if (p.deflected && p.rotation !== 0) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillText(PI_DIGITS[p.charIndex], 0, 0);
            ctx.restore();
          } else {
            ctx.fillText(PI_DIGITS[p.charIndex], p.x, p.y);
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
        ctx.drawImage(umbrellaCanvas, mx - ucx, my + 2 - ucy);
      }

      frameRef.current = requestAnimationFrame(animate);
    }

    frameRef.current = requestAnimationFrame(animate);

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
