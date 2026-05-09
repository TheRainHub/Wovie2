"use client";

import { motion } from "framer-motion";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 22" fill="currentColor" className="text-white">
      <path d="M17.05 18.68c-.53 1.18-.78 1.7-1.46 2.75-.95 1.46-2.29 3.28-3.95 3.3-1.48.02-1.86-.97-3.87-.96-2 .01-2.42 .98-3.9.96-1.66-.02-2.93-1.64-3.88-3.1C-2.13 18.24-2.61 13.72.82 11.26c1.65-1.18 3.46-1.02 4.76-.3.98.54 1.84.84 3.08.06 1.81-1.14 3.2-.72 4.53.09 1.77 1.08 2.73 2.93 2.27 5.32-1.73-.49-3.61.78-3.42 3.25" />
      <path d="M12.41.04C11.47 1.24 9.88 2.15 8.36 2.06c-.22-1.41.51-2.91 1.37-3.84C10.73-2.82 12.39-3.56 13.76-3.63c.17 1.49-.43 2.94-1.35 3.95" transform="translate(0, 4)" />
    </svg>
  );
}

interface OAuthButtonsProps {
  mode: "login" | "register";
}

export default function OAuthButtons({ mode }: OAuthButtonsProps) {
  const actionText = mode === "login" ? "Sign in" : "Sign up";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="space-y-3"
    >
      {/* Divider */}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-[11px] text-white/30 uppercase tracking-widest font-medium">
          or continue with
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* OAuth buttons row */}
      <div className="flex gap-3">
        <button
          type="button"
          className="flex-1 h-11 flex items-center justify-center gap-2.5
            bg-white/5 border border-white/10 rounded-lg
            hover:bg-white/10 hover:border-white/20
            active:scale-[0.98] transition-all duration-200
            text-sm text-white/80 font-medium"
        >
          <GoogleIcon />
          <span>Google</span>
        </button>

        <button
          type="button"
          className="flex-1 h-11 flex items-center justify-center gap-2.5
            bg-white/5 border border-white/10 rounded-lg
            hover:bg-white/10 hover:border-white/20
            active:scale-[0.98] transition-all duration-200
            text-sm text-white/80 font-medium"
        >
          <AppleIcon />
          <span>Apple</span>
        </button>
      </div>
    </motion.div>
  );
}
