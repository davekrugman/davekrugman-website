'use client';

import { useEffect, useRef } from 'react';
import styles from './MatrixRain.module.css';

// First 1000 digits of pi
const PI_DIGITS =
  '3141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006606315588174881520920962829254091715364367892590360011330530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749567351885752724891227938183011949129833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405132000568127145263560827785771342757789609173637178721468440901224953430146549585371050792279689258923542019956112129021960864034418159813629774771309960518707211349999998372978049951059731732816096318595024459455346908302642522308253344685035261931188171010003137838752886587533208381420617177669147303598253490428755468731159562863882353787593751957781857780532171226806613001927876611195909216420199';

const CHAR_SIZE = 13;
const COL_SPACING = 20;
const SPHERE_RADIUS = 80;

interface CharParticle {
  baseX: number;      // column x position
  x: number;          // actual drawn x (displaced by sphere)
  y: number;          // actual drawn y
  vy: number;         // vertical velocity
  vx: number;         // horizontal velocity (from sphere deflection)
  baseSpeed: number;  // normal fall speed
  charIndex: number;  // index into PI_DIGITS
  opacity: number;
  trailPos: number;   // 0 = head, increases for trail chars
  trailLength: number;
}

interface Column {
  x: number;
  particles: CharParticle[];
  charOffset: number;
  speed: number;
  trailLength: number;
}

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnsRef = useRef<Column[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const frameRef = useRef<number>(0);

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

        // Start the head at a random position for staggered look
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
          });
        }

        columns.push({ x, particles, charOffset, speed, trailLength });
      }

      columnsRef.current = columns;
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

    function animate() {
      if (!canvas || !ctx) return;

      const mouse = mouseRef.current;
      const columns = columnsRef.current;

      // Clear with full transparency for clean rendering
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${CHAR_SIZE}px 'IBM Plex Mono', monospace`;
      ctx.textAlign = 'center';

      for (const col of columns) {
        const headParticle = col.particles[0];

        for (const p of col.particles) {
          // --- Sphere collision physics ---
          // Return to column x position (spring back)
          const returnForce = (p.baseX - p.x) * 0.08;
          p.vx += returnForce;

          // Reset vy toward base speed
          p.vy += (p.baseSpeed - p.vy) * 0.05;

          if (mouse) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < SPHERE_RADIUS && dist > 0) {
              // Sphere surface normal
              const nx = dx / dist;
              const ny = dy / dist;

              // Push character to the sphere surface
              const overlap = SPHERE_RADIUS - dist;
              p.x += nx * overlap * 0.3;
              p.y += ny * overlap * 0.15;

              // Deflect velocity — rain flows around the sphere
              // Project velocity onto the tangent of the sphere
              const dot = p.vx * nx + p.vy * ny;
              if (dot < 0) {
                // Only deflect if moving toward sphere
                p.vx -= dot * nx * 1.5;
                p.vy -= dot * ny * 0.8;
              }

              // Add tangential flow — characters slide around the sphere
              const tx = -ny; // tangent direction
              p.vx += tx * Math.sign(dx) * 0.8;
            }
          }

          // Damping on horizontal movement
          p.vx *= 0.92;

          // Apply velocity
          p.x += p.vx;
          p.y += p.vy;

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
            p.y = -i * CHAR_SIZE - Math.random() * CHAR_SIZE * 3;
            p.vx = 0;
            p.vy = newSpeed;
            p.baseSpeed = newSpeed;
            p.charIndex = (newOffset + i) % PI_DIGITS.length;
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
          ctx.fillText(char, p.x, p.y);
        }
      }

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

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

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
