/* FULL UPDATED TransitionOverlay.jsx */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TransitionOverlay = ({ show, onComplete, userTriggered }) => {

const backgroundMusic = "/music/intro.mp3";
const alexImage = "/img/team1.png";
const sarahImage = "/img/team2.png";
const mikeImage = "/img/team3.png";
const priyaImage = "/img/team4.png";

const bg1 = "/img/bg1-2.jpg";
const bg2 = "/img/bg2-2.jpg";
const bg3 = "/img/bg3.jpg";
const bg4 = "/img/bg4.jpg";



  const [currentStep, setCurrentStep] = useState(0);
  const [showTeam, setShowTeam] = useState(false);
  const [currentMember, setCurrentMember] = useState(0);
  const [previousMember, setPreviousMember] = useState(null);
  const [showPresents, setShowPresents] = useState(false);
  const [fadeToLanding, setFadeToLanding] = useState(false);

  const audioRef = useRef(null);

  /* ---------------------------- TITLE SCREENS ---------------------------- */
  const steps = [
    { 
      text: "A NEW ERA BEGINS",
      subtext: "",
      delay: 3500,
      position: "top-left",
      textSize: "text-5xl md:text-6xl lg:text-7xl",
      subtextSize: "text-xl md:text-2xl"
    },
    { 
      text: "BUILT FOR EDUCATORS",
      subtext: "Designed with purpose. Powered by intelligence.",
      delay: 3500,
      position: "center-right",
      textSize: "text-4xl md:text-5xl lg:text-6xl",
      subtextSize: "text-lg md:text-xl"
    },
    { 
      text: "WELCOME TO RAHNUM AI",
      subtext: "",
      delay: 3500,
      position: "bottom-center",
      textSize: "text-5xl md:text-6xl lg:text-7xl",
      subtextSize: "text-xl md:text-2xl"
    },
  ];

  /* ---------------------------- TEAM MEMBERS ---------------------------- */
  const teamMembers = [ 
    { name: "Umer Hussain", photo: alexImage, background: bg1, color: "#f59e0b", role: "Team Leader", specialty: "AI & Agentic Framework Lead", location: "AI RESEARCH LAB" }, 
    { name: "Muhammad Umer Qureshi", photo: sarahImage, background: bg2, color: "#ef4444", role: "UI/UX & Frontend Developer", specialty: "Designs responsive web interface", location: "DESIGN STUDIO" }, 
    { name: "Jawad Ul Hasan", photo: mikeImage, background: bg3, color: "#8b5cf6", role: "Backend & Database Engineer", specialty: "Handles Django backend & data storage", location: "DATA CENTER" }, 
    { name: "Muhammad Umer", photo: priyaImage, background: bg4, color: "#10b981", role: "Documentation & QA", specialty: "Prepares documentation & ensures system quality", location: "INNOVATION HUB" }, 
  ];

  /* ---------------------------- INTRO POSITIONING ---------------------------- */
  const getPositionClasses = (position) => {
    switch (position) {
      case 'top-left':
        return 'items-start justify-start text-left';
      case 'center-right':
        return 'items-center justify-end text-right';
      case 'bottom-center':
        return 'items-end justify-center text-center';
      default:
        return 'items-center justify-center text-center';
    }
  };

  /* ---------------------------- AUDIO CONTROL ---------------------------- */
  useEffect(() => {
    if (show && userTriggered && audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(e => console.log("Audio error:", e));
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [show, userTriggered]);

  /* ---------------------------- STATE RESET ---------------------------- */
  useEffect(() => {
    if (show) {
      setCurrentStep(0);
      setShowTeam(false);
      setCurrentMember(0);
      setPreviousMember(null);
      setShowPresents(false);
      setFadeToLanding(false);
    }
  }, [show]);

  /* ---------------------------- TITLE STEP TRANSITION ---------------------------- */
  useEffect(() => {
    if (!show) return;

    if (currentStep < steps.length) {
      const timer = setTimeout(() => setCurrentStep(prev => prev + 1), steps[currentStep].delay + 500);
      return () => clearTimeout(timer);
    } 
    else if (currentStep === steps.length && !showTeam) {
      const timer = setTimeout(() => setShowTeam(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [show, currentStep, showTeam]);

  /* ---------------------------- TEAM TRANSITION ---------------------------- */
  useEffect(() => {
    if (showTeam && currentMember < teamMembers.length) {
      const timer = setTimeout(() => {
        setPreviousMember(currentMember);
        setCurrentMember(prev => prev + 1);
      }, 8000);
      return () => clearTimeout(timer);

    } else if (showTeam && currentMember >= teamMembers.length) {
      const timer = setTimeout(() => setShowPresents(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [showTeam, currentMember]);

  /* ---------------------------- PRESENTS TO LANDING TRANSITION ---------------------------- */
  useEffect(() => {
    if (showPresents) {
      const timer = setTimeout(() => {
        setFadeToLanding(true);
      }, 4000); // Show presents for 4 seconds before fading

      return () => clearTimeout(timer);
    }
  }, [showPresents]);

  /* ---------------------------- COMPLETE TRANSITION ---------------------------- */
  useEffect(() => {
    if (fadeToLanding) {
      const timer = setTimeout(() => {
        onComplete && onComplete();
      }, 2000); // Match the fade duration

      return () => clearTimeout(timer);
    }
  }, [fadeToLanding, onComplete]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={fadeToLanding ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      className="fixed inset-0 bg-black z-50 overflow-hidden"
    >      
      {/* Music */}
      <audio ref={audioRef} preload="auto" loop className="hidden">
        <source src={backgroundMusic} type="audio/mpeg" />
      </audio>

      {/* ---------------------------- TITLE SCREENS ---------------------------- */}
      <AnimatePresence mode="wait">
        {!showTeam && !showPresents && currentStep < steps.length && (
          <motion.div
            key={`step-${currentStep}`}
            className="w-full h-full flex bg-gradient-to-br from-gray-900 via-black to-gray-800 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
          >
            {/* soft animated sweep behind text */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
            </div>

            {/* dynamic text positioning */}
            <div className={`flex-1 flex p-8 md:p-12 lg:p-16 ${getPositionClasses(steps[currentStep].position)}`}>
              <div className="max-w-4xl">
                {/* title */}
                <motion.h1
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className={`${steps[currentStep].textSize} font-bold text-white uppercase tracking-tight mb-4 leading-tight`}
                  style={{
                    textShadow: "2px 2px 15px rgba(0,0,0,0.8), 0 0 30px rgba(59,130,246,0.3)",
                    fontFamily: "'Inter','Arial',sans-serif",
                  }}
                >
                  {steps[currentStep].text}
                </motion.h1>

                {/* subtext */}
                {steps[currentStep].subtext && (
                  <motion.h2
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.3 }}
                    className={`${steps[currentStep].subtextSize} text-blue-300 uppercase tracking-wide font-light`}
                    style={{
                      textShadow: "1px 1px 8px rgba(0,0,0,0.6)",
                      fontFamily: "'Inter','Arial',sans-serif",
                    }}
                  >
                    {steps[currentStep].subtext}
                  </motion.h2>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Character Introductions */}
      <AnimatePresence mode="wait">
        {showTeam && !showPresents && currentMember < teamMembers.length && (
          <motion.div
            key={`member-${currentMember}`}
            className="w-full h-full relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Background Overlay for Better Text Readability */}
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            
            {/* Background */}
            <motion.img
              src={teamMembers[currentMember].background}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125"
              initial={{ scale: 1 }}
              animate={{ scale: 1.12 }}
              transition={{ duration: 12, ease: "linear" }}
            />

            <div className="relative z-20 h-full flex items-center justify-center px-8">
              {(() => {
                const memberLayouts = [
                  { imageSide: "left", offsetY: "0%", textSide: "right" },
                  { imageSide: "right", offsetY: "0%", textSide: "left" },
                  { imageSide: "left", offsetY: "-10%", textSide: "right" },
                  { imageSide: "right", offsetY: "10%", textSide: "left" },
                ];
                const layout = memberLayouts[currentMember % memberLayouts.length];

                return (
                  <div
                    className={`flex ${
                      layout.imageSide === "left" ? "lg:flex-row" : "lg:flex-row-reverse"
                    } items-center justify-between w-full max-w-7xl`}
                  >
                    {/* Character Image */}
                    <motion.div
                      className="flex-shrink-0 relative"
                      initial={{ scale: 1 }}
                      animate={{ scale: 1.5 }}
                      transition={{ duration: 12, ease: "linear" }}
                      style={{ transformOrigin: "center", top: layout.offsetY }}
                    >
                      <img
                        src={teamMembers[currentMember].photo}
                        alt={teamMembers[currentMember].name}
                        className="w-64 h-64 lg:w-80 lg:h-80 object-contain"
                        style={{ filter: "brightness(1.1) contrast(1.1)" }}
                      />
                    </motion.div>

                    {/* Character Info */}
                    <motion.div
                      className="flex-1 lg:pl-16 text-white"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 2, delay: 0.5 }}
                    >
                      <h2
                        className="text-5xl lg:text-7xl font-bold uppercase tracking-widest mb-2"
                        style={{
                          color: teamMembers[currentMember].color,
                          textShadow: "3px 3px 12px rgba(0,0,0,0.9)",
                        }}
                      >
                        {teamMembers[currentMember].name}
                      </h2>
                      <h3 className="text-2xl lg:text-3xl text-gray-300 uppercase tracking-wide mb-6">
                        {teamMembers[currentMember].role}
                      </h3>
                      
                      {/* IMPROVED SUBTEXT VISIBILITY */}
                      <div className="relative mb-8 max-w-2xl">
                        {/* Text background for better contrast */}
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-lg -m-2"></div>
                        
                        <motion.div
                          className="relative z-10 p-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1, delay: 1 }}
                        >
                          <div className="text-lg lg:text-xl font-medium text-white leading-relaxed">
                            {teamMembers[currentMember].specialty}
                          </div>
                        </motion.div>
                      </div>

                      <div className="flex items-center space-x-3 text-sm uppercase tracking-widest mb-6">
                        <div
                          className="w-3 h-3 rounded-full animate-pulse"
                          style={{ backgroundColor: teamMembers[currentMember].color }}
                        />
                        <span className="text-gray-300 font-medium">{teamMembers[currentMember].location}</span>
                      </div>
                      
                      <div className="w-full max-w-md h-1 bg-gray-800 overflow-hidden rounded-full">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: teamMembers[currentMember].color }}
                          initial={{ scaleX: 0, transformOrigin: "left" }}
                          animate={{ scaleX: 1, transformOrigin: "left" }}
                          transition={{ duration: 8, ease: "linear" }}
                        />
                      </div>
                    </motion.div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Presents Screen */}
      <AnimatePresence mode="wait">
        {showPresents && !fadeToLanding && (
          <motion.div
            key="presents"
            className="w-full h-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {/* Enhanced cinematic lighting effects */}
            <div className="absolute inset-0">
              {/* Animated radial spotlight */}
              <motion.div 
                className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl opacity-20"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 0.3 }}
                transition={{ duration: 4, ease: "easeInOut" }}
                style={{ 
                  background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
                  transform: 'translate(-50%, -50%)'
                }}
              />
              
              {/* Moving light beams */}
              <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-sm"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 3, delay: 1, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent blur-sm"
                initial={{ x: '100%' }}
                animate={{ x: '-100%' }}
                transition={{ duration: 3, delay: 2, ease: "easeInOut" }}
              />
            </div>

            {/* Enhanced vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_70%)] pointer-events-none" />

            {/* Subtle film grain */}
            <div 
              className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
              style={{ 
                backgroundImage: "url('https://www.transparenttextures.com/patterns/black-paper.png')",
                animation: 'grain 8s steps(10) infinite'
              }}
            />

            {/* Main content container with enhanced animations */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="relative z-20 text-center space-y-8"
            >
              {/* PRESENTS text with enhanced effects */}
              <motion.h1
                initial={{ 
                  opacity: 0, 
                  letterSpacing: '1em',
                  filter: 'blur(10px)'
                }}
                animate={{ 
                  opacity: 1, 
                  letterSpacing: '0.2em',
                  filter: 'blur(0px)'
                }}
                transition={{ 
                  duration: 2.5, 
                  ease: "easeOut",
                  delay: 0.5
                }}
                className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-[0.2em] leading-tight"
                style={{
                  textShadow: `
                    0 0 20px rgba(255,255,255,0.3),
                    0 0 40px rgba(59,130,246,0.2),
                    0 0 60px rgba(139,92,246,0.1)
                  `,
                  fontFamily: "'Inter', 'Arial Black', sans-serif",
                  background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                PRESENTS
              </motion.h1>

              {/* Subtle subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 1.5 }}
                className="text-lg md:text-xl text-gray-400 uppercase tracking-widest font-light"
              >
                RAHNUM AI
              </motion.p>

              {/* Progress bar that fills from left to right */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2 }}
                className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto"
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ scaleX: 0, transformOrigin: "left" }}
                  animate={{ scaleX: 1, transformOrigin: "left" }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>

            {/* CSS for film grain animation */}
            <style jsx>{`
              @keyframes grain {
                0%, 100% { transform: translate(0, 0); }
                10% { transform: translate(-5%, -10%); }
                20% { transform: translate(-15%, 5%); }
                30% { transform: translate(7%, -25%); }
                40% { transform: translate(-5%, 25%); }
                50% { transform: translate(-15%, 10%); }
                60% { transform: translate(15%, 0%); }
                70% { transform: translate(0%, 15%); }
                80% { transform: translate(3%, 35%); }
                90% { transform: translate(-10%, 10%); }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TransitionOverlay;