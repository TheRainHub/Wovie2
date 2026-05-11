// components/RegisterForm.tsx
"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { AtSign, Mail, Lock, UserPlus } from "lucide-react";

import AuthInput from "./AuthInput";
import PasswordStrength from "./PasswordStrength";
import AvatarUpload from "./AvatarUpload";
import OAuthButtons from "./OAuthButtons";
import CloseButton from "./CloseButton";

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

// Добавили пропс onSwitch
export default function RegisterForm({ onSwitch, onClose }: { onSwitch: () => void; onClose?: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarSelect = useCallback((file: File | null) => {
    setAvatar(file);
  }, []);

  // Validation
  const usernameValid = useMemo(() => form.username.length >= 3, [form.username]);
  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
    [form.email]
  );
  const passwordValid = useMemo(() => form.password.length >= 8, [form.password]);
  const confirmValid = useMemo(
    () => form.confirmPassword.length > 0 && form.confirmPassword === form.password,
    [form.confirmPassword, form.password]
  );

  const confirmError = useMemo(() => {
    if (form.confirmPassword.length === 0) return undefined;
    if (form.confirmPassword !== form.password) return "Passwords don't match";
    return undefined;
  }, [form.confirmPassword, form.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (!agreedToTerms) {
      setError("Please agree to the terms & conditions");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Registration failed");
      setLoading(false);
      return;
    }

    const loginResult = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (loginResult?.ok) {
      router.push("/movies");
      router.refresh();
    }
  };

  return (
    <div className="relative w-full max-w-[480px] p-7 sm:p-9 rounded-2xl border bg-[#162938]/95 backdrop-blur-xl auth-scroll max-h-[95vh] overflow-y-auto
                    transition-all duration-1000 ease-out
                    border-cyan-400/20 shadow-[0_0_40px_rgba(34,211,238,0.15),0_8px_40px_rgba(0,0,0,0.5)]
                    has-[[data-saber-ignited=true]]:border-cyan-400/60
                    has-[[data-saber-ignited=true]]:shadow-[0_0_120px_rgba(34,211,238,0.4),0_8px_40px_rgba(0,0,0,0.5)]">
      <CloseButton onClose={onClose || (() => router.push("/"))} />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="space-y-5"
      >
        <motion.div variants={fadeUp} className="space-y-3 pt-1">
          <AvatarUpload onFileSelect={handleAvatarSelect} />
          <h2 className="text-3xl font-logo text-center text-white">
            Registration
          </h2>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div variants={fadeUp}>
            <AuthInput
              label="Username"
              icon={<AtSign size={16} />}
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="username"
              isValid={usernameValid}
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <AuthInput
              label="Email"
              icon={<Mail size={16} />}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="email"
              isValid={emailValid}
            />
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
            <div>
              <AuthInput
                label="Password"
                icon={<Lock size={16} />}
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={8}
                autoComplete="new-password"
                isValid={passwordValid}
              />
            </div>
            <div>
              <AuthInput
                label="Confirm"
                icon={<Lock size={16} />}
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="new-password"
                isValid={confirmValid}
                error={confirmError}
              />
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <PasswordStrength password={form.password} />
          </motion.div>

          <motion.div variants={fadeUp}>
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5
                  checked:bg-[#D4537E] checked:border-[#D4537E]
                  focus:ring-1 focus:ring-[#D4537E]/50
                  transition-colors cursor-pointer accent-[#D4537E]"
              />
              <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors leading-snug">
                I agree to the{" "}
                <button
                  type="button"
                  className="text-[#D4537E] font-semibold hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  terms & conditions
                </button>
              </span>
            </label>
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm text-center bg-red-400/10 rounded-lg py-2 px-3"
            >
              {error}
            </motion.p>
          )}

          <motion.div variants={fadeUp}>
            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="btn-gradient w-full h-12 rounded-xl font-semibold text-white
                flex items-center justify-center gap-2 text-sm tracking-wide"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={18} />
                  Register
                </>
              )}
            </button>
          </motion.div>
        </form>

        <motion.div variants={fadeUp}>
          <OAuthButtons mode="register" />
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="text-white/40 text-sm text-center pb-1"
        >
          Already have an account?{" "}
          {/* ЗАМЕНА LINK НА BUTTON */}
          <button
            onClick={onSwitch}
            type="button"
            className="text-[#D4537E] font-semibold hover:text-[#e06b93] transition-colors"
          >
            Login
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}