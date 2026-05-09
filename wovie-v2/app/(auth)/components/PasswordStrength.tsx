"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import zxcvbn from "zxcvbn";

interface PasswordStrengthProps {
  password: string;
}

const SEGMENTS = 4;

const STRENGTH_CONFIG = [
  { label: "Weak", color: "#ef4444" },       // red
  { label: "Fair", color: "#f97316" },        // orange
  { label: "Good", color: "#eab308" },        // yellow
  { label: "Strong", color: "#22c55e" },      // green
] as const;

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const result = useMemo(() => {
    if (!password) return null;
    return zxcvbn(password);
  }, [password]);

  if (!result || !password) return null;

  // zxcvbn returns 0-4, map to 1-4 for display (0 and 1 both = 1 segment)
  const score = Math.max(1, result.score); // 1..4
  const config = STRENGTH_CONFIG[score - 1];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 space-y-1"
    >
      {/* Bar segments */}
      <div className="flex gap-1">
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full overflow-hidden bg-white/10"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: i < score ? "100%" : "0%",
              }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                backgroundColor: i < score ? config.color : "transparent",
              }}
            />
          </div>
        ))}
      </div>

      {/* Label */}
      <div className="flex justify-between items-center">
        <span
          className="text-[10px] font-medium tracking-wide uppercase"
          style={{ color: config.color }}
        >
          {config.label}
        </span>
        {result.feedback.warning && (
          <span className="text-[10px] text-white/40 truncate max-w-[200px]">
            {result.feedback.warning}
          </span>
        )}
      </div>
    </motion.div>
  );
}
