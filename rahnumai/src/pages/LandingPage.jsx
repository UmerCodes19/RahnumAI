import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Aurora from "@/components/visual/Aurora";
import ThemeToggle from '@/components/common/theme/ThemeToggle';
import { useThemeGlobal } from '@/components/common/theme/ThemeProvider';
import {
  Rocket,
  Sparkles as SparklesIcon,
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
} from "lucide-react";

import { Button } from "@/components/common/ui/buttons/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/common/ui/cards/landingcard";
import { BackgroundBeams } from "@/components/common/ui/effects/background-beams";
import { Sparkles } from "@/components/common/ui/effects/sparkles";
import { TextGenerateEffect } from "@/components/common/ui/effects/text-generate-effect";
import { WavyBackground } from "@/components/common/ui/effects/wavy-background";
import { NumberTicker } from "@/components/common/ui/utils/NumberTicker";
import { TypewriterEffect } from "@/components/common/ui/effects/TypewriterEffect";

const COLOR_SCHEME = {
  primary: "#f97316",
  secondary: "#eab308",
  accent: "#8311f2",
};

const fadeInUp = {
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.8 } },
};
const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.6 } },
};
const staggerContainer = { animate: { transition: { staggerChildren: 0.1 } } };

export default function LandingPage() {
  const { theme } = useThemeGlobal();
  const darkMode = theme === "dark";
  const [showBG, setShowBG] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [navState, setNavState] = useState("docked"); // "docked" | "scrolled" | "hidden"
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollY } = useScroll();

  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const pricingRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const pricingInView = useInView(pricingRef, { once: true, margin: "-100px" });
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

  // Update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "stats", "features", "pricing", "cta"];
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

  useEffect(() => {
    setTimeout(() => setShowBG(true), 300);
  }, []);

  const typingWords = [
    { text: "AI-Powered", className: "text-orange-500" },
    { text: "Personalized", className: "text-amber-500" },
    { text: "Interactive", className: "text-purple-500" },
    { text: "Revolutionary", className: "text-red-500" },
  ];

  // Navbar variants for different states
  const navVariants = {
    docked: {
      y: 0,
      width: "100%",
      borderRadius: 0,
      backdropFilter: "blur(16px)",
      backgroundColor: darkMode ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.9)",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    scrolled: {
      y: 20,
      width: "90%",
      borderRadius: 20,
      backdropFilter: "blur(20px)",
      backgroundColor: darkMode ? "rgba(15, 23, 42, 0.7)" : "rgba(255, 255, 255, 0.7)",
      transition: { type: "spring", stiffness: 400, damping: 35 }
    }
  };

  const logoVariants = {
    docked: { scale: 1 },
    scrolled: { scale: 0.9 }
  };

  const navItemsVariants = {
    docked: { opacity: 1, x: 0 },
    scrolled: { opacity: 1, x: 0 }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 overflow-hidden ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Background Effects */}
      <div
        className={`fixed inset-0 transition-opacity duration-1500 ${
          showBG ? "opacity-100" : "opacity-0"
        }`}
      >
        <Aurora
          colorStops={[COLOR_SCHEME.primary, COLOR_SCHEME.secondary, COLOR_SCHEME.accent]}
          blend={0.8}
          amplitude={1.2}
          speed={0.3}
        />
        <BackgroundBeams />
      </div>

      {/* Navigation */}
      <motion.nav
        className={`fixed z-50 left-1/2 transform -translate-x-1/2 border ${
          darkMode ? "border-slate-700/50" : "border-slate-200/50"
        } shadow-2xl`}
        variants={navVariants}
        initial="docked"
        animate={navState}
        style={{ 
          top: 0,
          maxWidth: "1400px"
        }}
      >
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              variants={logoVariants}
            >
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Rocket className="w-5 h-5 text-white" />
              </motion.div>
              <Sparkles>
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  RahnumAI
                </span>
              </Sparkles>
            </motion.div>

            {/* Navigation Items */}
            <motion.div
              className="hidden md:flex items-center space-x-8"
              variants={navItemsVariants}
            >
              {["home", "stats", "features", "pricing", "cta"].map((id) => (
                <motion.a
                  key={id}
                  href={`#${id}`}
                  className={`font-semibold relative px-3 py-2 rounded-lg transition-colors ${
                    activeSection === id
                      ? "text-orange-500 bg-orange-500/10"
                      : darkMode
                      ? "text-slate-300 hover:text-orange-400 hover:bg-slate-800/50"
                      : "text-slate-700 hover:text-orange-600 hover:bg-slate-100/50"
                  }`}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                  {activeSection === id && (
                    <motion.div
                      className="absolute inset-0 border border-orange-500/30 rounded-lg"
                      layoutId="activeNavBackground"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.a>
              ))}
            </motion.div>

            {/* Right Side - Theme Toggle and CTA */}
            <motion.div
              className="flex items-center space-x-4"
              variants={navItemsVariants}
            >
              <ThemeToggle />
              <Link to="/login">
                <Button 
                  size="lg" 
                  className="relative overflow-hidden group bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Get Started</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Add padding to account for navbar */}
      <div className="pt-20"></div>

      {/* Hero Section */}
      <section id="home" ref={heroRef} className="relative min-h-screen flex items-center justify-center">
        <WavyBackground
          colors={[COLOR_SCHEME.primary, COLOR_SCHEME.secondary, COLOR_SCHEME.accent]}
          waveOpacity={0.3}
          blur={8}
          speed="fast"
        >
          <motion.div
            className="text-center max-w-6xl mx-auto px-4 relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <TextGenerateEffect
              words="Welcome to the Future of Education"
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
            />
            <TypewriterEffect
              words={typingWords}
              className="text-2xl md:text-3xl font-bold mb-4"
              cursorClassName="bg-orange-500"
            />
            <motion.p
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Revolutionize learning with AI-powered personalized education, intelligent analytics, and seamless collaboration in one epic platform.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={fadeInUp}>
                <Link to="/login">
                  <Button size="xl" variant="gradient" className="group">
                    <span>Start Learning Free</span>
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Button size="xl" variant="neon" className="group">
                  <SparklesIcon className="mr-2" /> Watch Demo
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </WavyBackground>
      </section>

      {/* Stats Section */}
      <section id="stats" ref={statsRef} className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate={statsInView ? "animate" : "initial"}
          >
            {[
              { icon: Users, number: 100000, suffix: "+", label: "Active Learners" },
              { icon: BookOpen, number: 5000, suffix: "+", label: "Courses" },
              { icon: Award, number: 99, suffix: "%", label: "Success Rate" },
              { icon: Globe, number: 150, suffix: "+", label: "Countries" },
            ].map((stat, index) => (
              <motion.div key={index} variants={fadeInUp} className="text-center group">
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <stat.icon className="w-10 h-10 text-white" />
                </motion.div>
                <div className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  <NumberTicker value={stat.number} />
                  {stat.suffix}
                </div>
                <p className="text-slate-300 font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="relative py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 30 }} animate={featuresInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
            <Sparkles>
              <h2 className="text-5xl md:text-6xl font-black mb-6">
                <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 bg-clip-text text-transparent">
                  Everything You Need
                </span>
              </h2>
            </Sparkles>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-slate-600 dark:text-slate-300">
              Packed with cutting-edge technology to transform your learning experience
            </p>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={staggerContainer} initial="initial" animate={featuresInView ? "animate" : "initial"}>
            {[
              {
                icon: Cpu,
                title: "Neural AI Engine",
                description: "Adaptive AI for real-time personalized learning.",
                gradient: "from-purple-500 to-pink-500",
                features: ["Real-time adaptation", "Personalized paths", "Smart recommendations"],
              },
              {
                icon: Database,
                title: "Smart Analytics",
                description: "Predictive performance insights.",
                gradient: "from-blue-500 to-cyan-500",
                features: ["Progress tracking", "Performance predictions", "Detailed reports"],
              },
              {
                icon: Cloud,
                title: "Cloud Native",
                description: "Access anywhere, seamless sync.",
                gradient: "from-green-500 to-emerald-500",
                features: ["Cross-device sync", "Offline access", "Auto backups"],
              },
              {
                icon: Server,
                title: "Enterprise Grade",
                description: "Military-grade security & 99.9% uptime.",
                gradient: "from-red-500 to-orange-500",
                features: ["Bank-level security", "High availability", "SLA guarantee"],
              },
              {
                icon: MessageCircle,
                title: "Live Collaboration",
                description: "Real-time collaboration tools.",
                gradient: "from-indigo-500 to-purple-500",
                features: ["Video conferencing", "Shared workspace", "Real-time editing"],
              },
              {
                icon: BarChart3,
                title: "Progress Wizard",
                description: "AI-powered recommendations.",
                gradient: "from-yellow-500 to-amber-500",
                features: ["Goal setting", "Milestone tracking", "Achievement system"],
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp} whileHover={{ scale: 1.05, y: -10 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="h-full backdrop-blur-sm border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <CardHeader className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl bg-gradient-to-br from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <ul className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center space-x-3 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* Pricing Section */}
      <section id="pricing" ref={pricingRef} className="relative py-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 30 }} animate={pricingInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/20 backdrop-blur-sm mb-6">
              <SparklesIcon className="w-4 h-4 mr-2 text-orange-500" /> Plans for Everyone
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
              Choose Your Path
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Flexible plans for individuals, teams, and enterprises.
            </p>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={staggerContainer} initial="initial" animate={pricingInView ? "animate" : "initial"}>
            {[
              { title: "Starter", price: "$0", features: ["Access to courses", "Community support"], gradient: "from-orange-400 to-amber-400" },
              { title: "Pro", price: "$49/mo", features: ["Everything in Starter", "AI Learning Assistant", "Analytics Dashboard"], gradient: "from-purple-500 to-pink-500" },
              { title: "Enterprise", price: "$199/mo", features: ["Everything in Pro", "Dedicated Support", "Custom Solutions"], gradient: "from-blue-500 to-cyan-500" },
            ].map((plan, idx) => (
              <motion.div key={idx} variants={fadeInUp} whileHover={{ scale: 1.05, y: -5 }}>
                <Card className="backdrop-blur-sm border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <CardHeader className="relative z-10 text-center">
                    <CardTitle className="text-3xl font-black">{plan.title}</CardTitle>
                    <CardDescription className="text-2xl mt-2">{plan.price}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button size="lg" className="w-full">Choose Plan</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" ref={ctaRef} className="relative py-32 bg-gradient-to-r from-orange-500 to-amber-400 text-black">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2 className="text-5xl md:text-6xl font-black mb-6" initial={{ opacity:0, y:30 }} animate={ctaInView ? {opacity:1, y:0} : {}}>
            Ready to Transform Learning?
          </motion.h2>
          <motion.p className="text-xl md:text-2xl mb-10" initial={{ opacity:0, y:20 }} animate={ctaInView ? {opacity:1, y:0} : {}}>
            Join thousands of learners worldwide and unlock your potential with AI-powered education.
          </motion.p>
          <motion.div className="flex justify-center gap-6" initial={{ opacity:0 }} animate={ctaInView ? {opacity:1} : {}}>
            <Link to="/login">
              <Button size="xl" variant="white">
                Get Started
              </Button>
            </Link>
            <Button size="xl" variant="outline">Learn More</Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <Sparkles>
              <span className="text-xl font-bold text-white">RahnumAI</span>
            </Sparkles>
            <p className="text-sm mt-2">© 2025 RahnumAI. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-white transition">Privacy</Link>
            <Link to="#" className="hover:text-white transition">Terms</Link>
            <Link to="#" className="hover:text-white transition">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
