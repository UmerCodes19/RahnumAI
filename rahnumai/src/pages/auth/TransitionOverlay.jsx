import { useEffect, useState } from "react";

export default function TransitionOverlay({ show, onComplete }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    // Only run if show is true and we haven't completed yet
    if (show && !hasCompleted) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Call onComplete after animation finishes
        setTimeout(() => {
          onComplete?.();
          setHasCompleted(true); // Mark as completed to prevent re-triggering
        }, 600);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete, hasCompleted]);

  // Don't render if not showing and not visible, OR if we've completed
  if ((!show && !isVisible) || hasCompleted) return null;

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-1000 ease-in-out ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      {/* Animated background */}
      <div className={`absolute inset-0 transition-all duration-1000 ease-out ${
        isVisible ? 'bg-black/80' : 'bg-black/0'
      }`}></div>
      
      {/* Central animated element */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-64 h-64 bg-cyan-400/20 rounded-full filter blur-3xl transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-60 scale-100' : 'opacity-0 scale-150'
        }`}></div>
      </div>

      {/* Optional: Add a loading spinner or text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`text-white text-2xl font-bold transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
            Upgrading LMS...
        </div>
      </div>
    </div>
  );
}