import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import ThemeToggle from '@/components/common/theme/ThemeToggle';
import ColorBends from '@/components/visual/ColorBends';
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
  Code,
  Menu,
  X
} from "lucide-react";

import { Button } from "@/components/common/ui/buttons/button";

const COLOR_SCHEME = {
  primary: "#f97316",
  secondary: "#eab308",
  accent: "#8311f2",
  dark: "#0f172a",
  light: "#f8fafc",
};

const COLOR_BENDS = ["#f97316", "#eab308", "#8311f2", "#3b82f6", "#10b981"];

const CinematicBackground = ({ darkMode }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true });

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

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-hidden ${
      darkMode ? "dark bg-gray-900" : "bg-white"
    }`}>
      
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

      {/* Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 border-b ${
          darkMode ? "border-slate-700/50" : "border-gray-200/50"
        }`}
        variants={navVariants}
        initial="docked"
        animate={navState}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container-responsive">
          <div className="flex items-center justify-between py-4">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Brain className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </motion.div>
              <motion.span
                className={`text-xl lg:text-2xl font-bold uppercase tracking-tight ${
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

            {/* Desktop Navigation */}
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

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg touch-button"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <ThemeToggle />
              <Link to="/login" className="hidden md:block">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold uppercase tracking-wide touch-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          <motion.div
            className={`md:hidden border-t ${darkMode ? "border-slate-700/30" : "border-gray-200/50"} ${
              mobileMenuOpen ? "block" : "hidden"
            }`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: mobileMenuOpen ? "auto" : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="py-4 space-y-4">
              {["home", "stats", "features", "cta"].map((id) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`block py-2 font-semibold uppercase tracking-wide transition-colors ${
                    activeSection === id
                      ? "text-orange-500"
                      : darkMode
                      ? "text-slate-300 hover:text-orange-400"
                      : "text-gray-700 hover:text-orange-600"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </a>
              ))}
              <Link to="/login" className="block">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold uppercase tracking-wide touch-button"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      <div className="pt-20"></div>

      {/* Hero Section */}
      <section id="home" ref={heroRef} className="relative min-h-screen flex items-center justify-center">
        <CinematicBackground darkMode={darkMode} />
        <div className="container-responsive text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2 }}
          >
            <TextGlow darkMode={darkMode}>
              <motion.h1
                className={`heading-responsive font-black uppercase tracking-tight mb-6 lg:mb-8 leading-tight ${
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

            <motion.p
              className={`subheading-responsive uppercase tracking-wide font-light mb-8 lg:mb-12 max-w-3xl mx-auto ${
                darkMode ? "text-blue-300" : "text-blue-600"
              } mobile-text-center`}
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

            <motion.div
              className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center mobile-stack mobile-gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/login" className="w-full sm:w-auto">
                <Button 
                  size="xl" 
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold uppercase tracking-wide group touch-button"
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
                className={`w-full sm:w-auto ${
                  darkMode 
                    ? "border-white/30 text-white hover:bg-white/10" 
                    : "border-gray-700 text-gray-700 hover:bg-gray-100"
                } font-semibold uppercase tracking-wide touch-button`}
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

      {/* Stats Section */}
      <section id="stats" ref={statsRef} className="relative py-16 lg:py-24">
        <div className="container-responsive">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
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
                  className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 lg:mb-6 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <stat.icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </motion.div>
                <div 
                  className={`text-2xl lg:text-4xl xl:text-5xl font-black mb-2 ${
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
                <p className={`text-sm lg:text-base ${
                  darkMode ? "text-blue-300" : "text-blue-600"
                } uppercase tracking-wide font-light mobile-text-center`}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="relative py-16 lg:py-32">
        <div className="container-responsive">
          <motion.div
            className="text-center mb-12 lg:mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <TextGlow darkMode={darkMode}>
              <h2 
                className={`heading-responsive font-black uppercase tracking-tight mb-6 ${
                  darkMode ? "text-white" : "text-gray-900"
                } mobile-text-center`}
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
              className={`subheading-responsive uppercase tracking-wide font-light max-w-3xl mx-auto ${
                darkMode ? "text-blue-300" : "text-blue-600"
              } mobile-text-center`}
              style={{
                textShadow: darkMode ? "1px 1px 8px rgba(0,0,0,0.6)" : "none",
              }}
            >
              Packed with cutting-edge technology to transform your learning experience
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
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
                className={`backdrop-blur-sm border rounded-xl p-6 lg:p-8 hover:border-orange-400/50 transition-all duration-300 ${
                  darkMode 
                    ? "bg-gradient-to-br from-gray-900/50 to-black/50 border-slate-700/30" 
                    : "bg-white/80 border-gray-200/50 shadow-lg"
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div 
                  className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center mb-4 lg:mb-6"
                  style={{ backgroundColor: feature.color }}
                >
                  <feature.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <h3 
                  className={`text-xl lg:text-2xl font-bold uppercase tracking-tight mb-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                  style={{
                    textShadow: darkMode ? "2px 2px 15px rgba(0,0,0,0.8)" : "none",
                    fontFamily: "'Inter','Arial',sans-serif",
                  }}
                >
                  {feature.title}
                </h3>
                <p className={`text-responsive leading-relaxed font-light ${
                  darkMode ? "text-blue-300" : "text-gray-600"
                }`}>
                  {feature.description}
                </p>
                <div className={`mt-4 lg:mt-6 pt-4 lg:pt-6 border-t ${
                  darkMode ? "border-slate-700/30" : "border-gray-200"
                }`}>
                  <div className="flex items-center space-x-3 text-sm">
                    <div 
                      className="w-2 h-2 lg:w-3 lg:h-3 rounded-full animate-pulse"
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

      {/* CTA Section */}
      <section id="cta" ref={ctaRef} className="relative py-16 lg:py-32">
        <CinematicBackground darkMode={darkMode} />
        <div className="container-responsive text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <TextGlow darkMode={darkMode}>
              <motion.h2
                className={`heading-responsive font-black uppercase tracking-tight mb-6 lg:mb-8 ${
                  darkMode ? "text-white" : "text-gray-900"
                } mobile-text-center`}
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
              className={`subheading-responsive uppercase tracking-wide font-light mb-8 lg:mb-12 max-w-3xl mx-auto ${
                darkMode ? "text-blue-300" : "text-blue-600"
              } mobile-text-center`}
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
              className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center mobile-stack mobile-gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/login" className="w-full sm:w-auto">
                <Button 
                  size="xl" 
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold uppercase tracking-wide group touch-button"
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
                className={`w-full sm:w-auto ${
                  darkMode 
                    ? "border-white/30 text-white hover:bg-white/10" 
                    : "border-gray-700 text-gray-700 hover:bg-gray-100"
                } font-semibold uppercase tracking-wide touch-button`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative py-8 lg:py-12 border-t ${
        darkMode ? "border-slate-700/30" : "border-gray-200"
      }`}>
        <div className="container-responsive">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mobile-stack mobile-gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                <Brain className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
              </div>
              <span 
                className={`text-lg lg:text-xl font-bold uppercase tracking-tight ${
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
            <div className="flex gap-4 lg:gap-6 mobile-stack mobile-gap-4">
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
          <div className={`mt-6 lg:mt-8 pt-6 lg:pt-8 border-t ${
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