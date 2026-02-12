'use client';

import { useEffect, useRef } from 'react';
import styles from './MatrixRain.module.css';

// First 1000 digits of pi
const PI_DIGITS =
  '3141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006606315588174881520920962829254091715364367892590360011330530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749567351885752724891227938183011949129833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405132000568127145263560827785771342757789609173637178721468440901224953430146549585371050792279689258923542019956112129021960864034418159813629774771309960518707211349999998372978049951059731732816096318595024459455346908302642522308253344685035261931188171010003137838752886587533208381420617177669147303598253490428755468731159562863882353787593751957781857780532171226806613001927876611195909216420199';

const CHAR_SIZE = 13;
const COL_SPACING = 16;
const MAX_SPLASHES = 240;

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
}

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnsRef = useRef<Column[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const frameRef = useRef<number>(0);
  const splashesRef = useRef<SplashParticle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      initColumns();
    }

    function initColumns() {
      const numCols = Math.floor(w / COL_SPACING);
      const columns: Column[] = [];

      for (let c = 0; c < numCols; c++) {
        const x = c * COL_SPACING + COL_SPACING / 2;
        const speed = 1 + Math.random() * 1.5;
        const trailLength = 10 + Math.floor(Math.random() * 12);
        const charOffset = Math.floor(Math.random() * PI_DIGITS.length);

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
            charIndex: (charOffset + i) % PI_DIGITS.length,
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
    }

    // Spawn splash particles at collision point
    function spawnSplash(x: number, y: number, nx: number, ny: number) {
      const splashes = splashesRef.current;
      const count = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        if (splashes.length >= MAX_SPLASHES) {
          // Recycle oldest
          const oldest = splashes.shift()!;
          oldest.x = x;
          oldest.y = y;
          oldest.vx = nx * (1 + Math.random() * 3) + (Math.random() - 0.5) * 2;
          oldest.vy = ny * (1 + Math.random() * 2) - Math.random() * 1.5;
          oldest.life = 0;
          oldest.maxLife = 15 + Math.floor(Math.random() * 20);
          oldest.size = 1 + Math.random() * 1.5;
          splashes.push(oldest);
        } else {
          splashes.push({
            x,
            y,
            vx: nx * (1 + Math.random() * 3) + (Math.random() - 0.5) * 2,
            vy: ny * (1 + Math.random() * 2) - Math.random() * 1.5,
            life: 0,
            maxLife: 15 + Math.floor(Math.random() * 20),
            size: 1 + Math.random() * 1.5,
          });
        }
      }
    }

    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking
    function handleMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    function handleMouseLeave() {
      mouseRef.current = null;
    }
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Draw umbrella helper — solid silhouette with cutout scallops
    function drawUmbrella(ctx: CanvasRenderingContext2D, mx: number, my: number) {
      const green = '#00ff41';
      ctx.save();
      ctx.translate(mx, my);
      ctx.lineCap = 'round';

      // Filled canopy
      ctx.beginPath();
      ctx.arc(0, -2, 16, Math.PI, 0);
      ctx.closePath();
      ctx.fillStyle = green;
      ctx.fill();

      // Cut scallops out of canopy
      ctx.fillStyle = '#0a0a0c';
      ctx.beginPath(); ctx.arc(-8, -2, 5, 0, Math.PI); ctx.fill();
      ctx.beginPath(); ctx.arc(0, -2, 5, 0, Math.PI); ctx.fill();
      ctx.beginPath(); ctx.arc(8, -2, 5, 0, Math.PI); ctx.fill();

      // Tip
      ctx.strokeStyle = green;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(0, -22); ctx.stroke();

      // Handle
      ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(0, 16); ctx.stroke();

      // Hook
      ctx.beginPath(); ctx.arc(-3, 16, 3, 0, Math.PI, false); ctx.stroke();

      ctx.restore();
    }

    function animate() {
      if (!canvas || !ctx) return;

      const mouse = mouseRef.current;
      const columns = columnsRef.current;
      const splashes = splashesRef.current;

      // Clear with full transparency for clean rendering
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${CHAR_SIZE}px 'IBM Plex Mono', monospace`;
      ctx.textAlign = 'center';

      for (const col of columns) {
        const headParticle = col.particles[0];

        for (const p of col.particles) {
          if (!p.deflected) {
            // Return to column x position (gentle spring back) — only if not deflected
            const returnForce = (p.baseX - p.x) * 0.03;
            p.vx += returnForce;
          }

          // Gravity — pull vy back toward base fall speed
          // Gentle lerp so bounced characters float up before falling back
          p.vy += (p.baseSpeed - p.vy) * 0.06;

          if (mouse) {
            // Sphere collision — matches umbrella canopy arc exactly
            // Umbrella canopy: ctx.arc(0, -2, 16, Math.PI, 0)
            // Center at (mouse.x, mouse.y - 2), radius 16
            const cx = mouse.x;
            const cy = mouse.y - 2;
            const radius = 18; // 16px canopy + 2px margin

            const dx = p.x - cx;
            const dy = p.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Only collide with upper half of sphere (the canopy)
            if (dist < radius && dy <= 0) {
              p.deflected = true;

              // Surface normal — radiates outward from center
              const nx = dx / dist;
              const ny = dy / dist;

              // Push particle just outside the sphere surface
              p.x = cx + nx * (radius + 2);
              p.y = cy + ny * (radius + 2);

              // Reflect velocity off curved surface — gentle
              const dot = p.vx * nx + p.vy * ny;
              if (dot < 0) {
                p.vx -= dot * nx * 0.6;
                p.vy -= dot * ny * 0.3;
              }

              // Tiny nudge along the surface normal
              p.vx += nx * 0.2;
              p.vy += ny * 0.1;

              // Tumble — right side spins clockwise, left side counterclockwise
              const side = dx >= 0 ? 1 : -1;
              p.rotationSpeed = side * (0.05 + Math.random() * 0.1);

              // Spawn splash particles from any digit in the trail
              if (Math.random() > 0.4) {
                spawnSplash(p.x, p.y, nx, ny);
              }
            }
          }

          // Damping on horizontal — stronger when in column, lighter when deflected
          p.vx *= p.deflected ? 0.99 : 0.94;

          // Apply velocity
          p.x += p.vx;
          p.y += p.vy;

          // Update rotation for deflected particles
          if (p.deflected) {
            p.rotation += p.rotationSpeed;
          }

          // Calculate opacity based on trail position
          const trailFade = 1 - p.trailPos / p.trailLength;
          p.opacity = p.trailPos === 0 ? 0.85 : trailFade * 0.45;
        }

        // Reset column when head goes past bottom
        if (headParticle.y > h + col.trailLength * CHAR_SIZE) {
          const newSpeed = 1 + Math.random() * 1.5;
          const newOffset = Math.floor(Math.random() * PI_DIGITS.length);

          for (let i = 0; i < col.particles.length; i++) {
            const p = col.particles[i];
            p.x = col.x;
            p.baseX = col.x;
            p.y = -i * CHAR_SIZE - Math.random() * CHAR_SIZE * 3;
            p.vx = 0;
            p.vy = newSpeed;
            p.baseSpeed = newSpeed;
            p.charIndex = (newOffset + i) % PI_DIGITS.length;
            p.deflected = false;
            p.rotation = 0;
            p.rotationSpeed = 0;
          }
          col.speed = newSpeed;
          col.charOffset = newOffset;
        }

        // --- Draw characters ---
        for (const p of col.particles) {
          if (p.y < -CHAR_SIZE || p.y > h + CHAR_SIZE) continue;
          if (p.opacity <= 0.02) continue;

          const char = PI_DIGITS[p.charIndex];

          // Head glow
          if (p.trailPos === 0) {
            ctx.shadowColor = 'rgba(0, 255, 65, 0.5)';
            ctx.shadowBlur = 10;
          } else {
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
          }

          ctx.fillStyle = `rgba(0, 255, 65, ${p.opacity})`;
          if (p.deflected && p.rotation !== 0) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillText(char, 0, 0);
            ctx.restore();
          } else {
            ctx.fillText(char, p.x, p.y);
          }
        }
      }

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // --- Update and draw splash particles ---
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.life++;
        s.vy += 0.15; // gravity on splashes
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.97; // air resistance

        if (s.life >= s.maxLife) {
          splashes.splice(i, 1);
          continue;
        }

        const alpha = 1 - s.life / s.maxLife;
        ctx.fillStyle = `rgba(0, 255, 65, ${alpha * 0.7})`;
        ctx.fillRect(s.x - s.size / 2, s.y - s.size / 2, s.size, s.size);
      }

      // Draw umbrella at mouse position
      if (mouse) {
        drawUmbrella(ctx, mouse.x, mouse.y);
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
