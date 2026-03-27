import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mainPhotos } from '../data/media';

export default function Page2({ visible, isPulling, onGoNext }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isPromptExiting, setIsPromptExiting] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  useEffect(() => {
    if (!window.gtag || !visible) return;

    // 🔹 Page opened
    window.gtag('event', 'page_view', { page_title: 'Page 2 - Love Letter' });
    window.gtag('event', 'page_2_opened');

    const startTime = Date.now();

    // 🔹 Scroll tracking (each fires ONLY ONCE)
    let scrolledPast25 = false;
    let scrolledPast50 = false;
    let scrolledPast75 = false;
    let scrolledPast100 = false;

    const handleScroll = () => {
      const scrollableHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const scroll = Math.round((window.scrollY / scrollableHeight) * 100);

      if (scroll > 25 && !scrolledPast25) {
        scrolledPast25 = true;
        window.gtag('event', 'page_2_scrolled_25');
      }
      if (scroll > 50 && !scrolledPast50) {
        scrolledPast50 = true;
        window.gtag('event', 'page_2_scrolled_50');
      }
      if (scroll > 75 && !scrolledPast75) {
        scrolledPast75 = true;
        window.gtag('event', 'page_2_scrolled_75');
      }
      if (scroll > 95 && !scrolledPast100) {
        scrolledPast100 = true;
        window.gtag('event', 'page_2_reached_bottom');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      window.gtag('event', 'page_2_time_spent', { value: timeSpent });
      window.removeEventListener('scroll', handleScroll);
    };
  }, [visible]);

  // Memoize polaroid data so it only randomizes ONCE on mount, not on every click/render
  const { leftPolaroids, rightPolaroids } = useMemo(() => {
    const shuffled = [...mainPhotos].sort((a, b) => a.length - b.length + (Math.random() - 0.5) * 5);
    return {
      leftPolaroids: shuffled.slice(0, 20).map((filename, i) => ({
        id: `left-${i}`,
        filename,
        customDelay: Math.random() * 0.5,
        rotate: (Math.random() - 0.5) * 12
      })),
      rightPolaroids: shuffled.slice(20, 40).map((filename, i) => ({
        id: `right-${i}`,
        filename,
        customDelay: Math.random() * 0.5,
        rotate: (Math.random() - 0.5) * 12
      }))
    };
  }, []); // empty deps = only computed once

  if (!visible && !isPulling) return null;
  const animateState = visible ? "visible" : "hidden";

  const letterVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const textContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0 }
    }
  };

  const textItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } }
  };

  return (
    <motion.div
      className="page2-scroll-wrapper"
      initial={false}
      animate={{ opacity: isPromptExiting ? 0 : 1, scale: isPromptExiting ? 0.95 : 1 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <div className="welcome-glow" />

      {/* Left Wire & Polaroids */}
      <div className="polaroid-sidebar left">
        <div className="polaroid-wire" />
        {(isMobile ? [...leftPolaroids, ...leftPolaroids] : leftPolaroids).map((p, i) => (
          <motion.div
            key={isMobile ? `${p.id}-${i < leftPolaroids.length ? 'a' : 'b'}` : p.id}
            className="polaroid-frame"
            initial={{ opacity: 0, y: -20, rotate: 0 }}
            animate={visible ? { opacity: 1, y: 0, rotate: p.rotate } : { opacity: 0, y: -20, rotate: 0 }}
            transition={visible ? { delay: 0, duration: 0.6, type: 'spring', stiffness: 120, damping: 14 } : { duration: 0 }}
            style={{ marginTop: isMobile ? '0' : '80px' }}
            whileHover={{ scale: 1.08, zIndex: 50, rotate: 0, transition: { duration: 0.2 } }}
            onClick={() => {
              if (window.gtag) {
                window.gtag('event', 'page_2_photo_clicked');
              }
              setSelectedImage(p);
            }}
          >
            <div className="polaroid-clip" />
            <div className="polaroid-photo">
              <img src={`/photos/${p.filename}`} alt="us" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Middle Content */}
      <div className="center-content" style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        <motion.div
          className="dark-glass-box"
          variants={letterVariants}
          initial="hidden"
          animate={animateState}
          style={{ width: '100%' }}
        >
          <div className="badge">WELCOME MY LOVE</div>
          <h1 className="romantic-heading">Meri Nandu</h1>

          <div className="tiny-heart-divider">💕</div>

          <motion.div
            className="romantic-letter"
            variants={textContainer}
            initial="hidden"
            animate={animateState}
          >
            <motion.p variants={textItem}>
              So my dear Nandu, you finally landed on this page... Welcome welcome♥️ ...
              I made this page just for you to have a safe space of ours where our memories are loved and highlighted..
            </motion.p>
            <motion.p variants={textItem}>
              Baby you are my everything... My heart, my soul, my life, my home... I can't express how much blessed I am to have you in life... You are everywhere... In my heart... In my mind... In my soul... In my life... In my dreams... Everywhere bas tum hi tum... Mo Megha Kadamba 😚... You are the fal of my acche karm...
            </motion.p>
            <motion.p variants={textItem}>
              Baby I miss you so so so soo much... I wish you could be here by my side all the time 🥺, i wanna be your baby bear with you... After all the worldly chaos it's you whom I search for peace... Mera Sukoon tumse hai ♥️🧿...
            </motion.p>
            <motion.p variants={textItem}>
              Sach kahun agar na baby meri life ka khoobsurat hissa tum ho... Tbh meri life hi tum ho♥️... Tumhari awaz ,tumhari hasi , tumhara daantna , your way of caring me... Everything about you is so special that mai ruk ke sochta hun that how I got so lucky to be blessed by God with such a beautiful loving woman... Uk I feel like to be God's favourite child for this🧿🙏🏻... You are not just another person to me baby... You are my home, my safe place jahan bina kisi darr ke , bina kisi bahar ki chinta ke I can just simply hug you tightly, keep my head on your chest and sleep while letting go of every worries 🫂
            </motion.p>
            <motion.p variants={textItem}>
              Tum meri aadat nhi zaroorat ho... I can't live without you jaanu♥️... Tumhare saath bitaya har ek pal is everythingu for me... Ye jo udte firte ghumte photos dekh rhi ho na these are not just random memories... These define my life 🤌🏻🧿 ... These are not even the start... I want infinite memories with you like these and I want my full life with you... The future I imagine for myself is only with you holding your hands and we both helping each other grow and loving unconditionally 🌍... Mere din ka best part is feeling you in my heart and getting that comfort... Mere din ka pehla aour aakhri khayal tum (of course there is no pehla aakhri coz aap to sapne mai bhi rehti ho 😂😚♥️)
            </motion.p>
            <motion.p variants={textItem}>
              My little marshmallow 🍡... We faced so many ups and downs together, fought every battle all with both laughter and tears.. Starting from WhatsApp chat to holding each other tightly we have came a long way and this should go till the end of life... I can't lose you baby 🤞🏻... My life is nothing with you sweetheart... Even in our old age I want nothing but you... Tumhe pyaar karna hai tumhe tang karna, hamare bacchon aour grandchildren ke saamne tumhe cheedna hai... Tumhara care paana hai tumhari daant sunni hai... My world revolves around you only sweetie✨
            </motion.p>
            <motion.p variants={textItem}>
              Nandu, I will forever remain your baby bear 🐻... In every phase , in every situation I will love you , care for you , protect you and most importantly be by your side and never leaving you for a moment 🧿... But with all this I wanna say something more too... Ik I have made you sad many a times and hurt you in past and I am truly sorry for the tears you shed because of stupidity... For everytime I made you feel unheard or sad... I was dumb back then but I have learned... Tum mere liye sabse precious ho jaanu and I never want to be the reason behind your pain again... Keeping you happy and loved is my biggest goal in my life now...🧿
            </motion.p>
            <motion.p variants={textItem}>
              Meri cute is chopsticks... I wanna give you my entire life and be the man you truly deserve ♾️... Har khushi mai tumhare saath naachna aour har mushkil waqt mai tumhara haath sabse kass ke pakadna... Ek din hamara pyara sa chota ghar hoga where I will live in our home along with my home jahan meri har subha tumse shuru hogi♥️🧿... I want to build a life with you where we love deeply, fight over silly things and then make up with warm long hugs and deep kisses... 😚 Ek aisi life jahan sirf tum, mai and hamara pyara sa sansaar 🧿
            </motion.p>
            <motion.p variants={textItem}>
              And looking forward... I vow you a lifetime of love and happiness... Choosing you each and everyday ♥️... To understand you , feel you , annoy you , care you and love you each and every time I take a breath... You are my peace... My comfort... My happiness...<br />
              I am yours completely, honestly, forever ...
            </motion.p>
            <motion.p variants={textItem}>
              I Love You So Much Beyond What Words Can Explain , How much I Love You How Will Be 100× more the very next second ♥️🧿✨... <br />
              My Home 🏡 ... Humesha meri hi rehna sweetie, aise hi mujhe daant te , samjhate aour pyaar karte rehna ✨
            </motion.p>
            <motion.p variants={textItem} className="signature">
              Forever Yours -<br />
              Tumhara Baby Bear 🐻♥️
            </motion.p>
          </motion.div>

          {/* Romantic Footer filling empty bottom space */}
          <motion.div
            className="romantic-footer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 3, duration: 1.5 }}
            style={{ marginTop: '60px', textAlign: 'center' }}
          >
            <div style={{ fontSize: '3rem', animation: 'heartLightPulse 3s infinite', color: '#ff8aab' }}>
              ♾️
            </div>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: '#fcf5f8', marginTop: '15px', fontStyle: 'italic', marginBottom: '40px' }}>
              Forever & Always
            </p>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {!isPromptExiting && (
            <motion.div
              className="page3-prompt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.4 } }}
              style={{ position: 'relative', zIndex: 60, marginTop: '30px', marginBottom: '100px', padding: '30px', background: 'rgba(255,107,138,0.1)', borderRadius: '20px', border: '1px solid rgba(255,138,171,0.3)', backdropFilter: 'blur(10px)', textAlign: 'center', width: '100%' }}
            >
              <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '1.8rem', marginBottom: '20px' }}>
                So baby now I want to ask you a question...
              </h3>
              <motion.button
                className="btn btn-yes pulse-btn"
                style={{ padding: '15px 50px', fontSize: '1.3rem', margin: '0 auto' }}
                onClick={() => {
                  if (window.gtag) window.gtag('event', 'page_2_clicked_ok_to_go_to_page_3');
                  setIsPromptExiting(true);
                  setTimeout(() => onGoNext(), 800);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ok!
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Wire & Polaroids */}
      <div className="polaroid-sidebar right">
        <div className="polaroid-wire" />
        {(isMobile ? [...rightPolaroids, ...rightPolaroids] : rightPolaroids).map((p, i) => (
          <motion.div
            key={isMobile ? `${p.id}-${i < rightPolaroids.length ? 'a' : 'b'}` : p.id}
            className="polaroid-frame"
            initial={{ opacity: 0, y: -20, rotate: 0 }}
            animate={visible ? { opacity: 1, y: 0, rotate: p.rotate } : { opacity: 0, y: -20, rotate: 0 }}
            transition={visible ? { delay: 0.3, duration: 0.6, type: 'spring', stiffness: 120, damping: 14 } : { duration: 0 }}
            style={{ marginTop: isMobile ? '0' : '80px' }}
            whileHover={{ scale: 1.08, zIndex: 50, rotate: 0, transition: { duration: 0.2 } }}
            onClick={() => {
              if (window.gtag) {
                window.gtag('event', 'page_2_photo_clicked');
              }
              setSelectedImage(p);
            }}
          >
            <div className="polaroid-clip" />
            <div className="polaroid-photo">
              <img src={`/photos/${p.filename}`} alt="us" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => {
              if (window.gtag) window.gtag('event', 'page_2_photo_lightbox_closed');
              setSelectedImage(null);
            }}
          >
            <motion.div
              className="lightbox-content"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25, mass: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="polaroid-photo" style={{ background: 'transparent' }}>
                <img src={`/photos/${selectedImage.filename}`} alt="us zoomed" style={{ objectFit: 'contain' }} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
