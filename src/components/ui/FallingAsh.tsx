"use client";

import { useEffect, useRef, type CSSProperties } from "react";

interface NodeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface FallingAshProps {
  className?: string;
  style?: CSSProperties;
  connectDistance?: number;
  nodeCount?: number;
}

const DEFAULT_CONNECT = 130;

const R = 37;
const G = 100;
const B = 221;

function createNodes(width: number, height: number, count: number): NodeParticle[] {
  const nodes: NodeParticle[] = [];
  const n = Math.max(12, count);
  for (let i = 0; i < n; i += 1) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.5) * 18,
    });
  }
  return nodes;
}

export function FallingAsh({
  className = "",
  style,
  connectDistance = DEFAULT_CONNECT,
  nodeCount,
}: FallingAshProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nodesRef = useRef<NodeParticle[]>([]);
  const animationRef = useRef<number | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const syncSize = () => {
      const rect = canvas.getBoundingClientRect();
      const cssW = Math.max(1, rect.width);
      const cssH = Math.max(1, rect.height);
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      sizeRef.current = { w: cssW, h: cssH };
      const targetCount = nodeCount ?? (cssW < 768 ? 24 : 44);
      nodesRef.current = createNodes(cssW, cssH, targetCount);
    };

    const resizeObserver = new ResizeObserver(() => {
      syncSize();
    });

    resizeObserver.observe(canvas);
    window.addEventListener("resize", syncSize);
    syncSize();

    if (reducedMotion) {
      return () => {
        window.removeEventListener("resize", syncSize);
        resizeObserver.disconnect();
      };
    }

    const animate = () => {
      const { w: width, h: height } = sizeRef.current;
      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const delta = 1 / 60;
      const distSqMax = connectDistance * connectDistance;

      for (let i = 0; i < nodes.length; i += 1) {
        const p = nodes[i];
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        if (p.x < 0 || p.x > width) {
          p.vx *= -1;
        }
        if (p.y < 0 || p.y > height) {
          p.vy *= -1;
        }
        p.x = Math.min(width, Math.max(0, p.x));
        p.y = Math.min(height, Math.max(0, p.y));
      }

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < distSqMax && d2 > 0) {
            const t = 1 - Math.sqrt(d2) / connectDistance;
            const alpha = 0.05 + t * 0.18;
            ctx.strokeStyle = `rgba(${R},${G},${B},${alpha})`;
            ctx.lineWidth = 0.65;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const p = nodes[i];
        ctx.beginPath();
        ctx.fillStyle = `rgba(${R + 80},${G + 60},${B + 20},0.22)`;
        ctx.arc(p.x, p.y, 1.15, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = window.requestAnimationFrame(animate);
    };

    animationRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", syncSize);
      resizeObserver.disconnect();
    };
  }, [connectDistance, nodeCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 h-full w-full ${className}`.trim()}
      style={{ ...style }}
      aria-hidden
    />
  );
}
