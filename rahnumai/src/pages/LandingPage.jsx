import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import ThemeToggle from '@/components/common/theme/ThemeToggle';
import ColorBends from '@/components/visual/ColorBends'; // Make sure path is correct

import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';
import {
  Rocket,
  Brain,
  Users,
  BookOpen,
  Award,
  Globe,
  CheckCircle,
  Cpu,
  Database,
  Cloud,
  Server,
  MessageCircle,
  BarChart3,
  ArrowRight,
  Zap,
  Shield,
  Sparkles,
  Target,
  Lightbulb,
  Network,
  Code
} from "lucide-react";

import { Button } from "@/components/common/ui/buttons/button";

// Color scheme matching the transition overlay
const COLOR_SCHEME = {
  primary: "#f97316",    // Orange
  secondary: "#eab308",  // Amber
  accent: "#8311f2",     // Purple
  dark: "#0f172a",       // Slate-900
  light: "#f8fafc",      // Slate-50
};

const COLOR_BENDS = ["#f97316", "#eab308", "#8311f2", "#3b82f6", "#10b981"];

const CinematicBackground = ({ darkMode }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient overlays */}
      <motion.div
        className={`absolute inset-0 ${
          darkMode 
            ? "bg-gradient-to-br from-gray-900 via-black to-gray-800" 
            : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
        }`}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Soft animated sweep */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className={`w-full h-full ${
            darkMode 
              ? "bg-gradient-to-r from-transparent via-blue-500 to-transparent" 
              : "bg-gradient-to-r from-transparent via-orange-400 to-transparent"
          }`}
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Subtle grid */}
      <div className={`absolute inset-0 ${darkMode ? "opacity-[0.02]" : "opacity-[0.03]"}`}>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px),
            linear-gradient(90deg, ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />
      </div>
    </div>
  );
};

