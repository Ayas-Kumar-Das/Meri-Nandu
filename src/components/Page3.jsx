import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { extraPhotos, finalVideo, carouselMusic } from '../data/media';

export default function Page3({ visible, onGoBack }) {
  const [step, setStep] = useState(1);
  useEffect(() => {
  if (!window.gtag) return;

  let pageName = "";

  if (step === 1) pageName = "page1";
  if (step === 2) pageName = "page2";
  if (step === 3) pageName = "page3";

  // 🔹 Track page view
  window.gtag('event', 'page_view', {
    page: pageName
  });

  // 🔹 Special: final page
  if (step === 3) {
    window.gtag('event', 'reached_final');
  }

}, [step]);
useEffect(() => {
  if (!window.gtag) return;

  // 🔹 Page visit
  window.gtag('event', 'page_view_custom', {
    page: 'page3'
  });

  // 🔹 First visit
  if (!localStorage.getItem("visited")) {
    localStorage.setItem("visited", "true");
    window.gtag('event', 'first_visit');
  }

  // 🔹 Time tracking start
  const start = Date.now();

  // 🔹 Scroll tracking
  const handleScroll = () => {
    const scroll = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );

    if (scroll > 75 && !sessionStorage.getItem("scrolled75")) {
  window.gtag('event', 'scroll_75');
  sessionStorage.setItem("scrolled75", "true");
}
  };

  window.addEventListener('scroll', handleScroll);

  // 🔹 When leaving page
  return () => {
    const timeSpent = Math.round((Date.now() - start) / 1000);

    window.gtag('event', 'time_spent', {
      value: timeSpent
    });

    window.removeEventListener('scroll', handleScroll);
  };
}, []);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  const handleNoHover = () => {
    const sideX = Math.random() > 0.5 ? 1 : -1;
    const sideY = Math.random() > 0.5 ? 1 : -1;
    const newX = sideX * (Math.random() * 80 + 80);
    const newY = sideY * (Math.random() * 80 + 60);
    setNoPos({ x: newX, y: newY });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  const celebrationVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 100 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.6, ease: "easeInOut" } }
  };

  return (
    <div className="page3-container">
      <AnimatePresence mode="wait">
        
        {/* Step 1: The Ultimate Proposal */}
        {step === 1 && (
          <motion.div 
            key="proposal"
            className="proposal-box glass-card"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '0 auto', padding: '40px' }}
          >
            <h1 className="romantic-heading" style={{ fontSize: '4.5rem', marginBottom: '40px' }}>
              Will you make me your forever in every lifetime?
            </h1>
            
            <div className="proposal-actions">
              <motion.button 
                className="btn btn-yes pulse-btn"
                onClick={() => setStep(2)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontSize: '1.5rem', padding: '15px 40px', marginRight: '20px' }}
              >
                YES! ♥️
              </motion.button>

              <motion.button 
                className="btn btn-no evasive-btn"
                onMouseEnter={handleNoHover}
                onTouchStart={handleNoHover}
                onClick={handleNoHover}
                animate={{ x: noPos.x, y: noPos.y }}
                transition={{ type: 'spring', stiffness: 800, damping: 25 }}
                style={{ fontSize: '1.5rem', padding: '15px 40px', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', position: 'relative', zIndex: 10 }}
              >
                No 😜
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 2: The Celebration & Video */}
        {step === 2 && (
          <motion.div 
            key="celebration"
            className="celebration-box glass-card"
            variants={celebrationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ maxWidth: '833px', width: '93%', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '0 auto', padding: '30px 40px' }}
          >
            <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '2.2rem', margin: '20px 0' }}>
              DID YOU REALLY JUST SAID YESSSS???? WOHOOOOO!!! 😍🥳
            </h2>
            
            <div className="video-container glowing-video-box">
              <video 
                src={`/videos/${finalVideo}`} 
                controls 
                autoPlay 
                loop 
                playsInline
                preload="auto"
                style={{ width: '100%', maxHeight: '40vh', objectFit: 'contain', borderRadius: '15px', display: 'block' }}
              />
            </div>

            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: '#ffb6c1', margin: '20px 0', fontStyle: 'italic' }}>
              So now lets seal it forever with a kiss... 💋
            </p>

            <motion.button 
              className="btn btn-yes"
              onClick={() => setStep(3)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ fontSize: '1.5rem', padding: '15px 60px', marginTop: '10px' }}
            >
              Sealed 💍
            </motion.button>
          </motion.div>
        )}

        {/* Step 3: The Carousel & Final Message */}
        {step === 3 && (
          <motion.div 
            key="finale"
            className="finale-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.8, ease: "easeOut" } }}
            style={{ width: '100%', minHeight: 'auto', padding: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <audio src={`/audio/${carouselMusic}`} autoPlay loop playsInline />
            
            <div className="carousel-wrapper">
              <div className="carousel-track">
                {/* Double the array for seamless infinite scrolling */}
                {[...extraPhotos, ...extraPhotos].map((filename, i) => (
                  <div className="carousel-img-box" key={i}>
                    <img src={`/extra-photos/${filename}`} alt="our memory" />
                  </div>
                ))}
              </div>
            </div>

            <motion.div 
              className="final-text-box glass-card"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 1.2 }}
              style={{ maxWidth: '800px', marginTop: '20px', padding: '20px 40px' }}
            >
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', lineHeight: '1.8', color: '#fff' }}>
                This is how we will live together forever happily, lovingly, candidly without thinking about the world.<br/><br/>
                Thank you so much for choosing me as your life partner forever, Meri Maalkin 😙❤️<br/><br/>
                <span style={{ fontSize: '1.2rem', color: '#ffb6c1' }}>Ohh yaa I forgot , the access code is "Subhyas Forever"🧿</span>
              </p>
            </motion.div>

            <button 
              className="btn btn-back" 
              style={{ alignSelf: 'flex-end', marginTop: '40px', marginRight: '30px', zIndex: 1000 }}
              onClick={onGoBack}
            >
              Go Back
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
