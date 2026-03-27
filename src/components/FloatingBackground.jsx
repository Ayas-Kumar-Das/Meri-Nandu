import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function FloatingBackground({ type }) {
  const containerRef = useRef(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const container = containerRef.current;
    if (!container) return;

    if (type === 'questions') {
      const emojis = ['❓', '❔', '⁉️', '🤔', '❔', '🤔', '❓'];
      for (let i = 0; i < 25; i++) {
        const p = document.createElement('span');
        p.className = 'float-particle';
        p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        p.style.left = Math.random() * 100 + '%';
        p.style.fontSize = (14 + Math.random() * 18) + 'px';
        const dur = 15 + Math.random() * 25;
        p.style.animationDuration = dur + 's';
        if (i < 12) {
          p.style.top = (Math.random() * 100) + '%';
          p.style.animationDelay = '-' + (Math.random() * dur) + 's';
        } else {
          p.style.animationDelay = (Math.random() * 10) + 's';
        }
        container.appendChild(p);
      }
    } else if (type === 'hearts') {
      const emojis = ['❤️', '💕', '💖', '💗', '🌸', '💘', '💝', '🌹', '💌', '✨'];
      for (let i = 0; i < 45; i++) {
        const p = document.createElement('span');
        p.className = 'heart-particle';
        p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        p.style.left = Math.random() * 100 + '%';
        p.style.fontSize = (12 + Math.random() * 22) + 'px';
        const dur = 15 + Math.random() * 25;
        p.style.animationDuration = dur + 's';
        p.style.animationDelay = '-' + (Math.random() * dur) + 's';
        container.appendChild(p);
      }
    } else if (type === 'sparkles') {
      const emojis = ['✨', '🌟', '💫', '⭐', '🎇', '🍾', '🎉', '🎊'];
      for (let i = 0; i < 35; i++) {
        const p = document.createElement('span');
        p.className = 'float-particle';
        p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        p.style.left = Math.random() * 100 + '%';
        p.style.fontSize = (15 + Math.random() * 20) + 'px';
        const dur = 12 + Math.random() * 20;
        p.style.animationDuration = dur + 's';
        p.style.animationDelay = '-' + (Math.random() * dur) + 's';
        container.appendChild(p);
      }
    }
  }, [type]);

  return (
    <motion.div
      ref={containerRef}
      className={type === 'questions' ? 'floating-bg' : 'hearts-bg'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 1 }}
    />
  );
}
