import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import QuizState from './QuizState';
import TeddyScene from './TeddyScene';

export default function Page1({
  currentState,
  setCurrentState,
  launchConfetti,
  clearConfetti,
  transitionToPage2,
  setCursorMode,
  setPage1Pulling,
  setPage1Hidden
}) {
  const [codeError, setCodeError] = useState(false);
  const codeInputRef = useRef(null);

  const checkSpecialCode = useCallback(() => {
    const val = codeInputRef.current?.value || '';
    const normalized = val.toLowerCase().replace(/\s+/g, '');
    if (normalized === 'subhyasforever') {
      setCodeError(false);
      setCurrentState('teddy-quick');
    } else {
      setCodeError(true);
    }
  }, [setCurrentState]);

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } }
  };

  const shakeVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, scale: 1,
      x: [0, -6, 6, -10, 10, -6, 6, 0],
      transition: { duration: 0.4, ease: "easeInOut" }
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } }
  };

  // Welcome
  if (currentState === 'welcome') {
    return (
      <motion.section 
        className="state-section"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="glass-card box-shimmer">
          <p className="sparkle-text">✨ A Private Space ✨</p>
          <h1 className="main-heading">This space is strictly reserved<br />for the girl who has my heart</h1>
          <div className="divider-line" />
          <h2 className="question-heading">Are You My Baby?</h2>
          <div className="btn-group">
            <button className="btn btn-yes" onClick={() => setCurrentState('confirm')}>Yes 💕</button>
            <button className="btn btn-no" onClick={() => setCurrentState('intruder')}>No</button>
          </div>
          <div className="code-section">
            <p className="code-label">Already visited? Enter the special code 🔑</p>
            <div className="answer-row" style={{ justifyContent: 'center' }}>
              <input
                ref={codeInputRef}
                type="text"
                className="answer-input"
                placeholder="Enter code..."
                autoComplete="off"
                style={{ maxWidth: 220, textAlign: 'center' }}
                onKeyDown={(e) => e.key === 'Enter' && checkSpecialCode()}
              />
              <button className="btn btn-submit" onClick={checkSpecialCode}>Enter</button>
            </div>
            {codeError && (
              <p className="code-error">Are you sure you have visited before? 🤔</p>
            )}
          </div>
        </div>
      </motion.section>
    );
  }

  // Confirm
  if (currentState === 'confirm') {
    return (
      <motion.section 
        className="state-section"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="glass-card box-shimmer">
          <div className="big-emoji">🥺</div>
          <h2 className="question-heading">Are you sure?</h2>
          <div className="btn-group">
            <button className="btn btn-yes" onClick={() => setCurrentState('quiz')}>Yes, I am! 💖</button>
            <button className="btn btn-no" onClick={() => setCurrentState('why')}>No...</button>
          </div>
        </div>
      </motion.section>
    );
  }

  // Intruder
  if (currentState === 'intruder') {
    return (
      <motion.section 
        className="state-section"
        variants={shakeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="glass-card">
          <div className="big-emoji">🚨</div>
          <h2 className="alert-heading">Intruder Alert!</h2>
          <p className="state-message">Only the cutest girl in the world allowed ⚠️</p>
          <button className="btn btn-back-page1" onClick={() => setCurrentState('welcome')}>Go Back 🔙</button>
        </div>
      </motion.section>
    );
  }

  // Why
  if (currentState === 'why') {
    return (
      <motion.section 
        className="state-section"
        variants={shakeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="glass-card">
          <div className="big-emoji">🤨</div>
          <p className="state-message large">Why did you even click yes at the first place?</p>
          <button className="btn btn-back-page1" onClick={() => setCurrentState('welcome')}>Go Back 🔙</button>
        </div>
      </motion.section>
    );
  }

  // Quiz
  if (currentState === 'quiz') {
    return (
      <motion.section 
        className="state-section"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <QuizState
          launchConfetti={launchConfetti}
          clearConfetti={clearConfetti}
          onComplete={() => setCurrentState('teddy')}
        />
      </motion.section>
    );
  }

  // Teddy (normal after quiz)
  if (currentState === 'teddy') {
    return (
      <section className="state-section">
        <TeddyScene
          mode="normal"
          transitionToPage2={transitionToPage2}
          setCursorMode={setCursorMode}
          setPage1Pulling={setPage1Pulling}
          setPage1Hidden={setPage1Hidden}
        />
      </section>
    );
  }

  // Teddy (quick from code)
  if (currentState === 'teddy-quick') {
    return (
      <section className="state-section">
        <TeddyScene
          mode="quick"
          transitionToPage2={transitionToPage2}
          setCursorMode={setCursorMode}
          setPage1Pulling={setPage1Pulling}
          setPage1Hidden={setPage1Hidden}
        />
      </section>
    );
  }

  return null;
}
