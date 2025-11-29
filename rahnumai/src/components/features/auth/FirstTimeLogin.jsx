import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TransitionOverlay from "./TransitionOverlay";
import { motion } from "framer-motion";
import usePreloadAssets from "@/hooks/usePreloadAssets.js";

const roles = [
  { name: "Admission", cardColor: "#005F9C", buttonColor: "#FFFFFF", buttonTextColor: "#000000", buttonText: "Apply Online" },
  { name: "Student", cardColor: "#7A8C74", buttonColor: "#FFFFFF", buttonTextColor: "#000000", buttonText: "Sign In" },
  { name: "Faculty Member", cardColor: "#615C5C", buttonColor: "#FFFFFF", buttonTextColor: "#000000", buttonText: "Sign In" },
  { name: "Administration Staff", cardColor: "#34495E", buttonColor: "#FFFFFF", buttonTextColor: "#000000", buttonText: "Sign In" },
  { name: "Alumni", cardColor: "#009FBC", buttonColor: "#FFFFFF", buttonTextColor: "#000000", buttonText: "Sign In" },
];

// Define assets here so they're available for preloading
const transitionAssets = {
  images: [
    "/img/team1.png",
    "/img/team2.png", 
    "/img/team3.png",
    "/img/team4.png",
    "/img/bg1-2.jpg",
    "/img/bg2-2.jpg",
    "/img/bg3.jpg",
    "/img/bg4.jpg"
  ],
  audio: ["/music/intro-new.mp3"]
};

export default function FirstTimeLogin({ onComplete }) {
  const navigate = useNavigate();
  const [cardsFading, setCardsFading] = useState(Array(roles.length).fill(false));
  const [fadeHeaderFooter, setFadeHeaderFooter] = useState(false);
  const [showBreakChains, setShowBreakChains] = useState(false);
  const [isVanishing, setIsVanishing] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  // Preload assets when component mounts
  usePreloadAssets(transitionAssets.images, transitionAssets.audio);

  // Optional: Track when assets are fully loaded
  useEffect(() => {
    const preloadAssets = async () => {
      try {
        // Preload images
        const imagePromises = transitionAssets.images.map(src => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = reject;
          });
        });

        // Preload audio
        const audioPromises = transitionAssets.audio.map(src => {
          return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.src = src;
            audio.oncanplaythrough = resolve;
            audio.onerror = reject;
            audio.load();
          });
        });

        await Promise.all([...imagePromises, ...audioPromises]);
        setAssetsLoaded(true);
        console.log("All transition assets preloaded");
      } catch (error) {
        console.warn("Some assets failed to preload:", error);
        setAssetsLoaded(true); // Continue anyway
      }
    };

    preloadAssets();
  }, []);

  const handleCardHover = (index) => {
    if (isVanishing) return;

    const newFade = [...cardsFading];
    newFade[index] = true;
    setCardsFading(newFade);

    if (newFade.every((fade) => fade)) {
      setIsVanishing(true);
      setTimeout(() => setFadeHeaderFooter(true), 300);
      setTimeout(() => setShowBreakChains(true), 800);
    }
  };

  const startCinematicTransition = () => {
    setShowBreakChains(false);
    setShowTransition(true);
    setHasCompleted(true);
  };

  const handleTransitionComplete = () => {
    console.log("Transition complete - navigating to landing");
    setShowTransition(false);
    
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else {
        navigate("/landing", { replace: true });
      }
    }, 100);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gray-100 transition-all duration-1000 ${
      fadeHeaderFooter ? "" : ""
    }`}>
      {/* Header */}
      <header className={`bg-gray-700 h-12 text-white text-2xl py-4 shadow-md flex justify-between items-center px-6 transition-all duration-1000 ${
        fadeHeaderFooter ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
      } z-10 relative`}>
        <h1 className="text-3xl font-bold font-serif">Bahria University</h1>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center py-8 relative z-10">
        {showBreakChains ? (
          <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-white">
            {/* Soft floating grayscale orbs */}
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-24 h-24 rounded-full bg-black/5 blur-2xl"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{
                  opacity: 0.25,
                  scale: 1,
                  y: [0, -25, 0],
                  x: [0, 15, 0],
                }}
                transition={{
                  duration: 5 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* Center card */}
            <motion.div
              className="backdrop-blur-xl bg-white/70 border border-gray-300 shadow-lg rounded-2xl p-10 flex flex-col items-center z-20"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {/* Text */}
              <motion.h1
                className="text-3xl font-semibold text-gray-800"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                Are you ready to...
              </motion.h1>

              {/* Minimal Black Progress Bar */}
              <motion.div
                className="w-72 h-2 bg-gray-300 rounded-full mt-6 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <motion.div
                  className="h-full bg-black"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                />
              </motion.div>

              {/* Loading indicator */}
              {!assetsLoaded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-sm text-gray-500"
                >
                  Loading cinematic experience...
                </motion.div>
              )}

              {/* Minimal Black Button */}
              <motion.button
                onClick={startCinematicTransition}
                disabled={!assetsLoaded}
                className={`px-10 py-3 mt-10 bg-black text-white text-lg font-semibold rounded-lg shadow transition-all ${
                  assetsLoaded ? "hover:scale-105" : "opacity-50 cursor-not-allowed"
                }`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3, duration: 0.8 }}
              >
                {assetsLoaded ? "Break Free" : "Loading..."}
              </motion.button>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6 xl:gap-20 w-full max-w-4xl px-4">
            {roles.map((role, index) => (
              <div
                key={role.name}
                className="flex justify-center transition-all duration-1000"
                style={{
                  opacity: cardsFading[index] ? 0 : 1,
                  transform: cardsFading[index] ? "scale(0.8) translateY(20px)" : "scale(1) translateY(0)",
                }}
                onMouseEnter={() => handleCardHover(index)}
              >
                <div
                  className="rounded-sm p-6 lg:p-8 shadow-lg text-white text-center w-full max-w-xs lg:max-w-sm h-32 lg:h-35 flex flex-col justify-center items-center transition-all duration-1000 hover:shadow-xl hover:scale-105 touch-button"
                  style={{ backgroundColor: role.cardColor }}
                >
                  <div className="text-2xl lg:text-4xl transition-all duration-1000">
                    <h1 className="font-bold text-lg lg:text-2xl">{role.name}</h1>
                  </div>
                  <button
                    className={`flex items-center justify-center font-semibold shadow-md mt-2 lg:mt-4 transition-all duration-150 ${
                      isVanishing ? "pointer-events-none opacity-50" : "hover:scale-105"
                    } touch-button`}
                    style={{
                      backgroundColor: role.buttonColor,
                      color: role.buttonTextColor,
                      borderRadius: "4px",
                      width: "80px lg:90px",
                      height: "30px lg:35px",
                      fontSize: "12px lg:13px",
                    }}
                    onClick={() => !isVanishing && navigate("/dashboard")}
                  >
                    {role.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`text-center py-4 bg-gray-200 text-gray-700 transition-all duration-1000 ${
        fadeHeaderFooter ? "opacity-0 translate-y-4 bg-gray-800" : "opacity-100 translate-y-0"
      } z-10 relative`}>
        2025 © <a href="https://bahria.edu.pk/" target="_blank" rel="noreferrer" className="underline">Bahria University</a>
      </footer>

      {/* Cinematic Transition Overlay */}
      {showTransition && (
        <TransitionOverlay
          show={showTransition}
          userTriggered={true}
          onComplete={() => {
            setShowTransition(false);
            navigate("/landing", { replace: true });
          }}
        />
      )}
    </div>
  );
}