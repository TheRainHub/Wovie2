"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 w-full px-8 py-5 flex justify-between items-center z-50"
      style={{ background: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(10px)" }}
    >
      <Link href="/movies" className="font-logo text-2xl text-white">
        Wovie
      </Link>
      <nav className="flex items-center gap-8">
        <Link href="/movies" className="text-white hover:text-accent transition-colors">
          Home
        </Link>
        <Link href="/search" className="text-white hover:text-accent transition-colors">
          Search
        </Link>
        <Link href="/profile" className="text-white hover:text-accent transition-colors">
          Profile
        </Link>

        {session && (
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="px-5 py-2 border border-white/30 rounded-md text-white
              hover:bg-white hover:text-[#162938] transition-all"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
