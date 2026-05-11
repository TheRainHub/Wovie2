"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { Search, Bell, ChevronDown, LogOut, User, Settings, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Movies", href: "/movies" },
  { label: "Top Rated", href: "/movies?sort=rating" },
  { label: "New Releases", href: "/movies?sort=date" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Track scroll for background change
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const initials = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "?";

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0b0d]/95 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.05)]"
          : "bg-gradient-to-b from-black/60 to-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-1 h-16 flex items-center justify-between">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
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

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href || (href !== "/movies" && pathname?.startsWith(href));
              return (
                <Link
                  key={label}
                  href={href}
                  className={`relative px-3.5 py-1.5 rounded-md text-[15px] font-medium transition-all duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[#D4537E]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Search + Bell + Profile */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <AnimatePresence>
            {searchOpen ? (
              <motion.form
                key="search-bar"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 500, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onSubmit={handleSearch}
                className="flex items-center overflow-hidden"
              >
                <div className="flex items-center gap-2 w-full bg-white/8 border border-white/10 rounded-lg px-3 py-1.5">
                  <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search movies..."
                    className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-full"
                  />
                  <button
                    type="button"
                    onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                    className="text-white/30 hover:text-white/60 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.button
                key="search-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all"
              >
                <Search className="w-[18px] h-[18px]" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all">
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D4537E] border-2 border-[#0a0b0d]" />
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />

          {/* Profile / Sign In */}
          {session?.user ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg
                           hover:bg-white/5 transition-all group"
              >
                {/* Avatar */}
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || ""}
                    className="w-7 h-7 rounded-md object-cover border border-white/10"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#D4537E] to-[#993556]
                                  flex items-center justify-center text-xs font-bold text-white border border-white/10">
                    {initials}
                  </div>
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${
                  profileOpen ? "rotate-180" : ""
                }`} />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 py-1.5 rounded-xl
                               bg-[#1a1c20] border border-white/8 shadow-xl shadow-black/40"
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-sm font-medium text-white line-clamp-1">{session.user.name}</p>
                      <p className="text-xs text-white/40 line-clamp-1">{session.user.email}</p>
                    </div>

                    <div className="py-1">
                      <DropdownItem icon={User} label="Profile" href="/profile" />
                      <DropdownItem icon={Settings} label="Settings" href="/settings" />
                    </div>

                    <div className="border-t border-white/5 pt-1">
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400/80
                                   hover:text-red-400 hover:bg-white/5 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => router.push(`/?view=login&t=${Date.now()}`)}
              className="text-sm font-medium text-white/80 hover:text-white px-4 py-1.5 rounded-lg
                         border border-white/15 hover:border-white/30 hover:bg-white/5
                         transition-all duration-200 cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
}

function DropdownItem({ icon: Icon, label, href }: { icon: any; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2 text-sm text-white/60
                 hover:text-white hover:bg-white/5 transition-all"
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}
