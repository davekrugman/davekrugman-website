'use client';

import { useEffect, useRef } from 'react';
import styles from './ParticleGrid.module.css';

interface Particle {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  vx: number;
  vy: number;
  radius: number;
  baseOpacity: number;
}

const PARTICLE_COUNT = 100;
const CONNECTION_DIST = 150;
const MOUSE_RADIUS = 200;
const REPULSION_STRENGTH = 0.8;
const HOME_PULL = 0.005; // gentle spring back to home position

export default function ParticleGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- Sizing ---
    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // --- Initialize particles in a loose grid ---
    function initParticles() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const particles: Particle[] = [];

      // Create a grid layout with some jitter for organic feel
      const cols = Math.ceil(Math.sqrt(PARTICLE_COUNT * (w / h)));
      const rows = Math.ceil(PARTICLE_COUNT / cols);
      const cellW = w / cols;
      const cellH = h / rows;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const homeX = (col + 0.5) * cellW + (Math.random() - 0.5) * cellW * 0.5;
        const homeY = (row + 0.5) * cellH + (Math.random() - 0.5) * cellH * 0.5;

        particles.push({
          x: homeX + (Math.random() - 0.5) * 40,
          y: homeY + (Math.random() - 0.5) * 40,
          homeX,
          homeY,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: 1.5 + Math.random() * 1,
          baseOpacity: 0.2 + Math.random() * 0.3,
        });
      }
      particlesRef.current = particles;
    }
    initParticles();

    // --- Mouse tracking ---
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

    // --- Animation loop ---
    function animate() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      ctx.clearRect(0, 0, w, h);

      // Update particles
      for (const p of particles) {
        let isNearMouse = false;

        // Mouse repulsion
        if (mouse) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS && dist > 0) {
            isNearMouse = true;
            const force = (1 - dist / MOUSE_RADIUS) * REPULSION_STRENGTH;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Spring back to home position when not being pushed by mouse
        if (!isNearMouse) {
          const dx = p.homeX - p.x;
          const dy = p.homeY - p.y;
          p.vx += dx * HOME_PULL;
          p.vy += dy * HOME_PULL;
        }

        // Damping
        p.vx *= 0.97;
        p.vy *= 0.97;

        // Small ambient drift so it doesn't feel static
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;

        p.x += p.vx;
        p.y += p.vy;

        // Soft boundary — keep particles in canvas
        if (p.x < 0) p.x = 0;
        if (p.x > w) p.x = w;
        if (p.y < 0) p.y = 0;
        if (p.y > h) p.y = h;
      }

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            let opacity = (1 - dist / CONNECTION_DIST) * 0.15;

            // Brighten connections near mouse
            if (mouse) {
              const midX = (particles[i].x + particles[j].x) / 2;
              const midY = (particles[i].y + particles[j].y) / 2;
              const mouseDist = Math.sqrt(
                (midX - mouse.x) ** 2 + (midY - mouse.y) ** 2,
              );
              if (mouseDist < MOUSE_RADIUS) {
                opacity *= 1 + (1 - mouseDist / MOUSE_RADIUS) * 3;
              }
            }

            ctx.strokeStyle = `rgba(0, 255, 65, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        let opacity = p.baseOpacity;

        if (mouse) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS) {
            opacity = Math.min(1, opacity * (1 + (1 - dist / MOUSE_RADIUS) * 2));
          }
        }

        ctx.fillStyle = `rgba(0, 255, 65, ${opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
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

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
