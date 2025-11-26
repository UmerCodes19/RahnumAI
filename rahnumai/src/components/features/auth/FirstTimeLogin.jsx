// FirstTimeLogin.jsx
import { useState } from "react";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TransitionOverlay from "./TransitionOverlay";

const roles = [
  { name: "Admission", cardColor: "#005F9C", buttonColor: "#FFFFFF", buttonTextColor: "#000000", buttonText: "Apply Online" },
  { name: "Student", cardColor: "#7A8C74", buttonColor: "#FFFFFF", buttonTextColor: "#000000", buttonText: "Sign In" },
  { name: "Faculty Member", cardColor: "#615C5C", buttonColor: "#FFFFFF", buttonTextColor: "#000000", buttonText: "Sign In" },
  { name: "Administration Staff", cardColor: "#34495E", buttonColor: "#FFFFFF", buttonTextColor: "#000000", buttonText: "Sign In" },
  { name: "Alumni", cardColor: "#009FBC", buttonColor: "#FFFFFF", buttonTextColor: "#000000", buttonText: "Sign In" },
];

export default function FirstTimeLogin({ onComplete }) {
  const navigate = useNavigate();
  const [cardsFading, setCardsFading] = useState(Array(roles.length).fill(false));
  const [fadeHeaderFooter, setFadeHeaderFooter] = useState(false);
  const [showBreakChains, setShowBreakChains] = useState(false);
  const [isVanishing, setIsVanishing] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleCardHover = (index) => {
    if (isVanishing) return;

    const newFade = [...cardsFading];
    newFade[index] = true;
    setCardsFading(newFade);

    if (newFade.every((fade) => fade)) {
      setIsVanishing(true);
      setTimeout(() => setFadeHeaderFooter(true), 300);
      setTimeout(() => setShowBreakChains(true), 1200);
    }
  };

const handleBookClick = () => {
  setShowOverlay(true);
  setTimeout(() => {
    navigate("/landing");
  }, 800);
};
  return (
    <div className={`min-h-screen flex flex-col bg-gray-100 transition-all duration-1000 ${
      fadeHeaderFooter ? "bg-gray-900" : ""
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
          <div className="flex flex-col items-center space-y-6">
            <button className="text-6xl font-bold text-white bg-transparent border-4 border-white px-12 py-8 rounded-lg cursor-not-allowed select-none transition-all duration-500">
              Ready to break the chains?
            </button>
            <BookOpen
              size={80}
              className="cursor-pointer text-white hover:text-cyan-300 transition-all duration-300 transform hover:scale-110 z-20 relative"
              onClick={handleBookClick}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-y-6 gap-x-20 w-full max-w-4xl">
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
                  className="rounded-sm p-8 shadow-lg text-white text-center w-150 h-35 flex flex-col justify-center items-center transition-all duration-1000 hover:shadow-xl hover:scale-105"
                  style={{ backgroundColor: role.cardColor }}
                >
                  <div className="text-4xl transition-all duration-1000">
                    <h1 className="font-bold">{role.name}</h1>
                  </div>
                  <button
                    className={`flex items-center justify-center font-semibold shadow-md mt-4 transition-all duration-150 ${
                      isVanishing ? "pointer-events-none opacity-50" : "hover:scale-105"
                    }`}
                    style={{
                      backgroundColor: role.buttonColor,
                      color: role.buttonTextColor,
                      marginTop: "15px",
                      borderRadius: "4px",
                      width: "90px",
                      height: "35px",
                      fontSize: "13px",
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
        2025 © <a href="https://baRhria.edu.pk/" target="_blank" rel="noreferrer" className="underline">Bahria University</a>
      </footer>

{showOverlay && (
  <TransitionOverlay 
    show={showOverlay} 
    onComplete={onComplete}
  />
)}
    </div>
  );
}