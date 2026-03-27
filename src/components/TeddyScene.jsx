import { useEffect, useRef } from 'react';

export default function TeddyScene({ mode, transitionToPage2, setCursorMode, setPage1Pulling, setPage1Hidden }) {
  const sceneRef = useRef(null);
  const timeoutsRef = useRef([]);

  const schedule = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  };

  useEffect(() => {
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;
    if (mode === 'quick') {
      startQuickSequence();
    } else {
      startNormalSequence();
    }
  }, [mode]);

  function doPagePull() {
    if (window.gtag) window.gtag('event', 'teddy_pulling_page_to_reveal_page_2');
    transitionToPage2();
  }

  function say(text) {
    const speech = sceneRef.current?.querySelector('.speech-bubble');
    if (!speech) return;
    
    if (text === '😳' || text === '🤕 *scratches head*') {
      speech.classList.add('short-bubble');
    } else {
      speech.classList.remove('short-bubble');
    }

    speech.innerHTML = text;
    speech.style.display = 'block';
    speech.style.animation = 'none';
    speech.offsetHeight;
    speech.style.animation = '';
  }

  function shutUp() {
    const speech = sceneRef.current?.querySelector('.speech-bubble');
    if (!speech) return;
    speech.style.display = 'none';
  }

  function showCountdown(num) {
    const el = sceneRef.current?.querySelector('.countdown-display');
    if (!el) return;
    el.style.display = 'block';
    el.innerHTML = `<span class="countdown-num">${num}</span>`;
    const span = el.querySelector('.countdown-num');
    if (span) {
      span.style.animation = 'none';
      span.offsetHeight;
      span.style.animation = '';
    }
  }

  function startQuickSequence() {
    const teddy = sceneRef.current?.querySelector('.teddy-bear');
    const speech = sceneRef.current?.querySelector('.speech-bubble');
    if (!teddy || !speech) return;

    // 🔹 Track teddy animation
    if (window.gtag) window.gtag('event', 'teddy_animation_started_code_shortcut');

    // Position bear off-screen right
    teddy.className = 'teddy-bear slide-from-right';
    teddy.offsetHeight;

    // Bear slides to center
    schedule(() => {
      teddy.className = 'teddy-bear slide-to-center';
      say('Welcome back! Let me open the door for you My Queen💕');
    }, 100);

    // Bear jumps up
    schedule(() => {
      shutUp();
      teddy.style.transition = 'bottom 1.2s cubic-bezier(0.22, 1, 0.36, 1)';
      teddy.style.bottom = 'calc(100% - 160px)';
    }, 2800);

    // Pull page
    schedule(() => doPagePull(), 4000);
  }

  function startNormalSequence() {
    const teddy = sceneRef.current?.querySelector('.teddy-bear');
    const countdown = sceneRef.current?.querySelector('.countdown-display');
    const kiss = sceneRef.current?.querySelector('.kiss-emoji');
    if (!teddy) return;

    // 🔹 Track teddy animation
    if (window.gtag) window.gtag('event', 'teddy_animation_started_after_quiz');

    // Walk in
    schedule(() => teddy.classList.add('walk-in'), 200);

    // Jump 1
    schedule(() => { shutUp(); teddy.classList.add('jump'); }, 2500);
    schedule(() => teddy.classList.remove('jump'), 3400);

    // Embarrassed
    schedule(() => say('😳'), 3600);

    // Jump 2
    schedule(() => { shutUp(); teddy.classList.add('jump'); }, 5000);
    schedule(() => teddy.classList.remove('jump'), 5900);

    // Talk
    schedule(() => say("Ok now I understand what's the problem 🤔"), 6200);
    schedule(() => say("I need my Madam's power to open…<br/>So Madam give a flying kiss in..."), 9500);

    // Countdown
    schedule(() => { shutUp(); showCountdown(5); }, 13500);
    schedule(() => showCountdown(4), 14500);
    schedule(() => showCountdown(3), 15500);
    schedule(() => showCountdown(2), 16500);
    schedule(() => showCountdown(1), 17500);

    // Kiss flies in from top
    schedule(() => {
      if (countdown) countdown.style.display = 'none';
      if (kiss) {
        kiss.style.display = 'block';
        schedule(() => kiss.classList.add('fly-top'), 50);
      }
    }, 18500);

    // Blown back
    schedule(() => {
      if (kiss) {
        kiss.style.display = 'none';
        kiss.classList.remove('fly-top');
      }
      teddy.classList.add('blown-back');
    }, 19800);

    // After blown back recovers
    schedule(() => {
      teddy.classList.remove('blown-back');
      say('🤕 *scratches head*');
    }, 23500);

    schedule(() => say("Damn baby that was too hard 😅<br/>Anyways I got my power 💪"), 25500);

    // Super jump
    schedule(() => {
      shutUp();
      teddy.classList.add('super-jump');
    }, 28000);

    // Pull page down
    schedule(() => doPagePull(), 29500);
  }

  return (
    <div className="teddy-scene" ref={sceneRef}>
      <div className="teddy-bear">
        <div className="teddy-wrap">
          <span className="teddy-emoji">🧸</span>
          <span className="teddy-label">BABY BEAR</span>
        </div>
        <div className="speech-bubble" style={{ display: 'none' }}></div>
      </div>
      <div className="countdown-display" style={{ display: 'none' }}></div>
      <div className="kiss-emoji" style={{ display: 'none' }}>💋</div>
    </div>
  );
}
