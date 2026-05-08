"use client";
 
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
 
interface HeaderProps {
  onLogoClick?: () => void;
  showSignIn?: boolean;
  onSignInClick?: () => void;
}
 
const NAV_LINKS = [
  { label: "Articles", href: "/articles" },
  { label: "Top Rated", href: "/top-rated" },
  { label: "Discussions", href: "/discussions" },
];
 
export default function Header({ onLogoClick, showSignIn = true, onSignInClick }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="absolute top-0 left-0 right-0 z-50 w-full px-8 sm:px-14 py-6 flex justify-between items-center"
    >
      {/* Logo */}
      <motion.div
        animate={{
          textShadow: [
            "0 0 15px rgba(255,255,255,0.3)",
            "0 0 25px rgba(255,255,255,0.6)",
            "0 0 15px rgba(255,255,255,0.3)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Link
          href="/movies"
          onClick={onLogoClick}
          className="relative inline-flex items-baseline font-logo font-bold tracking-wider
                     transition-all duration-300 ease-out hover:scale-110 group cursor-pointer"
        >
          <span
            className="text-4xl text-white transition-all duration-1000 ease-in-out
                       [text-shadow:0px_0px_rgba(0,255,255,0),0px_0px_rgba(255,0,0,0)]
                       group-hover:text-accent
                       group-hover:[text-shadow:-2px_0_cyan,2px_0_red]"
          >
            W
          </span>
          <span
            className="text-3xl text-white/95 transition-colors duration-300 group-hover:text-white"
          >
            ovie
          </span>
        </Link>
      </motion.div>
 
      <nav className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-[0.7rem] font-medium tracking-[0.16em] uppercase text-white/60 hover:text-white transition-colors duration-300"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              {label}
            </Link>
          ))}
        </div>
 
        <div className="w-px h-4 bg-white/20 hidden md:block" />
 
        <AnimatePresence>
          {showSignIn && (
            <motion.button
              key="sign-in-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onSignInClick}
              className="text-[0.7rem] font-semibold tracking-[0.16em] uppercase text-white/80 hover:text-white px-5 py-2 rounded-sm border border-white/25 hover:border-white/50 bg-white/5 hover:bg-white/10 transition-all duration-300"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              Sign In
            </motion.button>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
