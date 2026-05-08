// components/LoginForm.tsx
"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn } from "lucide-react";

import AuthInput from "./AuthInput";
import OAuthButtons from "./OAuthButtons";
import CloseButton from "./CloseButton";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};


export default function LoginForm({ onSwitch, onClose }: { onSwitch: () => void; onClose?: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
  const passwordValid = useMemo(() => password.length >= 8, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/movies");
      router.refresh();
    }
  };

  return (
    <div className="relative w-full max-w-[480px] p-7 sm:p-9 rounded-2xl border border-white/10 bg-[#162938]/95 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
      <CloseButton onClose={onClose || (() => router.push("/"))} />

      <motion.div variants={stagger} initial="hidden" animate="show" exit="hidden" className="space-y-6">
        <motion.h2 variants={fadeUp} className="text-3xl font-logo text-center text-white pt-1">
          Login
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div variants={fadeUp}>
            <AuthInput label="Email" icon={<Mail size={16} />} type="email" name="login-email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} autoComplete="email" isValid={emailValid} />
          </motion.div>

          <motion.div variants={fadeUp}>
            <AuthInput label="Password" icon={<Lock size={16} />} type="password" name="login-password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} minLength={8} autoComplete="current-password" isValid={passwordValid} />
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-[#D4537E] checked:border-[#D4537E] focus:ring-1 focus:ring-[#D4537E]/50 transition-colors cursor-pointer accent-[#D4537E]" />
              <span className="text-white/60 group-hover:text-white/80 transition-colors">Remember me</span>
            </label>
            <button type="button" className="text-[#D4537E] hover:text-[#e06b93] transition-colors font-medium">Forgot Password?</button>
          </motion.div>

          {error && (
             <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm text-center bg-red-400/10 rounded-lg py-2 px-3">{error}</motion.p>
          )}

          <motion.div variants={fadeUp}>
            <button type="submit" disabled={loading} className="btn-gradient w-full h-12 rounded-xl font-semibold text-white flex items-center justify-center gap-2 text-sm tracking-wide">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogIn size={18} />Login</>}
            </button>
          </motion.div>
        </form>

        <motion.div variants={fadeUp}>
          <OAuthButtons mode="login" />
        </motion.div>

        <motion.p variants={fadeUp} className="text-white/40 text-sm text-center">
          Don&apos;t have an account?{" "}
          <button onClick={onSwitch} type="button" className="text-[#D4537E] font-semibold hover:text-[#e06b93] transition-colors">
            Register
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}