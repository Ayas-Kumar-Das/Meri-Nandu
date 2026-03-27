import { useState, useRef, useCallback, useEffect } from 'react';
import { questions } from '../data/questions';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizState({ launchConfetti, clearConfetti, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [renderedQuestions, setRenderedQuestions] = useState([0]);
  const [completedSet, setCompletedSet] = useState(new Set());
  const [results, setResults] = useState({});
  const inputRefs = useRef({});
  const containerRef = useRef(null);
  const blockRefs = useRef({});
  const wrongAttemptsRef = useRef({});

  // 🔹 Track quiz started + time
  useEffect(() => {
    if (!window.gtag) return;
    window.gtag('event', 'quiz_started');
    const startTime = Date.now();
    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      window.gtag('event', 'quiz_time_spent', { value: timeSpent });
    };
  }, []);

  const getInputCount = (q) => {
    if (q.type === 'single') return 1;
    if (q.type === 'double') return 2;
    if (q.type === 'triple') return 3;
    return 1;
  };

  // Auto-scroll to latest question
  useEffect(() => {
    const latestIdx = renderedQuestions[renderedQuestions.length - 1];
    const q = questions[latestIdx];
    if (q && blockRefs.current[q.id]) {
      setTimeout(() => {
        blockRefs.current[q.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 600);
    }
  }, [renderedQuestions]);

  const submitAnswer = useCallback((index) => {
    const q = questions[index];
    let isCorrect = false;

    if (q.type === 'single') {
      const val = inputRefs.current[`${q.id}-0`]?.value || '';
      isCorrect = q.validate(val);
    } else {
      const count = q.type === 'double' ? 2 : 3;
      const answers = [];
      for (let i = 0; i < count; i++) {
        answers.push(inputRefs.current[`${q.id}-${i}`]?.value || '');
      }
      isCorrect = q.validate(answers);
    }

    if (isCorrect) {
      setResults(prev => ({ ...prev, [q.id]: { correct: true, msg: q.correctMsg } }));
      setCompletedSet(prev => new Set([...prev, q.id]));
      launchConfetti(q.confetti);

      // 🔹 Track correct answer
      if (window.gtag) {
        window.gtag('event', 'quiz_answered_correct', {
          question_number: q.id,
          question_text: q.text.substring(0, 60),
          wrong_attempts: wrongAttemptsRef.current[q.id] || 0
        });
      }

      setTimeout(() => {
        if (index < 4) {
          const nextIdx = index + 1;
          setRenderedQuestions(prev => [...prev, nextIdx]);
          setCurrentIndex(nextIdx);
        } else if (index === 4) {
          setTimeout(() => {
            // Show final question solo
            setRenderedQuestions([5]);
            setCurrentIndex(5);
          }, 300);
        } else if (index === 5) {
          // 🔹 Track quiz completed
          if (window.gtag) window.gtag('event', 'quiz_all_questions_completed');
          setTimeout(() => onComplete(), 1500);
        }
      }, 1800);
    } else {
      setResults(prev => ({ ...prev, [q.id]: { correct: false, msg: q.wrongMsg } }));

      // 🔹 Track wrong answer
      wrongAttemptsRef.current[q.id] = (wrongAttemptsRef.current[q.id] || 0) + 1;
      if (window.gtag) {
        window.gtag('event', 'quiz_answered_wrong', {
          question_number: q.id,
          question_text: q.text.substring(0, 60),
          attempt_number: wrongAttemptsRef.current[q.id]
        });
      }

      // Shake the question block
      const block = blockRefs.current[q.id];
      if (block) {
        block.style.animation = 'none';
        block.offsetHeight;
        block.style.animation = 'shake 0.4s ease';
      }
    }
  }, [launchConfetti, clearConfetti, onComplete]);

  const progress = (completedSet.size / questions.length) * 100;

  return (
    <div className="glass-card quiz-card" ref={containerRef}>
      <p className="quiz-intro">Ok lets take a test then... 📝</p>
      <h2 className="quiz-title">With answers only my sweet girl would know..</h2>
      <div className="divider-line" />

      {/* Question blocks */}
      <AnimatePresence>
        {renderedQuestions.map((qIdx) => {
          const q = questions[qIdx];
          if (!q) return null;
          const result = results[q.id];
          const isCompleted = completedSet.has(q.id);
          const inputCount = getInputCount(q);

          return (
            <motion.div
              key={q.id}
              ref={(el) => { blockRefs.current[q.id] = el; }}
              className={`question-block solid-glass-page1 ${isCompleted ? 'completed' : ''} ${q.isFinal ? 'final-question' : ''}`}
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0, transition: { duration: 0.5, type: 'spring', bounce: 0.4 } }}
            >
              <div style={{ marginBottom: 10, textAlign: q.id === 6 ? 'center' : 'left' }}>
                {q.id !== 6 && <span className="q-number">{q.id}</span>}
                <span className="q-text">{q.text}</span>
              </div>
              {q.hint && <p className="q-hint">{q.hint}</p>}
              <div className="answer-row">
                {Array.from({ length: inputCount }).map((_, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[`${q.id}-${i}`] = el; }}
                    type="text"
                    className="answer-input"
                    placeholder={q.type === 'single' ? q.placeholder : q.placeholders[i]}
                    autoComplete="off"
                    disabled={isCompleted}
                    onKeyDown={(e) => e.key === 'Enter' && submitAnswer(qIdx)}
                  />
                ))}
                <button
                  className="btn btn-submit"
                  onClick={() => submitAnswer(qIdx)}
                  disabled={isCompleted}
                >
                  Submit
                </button>
                {result && (
                  <span className={`result-icon ${result.correct ? 'correct' : ''}`}>
                    {result.correct ? '❤️' : '⚠️'}
                  </span>
                )}
              </div>
              {result && (
                <p className={`result-msg ${result.correct ? 'correct' : 'wrong'}`}>
                  {result.msg}
                </p>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
