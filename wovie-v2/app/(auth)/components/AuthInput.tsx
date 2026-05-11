"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface AuthInputProps {
  label: string;
  icon: ReactNode;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  minLength?: number;
  autoComplete?: string;
  error?: string;
  /** Show green valid state when true */
  isValid?: boolean;
}

/**
 * Lightsaber-style password toggle — a cinematic twist on the standard eye icon.
 * When "ignited" (visible), the blade glows with a colored beam + hum animation.
 * When "off" (hidden), only the hilt remains.
 */
function LightsaberToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative flex items-center justify-center w-9 h-9 rounded-md self-center
                 hover:bg-white/10 transition-colors group"
      title={visible ? "Hide password" : "Reveal password"}
      aria-label={visible ? "Hide password" : "Reveal password"}
      data-saber-ignited={visible ? "true" : undefined}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        className="transition-transform duration-200"
      >
        {/* Hilt — always visible */}
        <rect
          x="10.5"
          y="16"
          width="3"
          height="7"
          rx="1"
          fill="currentColor"
          className="text-white/40 group-hover:text-white/60 transition-colors"
        />
        {/* Hilt guard */}
        <rect
          x="8.5"
          y="15"
          width="7"
          height="2"
          rx="0.5"
          fill="currentColor"
          className="text-white/30 group-hover:text-white/50 transition-colors"
        />

        {/* Blade — animated */}
        <AnimatePresence>
          {visible && (
            <motion.g
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ scaleY: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ transformOrigin: "12px 15px" }}
            >
              {/* Outer glow */}
              <rect
                x="10"
                y="1"
                width="4"
                height="14"
                rx="2"
                fill="#22d3ee"
                opacity="0.3"
                filter="url(#saberGlow)"
              />
              {/* Core blade */}
              <rect
                x="10.8"
                y="1"
                width="2.4"
                height="14"
                rx="1.2"
                fill="#22d3ee"
              />
              {/* White hot core */}
              <rect
                x="11.3"
                y="1.5"
                width="1.4"
                height="13"
                rx="0.7"
                fill="white"
                opacity="0.9"
              />
            </motion.g>
          )}
        </AnimatePresence>

        {/* Glow filter */}
        <defs>
          <filter id="saberGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Ambient glow when active */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute inset-0 rounded-md bg-cyan-400/10 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </button>
  );
}

export default function AuthInput({
  label,
  icon,
  type = "text",
  name,
  value,
  onChange,
  required,
  disabled,
  minLength,
  autoComplete,
  error,
  isValid,
}: AuthInputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  // Determine visual state
  const hasValue = value.length > 0;
  const showValid = isValid && hasValue && !error;
  const showError = !!error;

  // Border color based on state
  const borderColor = showError
    ? "border-red-400"
    : showValid
      ? "border-emerald-400"
      : focused
        ? "border-[#D4537E]"
        : "border-white/15";

  // Icon color based on state
  const iconColor = showError
    ? "text-red-400"
    : showValid
      ? "text-emerald-400"
      : focused
        ? "text-[#D4537E]"
        : "text-white/30";

  // If lightsaber is ignited, switch to text to reveal password
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Floating label */}
      <label
        htmlFor={name}
        className={`block text-xs font-medium mb-1.5 transition-colors duration-200 ${
          focused ? "text-[#D4537E]" : "text-white/50"
        }`}
      >
        {label}
        {required && <span className="text-[#D4537E] ml-0.5">*</span>}
      </label>

      <div
        className={`relative flex items-center border-b-2 transition-all duration-300 ${borderColor}`}
      >
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          disabled={disabled}
          minLength={minLength}
          autoComplete={autoComplete}
          className="w-full bg-transparent text-white outline-none py-2.5 px-1 text-sm
            placeholder:text-transparent disabled:opacity-40 disabled:cursor-not-allowed"
        />

        <div className={`flex items-center gap-1 pl-2 transition-colors duration-200 ${iconColor}`}>
          {/* Lightsaber toggle for password fields */}
          {isPassword && (
            <LightsaberToggle
              visible={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />
          )}

          {showValid ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <Check size={16} strokeWidth={3} className="text-emerald-400" />
            </motion.div>
          ) : (
            <span className="opacity-70">{icon}</span>
          )}
        </div>
      </div>

      {showError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs mt-1.5"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
