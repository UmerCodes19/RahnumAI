import { useEffect, useRef, useState } from "react";
import { useThemeGlobal } from "@/components/ThemeProvider"; // Use useTheme instead of useThemeGlobal

const TypingBackground = () => {
  const { theme } = useThemeGlobal(); // Use useTheme hook
  const textRef = useRef(null);
  const texts = ["Welcome to RahnumAI", "AI-Powered Learning", "Boost Your Skills", "Personalized Courses"];
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fullText = texts[index];
      if (!deleting) {
        setDisplayed(fullText.substring(0, displayed.length + 1));
        if (displayed.length + 1 === fullText.length) setDeleting(true);
      } else {
        setDisplayed(fullText.substring(0, displayed.length - 1));
        if (displayed.length === 0) {
          setDeleting(false);
          setIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, deleting ? 80 : 150);
    return () => clearTimeout(timeout);
  }, [displayed, deleting, index, texts]);

  const textColor = theme === "dark" ? "text-white/20" : "text-black/10";

  return (
    <div
      ref={textRef}
      className={`absolute inset-x-0 top-20 flex items-center justify-center text-6xl font-bold pointer-events-none select-none whitespace-nowrap ${textColor}`}
      style={{ zIndex: 0 }}
    >
      {displayed}
      <span className="animate-blink">|</span>
      <style jsx>{`
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
        .animate-blink { animation: blink 1s infinite; }
      `}</style>
    </div>
  );
};

export default TypingBackground;