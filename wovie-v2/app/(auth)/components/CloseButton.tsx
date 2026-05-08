"use client";
 
import { X } from "lucide-react";
 
interface CloseButtonProps {
  onClose: () => void;
}
 
export default function CloseButton({ onClose }: CloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="absolute top-4 right-4 w-8 h-8 rounded-full
        bg-white/5 border border-white/10
        flex items-center justify-center
        hover:bg-white/15 hover:border-white/25 hover:rotate-90
        active:scale-90
        transition-all duration-300
        text-white/40 hover:text-white/80
        z-20"
      aria-label="Close"
    >
      <X size={16} strokeWidth={2.5} />
    </button>
  );
}
 