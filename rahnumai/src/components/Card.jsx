// src/components/Card.jsx
import { useRef, useState, useCallback, memo } from 'react';
import { useThemeGlobal } from "@/components/ThemeProvider";

const Card = memo(({
  children,
  className = '',
  spotlightColor = 'rgba(249, 115, 22, 0.15)',
  animationDelay = 0,
  onClick,
  disableHover = false,
  elevation = 'medium'
}) => {
  const { theme } = useThemeGlobal();
  const darkMode = theme === 'dark';
  const divRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Throttled mouse move handler
  const handleMouseMove = useCallback((e) => {
    if (!divRef.current || disableHover) return;
    
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top 
    });
  }, [disableHover]);

  const handleMouseEnter = useCallback(() => {
    if (disableHover) return;
    setIsHovered(true);
  }, [disableHover]);

  const handleMouseLeave = useCallback(() => {
    if (disableHover) return;
    setIsHovered(false);
  }, [disableHover]);

  // Elevation presets
  const elevationStyles = {
    low: {
      shadow: darkMode 
        ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
        : '0 2px 8px rgba(0, 0, 0, 0.04)',
      hoverShadow: darkMode
        ? '0 8px 24px rgba(0, 0, 0, 0.3)'
        : '0 8px 24px rgba(0, 0, 0, 0.08)'
    },
    medium: {
      shadow: darkMode 
        ? '0 4px 16px rgba(0, 0, 0, 0.25)' 
        : '0 4px 16px rgba(0, 0, 0, 0.06)',
      hoverShadow: darkMode
        ? '0 12px 32px rgba(0, 0, 0, 0.35)'
        : '0 12px 32px rgba(0, 0, 0, 0.1)'
    },
    high: {
      shadow: darkMode 
        ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
        : '0 8px 32px rgba(0, 0, 0, 0.08)',
      hoverShadow: darkMode
        ? '0 20px 48px rgba(0, 0, 0, 0.4)'
        : '0 20px 48px rgba(0, 0, 0, 0.12)'
    }
  };

  const currentElevation = elevationStyles[elevation];

  const baseClasses = `relative rounded-xl overflow-hidden transition-all duration-200 ${
    darkMode
      ? 'border border-slate-700/50 bg-slate-800/90 backdrop-blur-sm text-white'
      : 'border border-slate-200 bg-white/95 backdrop-blur-sm text-slate-900'
  } ${className}`;

  return (
    <div
      ref={divRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={baseClasses}
      style={{
        animation: `fadeInUp 0.5s ease-out ${animationDelay}ms both`,
        transform: `translateY(${isHovered && !disableHover ? '-2px' : '0px'}) scale(${isHovered && !disableHover ? 1.02 : 1})`,
        boxShadow: isHovered && !disableHover
          ? `${currentElevation.hoverShadow}, 0 0 0 1px ${spotlightColor}`
          : currentElevation.shadow,
        transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out'
      }}
    >
      {/* Subtle spotlight effect - reduced opacity for better performance */}
      
      {children}
    </div>
  );
});

Card.displayName = 'Card';
export default Card;