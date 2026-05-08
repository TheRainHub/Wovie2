"use client";
 
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/app/components/Header";
import LoginForm from "@/app/(auth)/components/LoginForm";
import RegisterForm from "@/app/(auth)/components/RegisterForm";
 
type ViewState = "landing" | "login" | "register";
 
const getDirection = (from: ViewState, to: ViewState): number => {
  if (from === "landing") return 1;
  if (to === "register")  return 1; 
  return -1;                         
};
 
const authVariants = {
  initial: (dir: number) => ({
    opacity: 0,
    x: dir * 60,
    scale: 0.95,
  }),
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -60,
    scale: 0.95,
    transition: { duration: 0.4, ease: "easeOut" as const },
  }),
};
 

const landingVariants = {
  initial: { opacity: 0.1 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit:    { opacity: 0, transition: { duration: 0.25 } },
};
 
export default function HomePage() {
  const [view, setView]     = useState<ViewState>("landing");
  const [mounted, setMounted] = useState(false);
  const prevView = useRef<ViewState>("landing");
 
  useEffect(() => setMounted(true), []);
 
  const navigateTo = (next: ViewState) => {
    prevView.current = view;
    setView(next);
  };
 
  const direction = getDirection(prevView.current, view);
 
  return (
    <main className="relative min-h-screen w-full flex flex-col overflow-hidden bg-[#08070f]">
 
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/photos/starwarsbackG.jpg')" }}
      />
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom, rgba(5,5,12,0.65) 0%, transparent 18%),
            linear-gradient(to top,    rgba(5,5,12,0.5)  0%, transparent 15%)
          `,
        }}
      />
 
      {/* Auth Overlay */}
      <AnimatePresence>
        {view !== "landing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10 bg-[#0a0a0a]/92 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>
 
      {/* Header */}
      {mounted && (
        <Header
          onLogoClick={() => navigateTo("landing")}
          showSignIn={view === "landing"}
          onSignInClick={() => navigateTo("login")}
        />
      )}
 
      {/* Content */}
      <div className="relative z-20 flex-1 flex items-center justify-center px-4 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
 
          {view === "landing" && (
            <motion.div
              key="landing"
              variants={landingVariants}
              initial="initial" animate="animate" exit="exit"
            />
          )}
 
          {view === "login" && (
            <motion.div
              key="login"
              custom={direction}
              variants={authVariants}
              initial="initial" animate="animate" exit="exit"
              className="w-full flex justify-center"
            >
              <LoginForm onSwitch={() => navigateTo("register")} onClose={() => navigateTo("landing")} />
            </motion.div>
          )}
 
          {view === "register" && (
            <motion.div
              key="register"
              custom={direction}
              variants={authVariants}
              initial="initial" animate="animate" exit="exit"
              className="w-full flex justify-center"
            >
              <RegisterForm onSwitch={() => navigateTo("login")} onClose={() => navigateTo("landing")} />
            </motion.div>
          )}
 
        </AnimatePresence>
      </div>
 
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 text-center text-white/90 text-xs p-6"
      >
        © 2026 My Invention World. All rights reserved.
      </motion.footer>
    </main>
  );
}
