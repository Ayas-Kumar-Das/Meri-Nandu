import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

const ConfettiCanvas = forwardRef(function ConfettiCanvas(_, ref) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let running = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const isMobile = () => window.innerWidth <= 900;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => {
        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.rot += p.rotV;
        p.opacity -= p.fadeRate;
        if (p.y > canvas.height + 30 || p.opacity <= 0) return false;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(p.emoji, 0, 0);
        ctx.restore();
        return true;
      });
      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate);
      } else {
        running = false;
      }
    }

    engineRef.current = {
      launch: (emojis, count = 20) => {
        const mobile = isMobile();
        // Scale for mobile: fewer particles, slower speed
        const actualCount = mobile ? Math.min(count, 10) : count;
        for (let i = 0; i < actualCount; i++) {
          particles.push({
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            x: window.innerWidth * 0.2 + Math.random() * window.innerWidth * 0.6,
            y: window.innerHeight + 20,
            vx: (Math.random() - 0.5) * (mobile ? 3 : 5),
            vy: -(mobile ? (5 + Math.random() * 3) : (18 + Math.random() * 6)), // Massive initial up
            size: mobile ? (20 + Math.random() * 10) : (24 + Math.random() * 16),
            rot: Math.random() * 360,
            rotV: (Math.random() - 0.5) * (mobile ? 4 : 6),
            opacity: 1,
            gravity: mobile ? (0.08 + Math.random() * 0.04) : (1.8 + Math.random() * 0.5),
            fadeRate: mobile ? 0.008 : 0.035
          });
        }
        if (!running) {
          running = true;
          animate();
        }
      },
      clear: () => {
        particles = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        running = false;
        if (animationId) cancelAnimationFrame(animationId);
      }
    };

    return () => {
      window.removeEventListener('resize', resize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    launch: (emojis, count = 20) => engineRef.current?.launch(emojis, count),
    clear: () => engineRef.current?.clear()
  }));

  return <canvas ref={canvasRef} className="confetti-canvas" />;
});

export default ConfettiCanvas;

