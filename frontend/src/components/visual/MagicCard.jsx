import { useRef, useState } from 'react';

const Card = ({ 
  children, 
  className = '', 
  spotlightColor = 'rgba(16, 185, 129, 0.3)', 
  darkMode = false, 
  animationDelay = 0, 
  onClick,
  disableHover = false 
}) => {

  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [scale, setScale] = useState(1);
  const [outlineOpacity, setOutlineOpacity] = useState(0);
  const [outlineScale, setOutlineScale] = useState(1);

  const handleMouseMove = e => {
    if (!divRef.current || isFocused || disableHover) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    if (disableHover) return;
    setIsFocused(true);
    setOpacity(0.8);
    animateOutlineAndScale(true);
  };

  const handleBlur = () => {
    if (disableHover) return;
    setIsFocused(false);
    setOpacity(0);
    animateOutlineAndScale(false);
  };

  const handleMouseEnter = () => {
    if (disableHover) return;
    setIsHovered(true);
    setOpacity(0.8);
    animateOutlineAndScale(true);
  };

  const handleMouseLeave = () => {
    if (disableHover) return;
    setIsHovered(false);
    setOpacity(0);
    animateOutlineAndScale(false);
  };

  const animateOutlineAndScale = (active) => {
    if (disableHover) return;
    
    if (active) {
      setOutlineOpacity(0);
      setOutlineScale(0.95);
      
      setTimeout(() => {
        setOutlineOpacity(1);
        setOutlineScale(1);
      }, 50);
      
      setScale(1);
      setTimeout(() => setScale(1.05), 100);
    } else {
      setOutlineOpacity(1);
      setOutlineScale(1);
      
      setTimeout(() => {
        setOutlineOpacity(0);
        setOutlineScale(0.95);
      }, 50);
      
      setScale(1.05);
      setTimeout(() => setScale(1), 150);
    }
  };

  const isActive = (isHovered || isFocused) && !disableHover;

  return (
    <div
      ref={divRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl overflow-hidden p-8 transition-all duration-500 ease-out ${
        darkMode ? 'border border-white/20 bg-transparent backdrop-blur-sm' : 'border border-black/20 bg-transparent backdrop-blur-sm'
      } ${className}`}
      style={{
        animation: `cardEntrance 0.6s ease-out ${animationDelay}ms both`,
        transform: `scale(${scale}) translateY(${isHovered && !disableHover ? '-8px' : '0px'})`,
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease-out, width 0.5s cubic-bezier(0.4, 0, 0.2, 1), height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isHovered && !disableHover
          ? darkMode
            ? `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px ${spotlightColor}`
            : `0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px ${spotlightColor}`
          : darkMode
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Animated outline border */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          opacity: outlineOpacity,
          transform: `scale(${outlineScale})`,
          transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `0 0 0 2px ${spotlightColor}`,
        }}
      />
      
      {/* Animated border gradient */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500"
          style={{
            opacity: 1,
            background: `linear-gradient(45deg, ${spotlightColor}20, transparent, ${spotlightColor}20)`,
            animation: 'borderPulse 2s ease-in-out infinite',
          }}
        />
      )}
      
      {/* Spotlight effect */}
      {isActive && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-in-out"
          style={{
            opacity,
            background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}30, transparent 80%)`
          }}
        />
      )}
      
      {/* Breathing animation background */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-3xl opacity-10"
          style={{
            background: spotlightColor,
            animation: 'breathing 4s ease-in-out infinite',
          }}
        />
      )}
      
      {/* AI Glow Effect */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${spotlightColor}15, transparent 70%)`,
            animation: 'pulseGlow 2s ease-in-out infinite',
          }}
        />
      )}
      
      {children}
      
      <style jsx>{`
        @keyframes breathing {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }
        
        @keyframes cardEntrance {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        
        @keyframes borderPulse {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(1);
          }
          50% { 
            opacity: 0.7;
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
};

export default Card;