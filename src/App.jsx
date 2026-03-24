import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import ConfettiCanvas from './components/ConfettiCanvas';
import FloatingBackground from './components/FloatingBackground';
import Page1 from './components/Page1';
import Page2 from './components/Page2';
import Page3 from './components/Page3';

export default function App() {
  const [currentState, setCurrentState] = useState('welcome');
  const [page, setPage] = useState(1);
  const [cursorMode, setCursorMode] = useState('thinking');
  const [page1Pulling, setPage1Pulling] = useState(false);
  const [page1Hidden, setPage1Hidden] = useState(false);
  const confettiRef = useRef(null);

  const launchConfetti = useCallback((emojis, count) => {
    confettiRef.current?.launch(emojis, count);
  }, []);

  const clearConfetti = useCallback(() => {
    confettiRef.current?.clear();
  }, []);

  const transitionToPage2 = useCallback(() => {
    setPage1Pulling(true);
    setCursorMode('heart');
    setTimeout(() => {
      setPage1Hidden(true);
      setPage(2);
      window.scrollTo(0, 0);
    }, 2500);
  }, []);

  useEffect(() => {
    if (page > 1) {
      window.scrollTo(0, 0);
    }
  }, [page]);

  return (
    <div className={`main-app ${page >= 2 ? 'scrollable-page' : ''}`}>
      <CustomCursor mode={page >= 2 ? 'heart' : cursorMode} />

      {/* Page 1 */}
      {!page1Hidden && (
        <div className={`page page1 ${page1Pulling ? 'pulled-down' : ''}`}>
          <FloatingBackground type="questions" />
          <ConfettiCanvas ref={confettiRef} />
          <AnimatePresence mode="wait">
            <Page1
              key={currentState}
              currentState={currentState}
              setCurrentState={setCurrentState}
              launchConfetti={launchConfetti}
              clearConfetti={clearConfetti}
              transitionToPage2={transitionToPage2}
            />
          </AnimatePresence>
        </div>
      )}

      {/* Pages 2 and 3 (Wrapped in a single AnimatePresence to prevent bleed) */}
      <AnimatePresence mode="wait">
        {(page === 2 || page1Pulling) && (
          <motion.div 
            key="page2"
            className="page page2" 
            style={{ zIndex: 10 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <FloatingBackground type="hearts" />
            <Page2 visible={page === 2} isPulling={page1Pulling} onGoNext={() => { setPage(3); window.scrollTo(0, 0); }} />
          </motion.div>
        )}

        {page === 3 && (
          <motion.div 
            key="page3"
            className="page page3" 
            style={{ zIndex: 20 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <FloatingBackground type="sparkles" />
            <Page3 visible={page === 3} onGoBack={() => { 
              setPage(2); 
              setTimeout(() => {
                window.scrollTo(0, 0);
                const p2 = document.querySelector('.page2');
                if (p2) p2.scrollTop = 0;
              }, 50); 
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
