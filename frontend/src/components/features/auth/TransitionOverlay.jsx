/* FULLY RESPONSIVE TransitionOverlay.jsx */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import usePreloadAssets from "@/hooks/usePreloadAssets.js";

const TransitionOverlay = ({ show, onComplete, userTriggered }) => {
  /* ------------------ ASSETS ------------------ */
  const backgroundMusic = "/music/intro-new.mp3";
  const alexImage = "/img/team1.png";
  const sarahImage = "/img/team2.png";
  const mikeImage = "/img/team3.png";
  const priyaImage = "/img/team4.png";

  const bg1 = "/img/bg1-2.jpg";
  const bg2 = "/img/bg2-2.jpg";
  const bg3 = "/img/bg3.jpg";
  const bg4 = "/img/bg4.jpg";

  usePreloadAssets(
    [alexImage, sarahImage, mikeImage, priyaImage, bg1, bg2, bg3, bg4],
    [backgroundMusic]
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [showTeam, setShowTeam] = useState(false);
  const [currentMember, setCurrentMember] = useState(0);
  const [showPresents, setShowPresents] = useState(false);
  const [fadeToLanding, setFadeToLanding] = useState(false);

  const audioRef = useRef(null);

  /* ------------------ TITLE SCREENS ------------------ */
  const steps = [
    {
      text: "A NEW ERA BEGINS",
      subtext: "",
      delay: 3500,
      position: "top-left",
      textSize: "text-4xl md:text-6xl lg:text-7xl",
      subtextSize: "text-base md:text-xl",
    },
    {
      text: "BUILT FOR EDUCATORS",
      subtext: "Designed with purpose. Powered by intelligence.",
      delay: 3500,
      position: "center-right",
      textSize: "text-3xl md:text-5xl lg:text-6xl",
      subtextSize: "text-base md:text-xl",
    },
    {
      text: "WELCOME TO RAHNUM AI",
      subtext: "",
      delay: 3500,
      position: "bottom-center",
      textSize: "text-4xl md:text-6xl lg:text-7xl",
      subtextSize: "text-base md:text-xl",
    },
  ];

  /* ------------------ TEAM MEMBERS ------------------ */
  const teamMembers = [
    {
      name: "Umer Hussain",
      photo: alexImage,
      background: bg1,
      color: "#f59e0b",
      role: "Team Leader",
      specialty: "AI & Agentic Framework Lead",
      location: "AI RESEARCH LAB",
    },
    {
      name: "Muhammad Umer Qureshi",
      photo: sarahImage,
      background: bg2,
      color: "#ef4444",
      role: "UI/UX & Frontend Developer",
      specialty: "Designs responsive web interface",
      location: "DESIGN STUDIO",
    },
    {
      name: "Jawad Ul Hasan",
      photo: mikeImage,
      background: bg3,
      color: "#8b5cf6",
      role: "Backend & Database Engineer",
      specialty: "Handles Django backend & data storage",
      location: "DATA CENTER",
    },
    {
      name: "Muhammad Umer",
      photo: priyaImage,
      background: bg4,
      color: "#10b981",
      role: "Documentation & QA",
      specialty: "Prepares documentation & ensures system quality",
      location: "INNOVATION HUB",
    },
  ];

  /* ------------------ POSITION UTILS ------------------ */
  const getPositionClasses = (position) => {
    switch (position) {
      case "top-left":
        return "items-start justify-start text-left";
      case "center-right":
        return "items-center justify-end text-right";
      case "bottom-center":
        return "items-end justify-center text-center";
      default:
        return "items-center justify-center text-center";
    }
  };

  /* ------------------ AUDIO ------------------ */
  useEffect(() => {
    if (show && userTriggered && audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.oncanplaythrough = () =>
        audioRef.current.play().catch(() => {});
      audioRef.current.load();
    }
  }, [show, userTriggered]);

  /* ------------------ RESET ------------------ */
  useEffect(() => {
    if (show) {
      setCurrentStep(0);
      setShowTeam(false);
      setCurrentMember(0);
      setShowPresents(false);
      setFadeToLanding(false);
    }
  }, [show]);

  /* ------------------ STEP PROGRESSION ------------------ */
  useEffect(() => {
    if (!show) return;

    if (currentStep < steps.length) {
      const t = setTimeout(
        () => setCurrentStep((p) => p + 1),
        steps[currentStep].delay + 500
      );
      return () => clearTimeout(t);
    } else if (!showTeam) {
      const t = setTimeout(() => setShowTeam(true), 1000);
      return () => clearTimeout(t);
    }
  }, [show, currentStep, showTeam]);

  /* ------------------ TEAM CYCLING ------------------ */
  useEffect(() => {
    if (showTeam && currentMember < teamMembers.length) {
      const t = setTimeout(() => setCurrentMember((p) => p + 1), 8000);
      return () => clearTimeout(t);
    } else if (showTeam && currentMember >= teamMembers.length) {
      const t = setTimeout(() => setShowPresents(true), 2000);
      return () => clearTimeout(t);
    }
  }, [showTeam, currentMember]);

  /* ------------------ PRESENTS → LANDING ------------------ */
  useEffect(() => {
    if (showPresents) {
      const t = setTimeout(() => setFadeToLanding(true), 4000);
      return () => clearTimeout(t);
    }
  }, [showPresents]);

  useEffect(() => {
    if (fadeToLanding) {
      const t = setTimeout(() => onComplete && onComplete(), 2000);
      return () => clearTimeout(t);
    }
  }, [fadeToLanding]);

  /* ------------------ NO RENDER ------------------ */
  if (!show) return null;

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={fadeToLanding ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 2 }}
      className="fixed inset-0 bg-black z-[9999] overflow-hidden"
    >
      <audio ref={audioRef} preload="auto" loop className="hidden">
        <source src={backgroundMusic} type="audio/mpeg" />
      </audio>

      {/* =====================================================
         TITLE SCREENS
      ===================================================== */}
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
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
            </div>

            <div
              className={`flex-1 flex p-6 md:p-12 ${getPositionClasses(
                steps[currentStep].position
              )}`}
            >
              <div className="max-w-3xl w-full">
                <motion.h1
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.2 }}
                  className={`${steps[currentStep].textSize} font-bold text-white uppercase leading-tight`}
                  style={{ textShadow: "0 0 25px rgba(0,0,0,.7)" }}
                >
                  {steps[currentStep].text}
                </motion.h1>

                {steps[currentStep].subtext && (
                  <motion.h2
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.3 }}
                    className={`${steps[currentStep].subtextSize} text-blue-300 mt-3`}
                  >
                    {steps[currentStep].subtext}
                  </motion.h2>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
         TEAM MEMBER SCREENS
      ===================================================== */}
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
            <div className="absolute inset-0 bg-black/40 z-10"></div>

            <motion.img
              src={teamMembers[currentMember].background}
              className="absolute inset-0 w-full h-full object-cover grayscale contrast-125"
              initial={{ scale: 1 }}
              animate={{ scale: 1.15 }}
              transition={{ duration: 10, ease: "linear" }}
            />

            <div className="relative z-20 h-full flex items-center justify-center px-4 sm:px-8">
              <div
                className={`w-full max-w-6xl flex flex-col 
                lg:flex-row items-center justify-between gap-8`}
              >
                {/* IMAGE */}
                <motion.div
                  className="w-full flex justify-center"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.35 }}
                  transition={{ duration: 10 }}
                >
                  <img
                    src={teamMembers[currentMember].photo}
                    className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain"
                  />
                </motion.div>

                {/* TEXT */}
                <motion.div
                  className="flex-1 text-white text-center lg:text-left px-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2 }}
                >
                  <h2
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase"
                    style={{
                      color: teamMembers[currentMember].color,
                      textShadow: "0 0 20px rgba(0,0,0,.8)",
                    }}
                  >
                    {teamMembers[currentMember].name}
                  </h2>

                  <h3 className="text-lg sm:text-xl md:text-2xl text-gray-300 mt-2 mb-4">
                    {teamMembers[currentMember].role}
                  </h3>

                  <div className="relative mb-6 max-w-xl mx-auto lg:mx-0">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-lg -m-2"></div>
                    <div className="relative z-10 p-3 sm:p-4">
                      <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                        {teamMembers[currentMember].specialty}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm tracking-widest mb-4">
                    <div
                      className="w-3 h-3 rounded-full animate-pulse"
                      style={{ backgroundColor: teamMembers[currentMember].color }}
                    />
                    <span className="text-gray-300">
                      {teamMembers[currentMember].location}
                    </span>
                  </div>

                  <div className="w-full max-w-sm mx-auto lg:mx-0 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: teamMembers[currentMember].color }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 8, ease: "linear" }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================
         PRESENTS SCREEN
      ===================================================== */}
      <AnimatePresence mode="wait">
        {showPresents && !fadeToLanding && (
          <motion.div
            key="presents"
            className="w-full h-full flex items-center justify-center bg-black relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2 }}
              className="relative z-20 text-center space-y-6 px-4"
            >
              <motion.h1
                initial={{ opacity: 0, letterSpacing: "1em" }}
                animate={{ opacity: 1, letterSpacing: "0.2em" }}
                transition={{ duration: 2.5 }}
                className="text-4xl sm:text-6xl md:text-7xl font-black uppercase"
                style={{
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                PRESENTS
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 1 }}
                className="text-sm sm:text-base md:text-lg text-gray-400 tracking-widest"
              >
                RAHNUM AI
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="w-48 sm:w-64 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto"
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 4 }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TransitionOverlay;
