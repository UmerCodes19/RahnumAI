"use client";
import React, { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Sparkles = ({
  children,
  className,
  sparkleColor = "#f97316",
  ...props
}) => {
  const id = useId();

  return (
    <div
      className={cn("relative inline-block", className)}
      {...props}
    >
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: sparkleColor,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 1 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};