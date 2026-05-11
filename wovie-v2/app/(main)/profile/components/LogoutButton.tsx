"use client"

import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors text-sm font-medium"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </button>
  )
}