const TextGlow = ({ children, className = "", darkMode = true }) => {
  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute inset-0 blur-lg opacity-50"
        style={{
          background: "inherit",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {children}
      </div>
      {children}
    </div>
  );
};

export default function LandingPage() {
  const { theme } = useThemeGlobal();
  const darkMode = theme === "dark";
  const [activeSection, setActiveSection] = useState("home");
  const [navState, setNavState] = useState("docked");
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollY } = useScroll();

  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true });

  // Navbar scroll behavior
  useMotionValueEvent(scrollY, "change", (latest) => {
    const scrollingDown = latest > lastScrollY;
    const scrolledPastHero = latest > 100;

    if (scrollingDown && scrolledPastHero) {
      setNavState("scrolled");
    } else if (!scrollingDown && scrolledPastHero) {
      setNavState("docked");
    } else if (latest <= 100) {
      setNavState("docked");
    }

    setLastScrollY(latest);
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "stats", "features", "cta"];
      const current = sections.find((section) => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navVariants = {
    docked: {
      y: 0,
      backdropFilter: "blur(16px)",
      backgroundColor: darkMode ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.9)",
      borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    },
    scrolled: {
      y: 0,
      backdropFilter: "blur(20px)",
      backgroundColor: darkMode ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
      borderColor: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
    }
  };

  // Text colors for light/dark mode
  const textColors = {
    primary: darkMode ? "text-white" : "text-gray-900",
    secondary: darkMode ? "text-blue-300" : "text-blue-600",
    muted: darkMode ? "text-slate-400" : "text-gray-600",
  };

  const borderColors = {
    light: darkMode ? "border-slate-700/30" : "border-gray-200/50",
    medium: darkMode ? "border-slate-600/50" : "border-gray-300",
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-hidden ${
      darkMode ? "dark bg-gray-900" : "bg-white"
    }`}>
      
      {/* Cinematic Background */}
      <div className="fixed inset-0">
        <ColorBends
          colors={COLOR_BENDS}
          speed={0.2}
          rotation={45}
          scale={1.2}
          frequency={1.5}
          warpStrength={1.2}
          mouseInfluence={0.5}
          parallax={0.3}
          noise={0.05}
          transparent={true}
        />
      </div>

      {/* Navigation - Minimal and Professional */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 border-b ${
          darkMode ? "border-slate-700/50" : "border-gray-200/50"
        }`}
        variants={navVariants}
        initial="docked"
        animate={navState}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Brain className="w-5 h-5 text-white" />
              </motion.div>
              <motion.span
                className={`text-2xl font-bold uppercase tracking-tight ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
                style={{
                  textShadow: darkMode 
                    ? "2px 2px 15px rgba(0,0,0,0.8), 0 0 30px rgba(59,130,246,0.3)"
                    : "2px 2px 15px rgba(0,0,0,0.1)",
                  fontFamily: "'Inter','Arial',sans-serif",
                }}
              >
                RahnumAI
              </motion.span>
            </motion.div>

            {/* Navigation Items */}
            <motion.div
              className="hidden md:flex items-center space-x-8"
            >
              {["home", "stats", "features", "cta"].map((id) => (
                <motion.a
                  key={id}
                  href={`#${id}`}
                  className={`font-semibold uppercase tracking-wide relative px-3 py-2 transition-colors ${
                    activeSection === id
                      ? "text-orange-500"
                      : darkMode
                      ? "text-slate-300 hover:text-orange-400"
                      : "text-gray-700 hover:text-orange-600"
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                  {activeSection === id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                      layoutId="activeNavUnderline"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.a>
              ))}
            </motion.div>

            {/* Right Side */}
            <motion.div
              className="flex items-center space-x-4"
            >
              <ThemeToggle />
              <Link to="/login">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold uppercase tracking-wide"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Add padding to account for navbar */}
      <div className="pt-20"></div>

      {/* Hero Section - Cinematic Style */}
      <section id="home" ref={heroRef} className="relative min-h-screen flex items-center justify-center">
        <CinematicBackground darkMode={darkMode} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2 }}
          >
            {/* Main Title */}
            <TextGlow darkMode={darkMode}>
              <motion.h1
                className={`text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight mb-8 leading-tight ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
                style={{
                  fontFamily: "'Inter','Arial',sans-serif",
                }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                WELCOME TO
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  RAHNUM AI
                </span>
              </motion.h1>
            </TextGlow>

            {/* Subtitle */}
            <motion.p
              className={`text-xl md:text-2xl uppercase tracking-wide font-light mb-12 max-w-3xl mx-auto ${
                darkMode ? "text-blue-300" : "text-blue-600"
              }`}
              style={{
                textShadow: darkMode ? "1px 1px 8px rgba(0,0,0,0.6)" : "none",
                fontFamily: "'Inter','Arial',sans-serif",
              }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.3 }}
            >
              Built for Educators. Designed with purpose. Powered by intelligence.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/login">
                <Button 
                  size="xl" 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold uppercase tracking-wide group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Start Learning Free</span>
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button 
                size="xl" 
                variant="outline"
                className={`${
                  darkMode 
                    ? "border-white/30 text-white hover:bg-white/10" 
                    : "border-gray-700 text-gray-700 hover:bg-gray-100"
                } font-semibold uppercase tracking-wide`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap className="mr-2" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Clean and Professional */}
      <section id="stats" ref={statsRef} className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="initial"
            animate={statsInView ? "animate" : "initial"}
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
          >
            {[
              { icon: Users, number: 100000, suffix: "+", label: "Active Learners" },
              { icon: BookOpen, number: 5000, suffix: "+", label: "Courses" },
              { icon: Award, number: 99, suffix: "%", label: "Success Rate" },
              { icon: Globe, number: 150, suffix: "+", label: "Countries" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: "spring" }}
              >
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <stat.icon className="w-10 h-10 text-white" />
                </motion.div>
                <div 
                  className={`text-4xl md:text-5xl font-black mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                  style={{
                    textShadow: darkMode 
                      ? "2px 2px 15px rgba(0,0,0,0.8), 0 0 30px rgba(59,130,246,0.3)"
                      : "2px 2px 15px rgba(0,0,0,0.1)",
                  }}
                >
                  {stat.number}{stat.suffix}
                </div>
                <p className={`${
                  darkMode ? "text-blue-300" : "text-blue-600"
                } uppercase tracking-wide font-light`}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section - Professional Layout */}
      <section id="features" ref={featuresRef} className="relative py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <TextGlow darkMode={darkMode}>
              <h2 
                className={`text-5xl md:text-6xl font-black uppercase tracking-tight mb-6 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
                style={{
                  textShadow: darkMode 
                    ? "2px 2px 15px rgba(0,0,0,0.8), 0 0 30px rgba(59,130,246,0.3)"
                    : "2px 2px 15px rgba(0,0,0,0.1)",
                  fontFamily: "'Inter','Arial',sans-serif",
                }}
              >
                EVERYTHING YOU NEED
              </h2>
            </TextGlow>
            <p 
              className={`text-xl md:text-2xl uppercase tracking-wide font-light max-w-3xl mx-auto ${
                darkMode ? "text-blue-300" : "text-blue-600"
              }`}
              style={{
                textShadow: darkMode ? "1px 1px 8px rgba(0,0,0,0.6)" : "none",
              }}
            >
              Packed with cutting-edge technology to transform your learning experience
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="initial"
            animate={featuresInView ? "animate" : "initial"}
          >
            {[
              {
                icon: Cpu,
                title: "Neural AI Engine",
                description: "Adaptive AI for real-time personalized learning paths and intelligent recommendations.",
                color: "#f59e0b"
              },
              {
                icon: Database,
                title: "Smart Analytics",
                description: "Predictive performance insights with detailed progress tracking and reporting.",
                color: "#ef4444"
              },
              {
                icon: Cloud,
                title: "Cloud Native",
                description: "Seamless synchronization across all devices with enterprise-grade reliability.",
                color: "#8b5cf6"
              },
              {
                icon: Server,
                title: "Enterprise Grade",
                description: "Military-grade security with 99.9% uptime guarantee and SLA protection.",
                color: "#10b981"
              },
              {
                icon: MessageCircle,
                title: "Live Collaboration",
                description: "Real-time collaboration tools for interactive learning and team projects.",
                color: "#3b82f6"
              },
              {
                icon: BarChart3,
                title: "Progress Wizard",
                description: "AI-powered recommendations with goal setting and achievement tracking.",
                color: "#f97316"
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`backdrop-blur-sm border rounded-xl p-8 hover:border-orange-400/50 transition-all duration-300 ${
                  darkMode 
                    ? "bg-gradient-to-br from-gray-900/50 to-black/50 border-slate-700/30" 
                    : "bg-white/80 border-gray-200/50 shadow-lg"
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: feature.color }}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 
                  className={`text-2xl font-bold uppercase tracking-tight mb-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                  style={{
                    textShadow: darkMode ? "2px 2px 15px rgba(0,0,0,0.8)" : "none",
                    fontFamily: "'Inter','Arial',sans-serif",
                  }}
                >
                  {feature.title}
                </h3>
                <p className={`leading-relaxed font-light ${
                  darkMode ? "text-blue-300" : "text-gray-600"
                }`}>
                  {feature.description}
                </p>
                <div className={`mt-6 pt-6 border-t ${
                  darkMode ? "border-slate-700/30" : "border-gray-200"
                }`}>
                  <div className="flex items-center space-x-3 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full animate-pulse"
                      style={{ backgroundColor: feature.color }}
                    />
                    <span className={`uppercase tracking-wide ${
                      darkMode ? "text-slate-400" : "text-gray-500"
                    }`}>
                      ACTIVE FEATURE
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Cinematic */}
      <section id="cta" ref={ctaRef} className="relative py-32">
        <CinematicBackground darkMode={darkMode} />
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <TextGlow darkMode={darkMode}>
              <motion.h2
                className={`text-5xl md:text-6xl font-black uppercase tracking-tight mb-8 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
                style={{
                  textShadow: darkMode 
                    ? "2px 2px 15px rgba(0,0,0,0.8), 0 0 30px rgba(59,130,246,0.3)"
                    : "2px 2px 15px rgba(0,0,0,0.1)",
                  fontFamily: "'Inter','Arial',sans-serif",
                }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                READY TO TRANSFORM
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  LEARNING?
                </span>
              </motion.h2>
            </TextGlow>

            <motion.p
              className={`text-xl md:text-2xl uppercase tracking-wide font-light mb-12 max-w-3xl mx-auto ${
                darkMode ? "text-blue-300" : "text-blue-600"
              }`}
              style={{
                textShadow: darkMode ? "1px 1px 8px rgba(0,0,0,0.6)" : "none",
              }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.3 }}
            >
              Join thousands of learners worldwide and unlock your potential with AI-powered education.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/login">
                <Button 
                  size="xl" 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold uppercase tracking-wide group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button 
                size="xl" 
                variant="outline"
                className={`${
                  darkMode 
                    ? "border-white/30 text-white hover:bg-white/10" 
                    : "border-gray-700 text-gray-700 hover:bg-gray-100"
                } font-semibold uppercase tracking-wide`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className={`relative py-12 border-t ${
        darkMode ? "border-slate-700/30" : "border-gray-200"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span 
                className={`text-xl font-bold uppercase tracking-tight ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
                style={{
                  textShadow: darkMode ? "2px 2px 15px rgba(0,0,0,0.8)" : "none",
                  fontFamily: "'Inter','Arial',sans-serif",
                }}
              >
                RahnumAI
              </span>
            </div>
            <div className="flex gap-6">
              {["Privacy", "Terms", "Contact"].map((item) => (
                <motion.a
                  key={item}
                  href="#"
                  className={`hover:text-orange-500 transition-colors uppercase tracking-wide text-sm font-light ${
                    darkMode ? "text-slate-400" : "text-gray-600"
                  }`}
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
          <div className={`mt-8 pt-8 border-t ${
            darkMode ? "border-slate-700/30" : "border-gray-200"
          } text-center`}>
            <p className={`uppercase tracking-wide text-sm font-light ${
              darkMode ? "text-slate-500" : "text-gray-500"
            }`}>
              © 2025 RahnumAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}