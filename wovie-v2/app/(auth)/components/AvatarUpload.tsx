"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Camera, Plus, X } from "lucide-react";

interface AvatarUploadProps {
  onFileSelect: (file: File | null) => void;
}

export default function AvatarUpload({ onFileSelect }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file) {
        setPreview(null);
        onFileSelect(null);
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) return;

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const removeAvatar = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handleFile(null);
      if (inputRef.current) inputRef.current.value = "";
    },
    [handleFile]
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex justify-center"
    >
      <div
        className={`relative w-24 h-24 rounded-full cursor-pointer group transition-all duration-300 ${
          isDragging
            ? "ring-2 ring-[#D4537E] ring-offset-2 ring-offset-transparent"
            : ""
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          /* Avatar preview */
          <>
            <div className="w-full h-full rounded-full overflow-hidden ring-2 ring-white/20">
              <img
                src={preview}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={20} className="text-white" />
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={removeAvatar}
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center
                opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-400
                shadow-lg"
            >
              <X size={12} className="text-white" />
            </button>
          </>
        ) : (
          /* Empty state — dashed circle */
          <div
            className={`w-full h-full rounded-full border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
              isDragging
                ? "border-[#D4537E] bg-[#D4537E]/10"
                : "border-white/25 bg-white/5 group-hover:border-white/40 group-hover:bg-white/10"
            }`}
          >
            <Camera
              size={22}
              className={`transition-colors duration-200 ${
                isDragging ? "text-[#D4537E]" : "text-white/40 group-hover:text-white/60"
              }`}
            />

            {/* Plus badge */}
            <div
              className={`absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                isDragging
                  ? "bg-[#D4537E]"
                  : "bg-gradient-to-br from-[#D4537E] to-[#993556] group-hover:scale-110"
              }`}
            >
              <Plus size={14} className="text-white" strokeWidth={3} />
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    </motion.div>
  );
}
