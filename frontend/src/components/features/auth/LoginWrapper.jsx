import { useState, useEffect } from "react";
import FirstTimeLogin from "./FirstTimeLogin";
import EnhancedLogin from "./EnhancedLogin";
import TransitionOverlay from "./TransitionOverlay";

export default function LoginWrapper({ onLoginSuccess }) {
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('first-time'); // 'first-time', 'transition', 'enhanced'
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedBefore");
    if (hasVisited) {
      setIsFirstTime(false);
      setCurrentView('enhanced');
    }
    setIsLoading(false);
  }, []);

  const handleFirstTimeComplete = () => {
    // Start transition
    setShowTransition(true);
    setCurrentView('transition');
    
    // After transition, switch to enhanced login
    
  };

  const resetExperience = () => {
    localStorage.removeItem("hasVisitedBefore");
    setIsFirstTime(true);
    setCurrentView('first-time');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

   return (
    <>
      <ResetButton onReset={resetExperience} />
      
      <div className="relative min-h-screen">
        {/* First Time Login */}
        <div className={`transition-all duration-1000 ${
          currentView === 'first-time' ? 'opacity-100' : 'opacity-0 absolute inset-0'
        }`}>
          <FirstTimeLogin onComplete={handleFirstTimeComplete} />
        </div>

        {/* Transition Overlay */}
        {showTransition && (
          <TransitionOverlay />
        )}

        {/* Enhanced Login */}
        <div className={`transition-all duration-1000 ${
          currentView === 'enhanced' ? 'opacity-100' : 'opacity-0 absolute inset-0'
        }`}>
          <EnhancedLogin onLoginSuccess={onLoginSuccess} />
        </div>
      </div>
    </>
  );
}

// ResetButton.jsx (updated)
function ResetButton({ onReset }) {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key.toLowerCase() === "r") {
        onReset();
      }
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [onReset]);

  return (
    <div className="fixed top-2 right-2 z-50">
      
    </div>
  );
}

