"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }) => {
  const paths = [
    "M-380 -188C-380 -188 -208 224 280 196C768 168 828 28 828 28",
    "M-380 -188C-380 -188 -208 224 280 196C768 168 828 28 828 28",
    "M-344 -188C-344 -188 -172 224 316 196C804 168 864 28 864 28",
    "M-308 -188C-308 -188 -136 224 352 196C840 168 900 28 900 28",
  ];

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_center_center,black,transparent)]",
        className
      )}
    >
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 696 316"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
      >
        {paths.map((path, index) => (
          <motion.path
            key={`path-${index}`}
            d={path}
            stroke={`url(#linearGradient-${index})`}
            strokeWidth="1"
            strokeOpacity="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 10 + index * 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
          />
        ))}
        <defs>
          {paths.map((_, index) => (
            <linearGradient
              key={`gradient-${index}`}
              id={`linearGradient-${index}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop stopColor="#f97316" stopOpacity="0"></stop>
              <stop stopColor="#f97316" stopOpacity="1"></stop>
              <stop offset="32.5%" stopColor="#eab308" stopOpacity="1"></stop>
              <stop offset="100%" stopColor="#f97316" stopOpacity="0"></stop>
            </linearGradient>
          ))}
        </defs>
      </motion.svg>
    </div>
  );
};