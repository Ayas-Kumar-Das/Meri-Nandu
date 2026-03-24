import { useEffect, useRef, useState } from 'react';

export default function CustomCursor({ mode }) {
  const cursorRef = useRef(null);
  const trailContainerRef = useRef(null);
  const trailCountRef = useRef(0);
  const [trailEnabled, setTrailEnabled] = useState(false);

  useEffect(() => {
    setTrailEnabled(mode === 'heart');
  }, [mode]);

  useEffect(() => {
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9500;overflow:visible;';
    document.body.appendChild(container);
    trailContainerRef.current = container;
    return () => container.remove();
  }, []);

  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
      trailCountRef.current++;
      if (trailCountRef.current % 4 === 0 && trailEnabled && trailContainerRef.current) {
        spawnTrail(e.clientX, e.clientY);
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [trailEnabled]);

  // Continuous mild trail even when stationary
  useEffect(() => {
    if (!trailEnabled) return;
    const interval = setInterval(() => {
      if (trailContainerRef.current) {
        spawnTrail(mouseRef.current.x, mouseRef.current.y);
      }
    }, 400); // spawn a heart every 400ms
    return () => clearInterval(interval);
  }, [trailEnabled]);

  const heartTrailEmojis = ['💕', '💗', '💖', '💝', '💘', '💓', '💕'];
  const thinkingTrailEmojis = ['❓', '❔', '🤔', '😕', '🧐', '❓', '⁉️'];

  function spawnTrail(x, y) {
    const container = trailContainerRef.current;
    if (!container) return;
    const pool = mode === 'heart' ? heartTrailEmojis : thinkingTrailEmojis;
    const el = document.createElement('span');
    el.className = 'cursor-trail-dot';
    el.textContent = pool[Math.floor(Math.random() * pool.length)];
    el.style.left = (x + (Math.random() - 0.5) * 30) + 'px';
    el.style.top = (y + (Math.random() - 0.5) * 30) + 'px';
    container.appendChild(el);
    requestAnimationFrame(() => el.classList.add('fade'));
    setTimeout(() => { if (el.parentNode) el.remove(); }, 1200);
    // Limit trail elements
    if (container.children.length > 20) {
      container.firstChild?.remove();
    }
  }

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${mode === 'heart' ? 'heart-mode' : ''}`}
    >
      {mode === 'heart' ? '❤️' : '🤔'}
    </div>
  );
}
