"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
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
          type={type}
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

        <div className={`flex items-center gap-1.5 pl-2 transition-colors duration-200 ${iconColor}`}>
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
