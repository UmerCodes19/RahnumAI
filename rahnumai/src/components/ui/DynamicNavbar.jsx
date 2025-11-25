import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DynamicNavbar() {
  const { scrollY } = useScroll();
  const [scrollingDown, setScrollingDown] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  // Detect scroll direction
  useEffect(() => {
    return scrollY.onChange((current) => {
      setScrollingDown(current > lastScroll && current > 50); // scroll down & past 50px
      setLastScroll(current);
    });
  }, [scrollY, lastScroll]);

  // Motion transforms for scroll effect
  const yOffset = useTransform(scrollY, [0, 100], [0, 30]); // move down 30px max
  const opacity = useTransform(scrollY, [0, 100], [1, 0.85]); // translucent
  const scale = useTransform(scrollY, [0, 100], [1, 0.95]); // slight scale down

  return (
    <motion.nav
      style={{ y: scrollingDown ? yOffset : 0, opacity: scrollingDown ? opacity : 1, scale: scrollingDown ? scale : 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 shadow-md transition-all duration-300"
    >
      <Link to="/" className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
          <Rocket className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-slate-900 dark:text-white">RahnumAI</span>
      </Link>

      <div className="flex space-x-6 items-center">
        {["Home", "Stats", "Features", "Pricing", "CTA"].map((item) => (
          <Link
            key={item}
            to={`#${item.toLowerCase()}`}
            className="font-semibold text-slate-700 dark:text-slate-300 hover:text-orange-500 transition-colors"
          >
            {item}
          </Link>
        ))}
        <Button size="md">Get Started</Button>
      </div>
    </motion.nav>
  );
}
