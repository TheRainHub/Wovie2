'use client'
import { motion } from 'framer-motion'
import { SlidersHorizontal } from 'lucide-react'

interface Props {
  genres: { id: number; name: string }[]
  activeGenre: string | null
  onGenreChange: (id: string | null) => void
}

const DISPLAY_GENRES = ['Drama', 'Sci-Fi', 'Action', 'Crime', 'Animation', 'Comedy', 'Thriller']

export default function GenreFilters({ genres, activeGenre, onGenreChange }: Props) {
  // Filter to show only popular genres that exist in DB
  const visibleGenres = genres.filter(g => DISPLAY_GENRES.includes(g.name))

  return (
    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
      {/* "All" chip */}
      <FilterChip
        label="All"
        isActive={activeGenre === null}
        onClick={() => onGenreChange(null)}
      />

      {visibleGenres.map(g => (
        <FilterChip
          key={g.id}
          label={g.name}
          isActive={activeGenre === String(g.id)}
          onClick={() => onGenreChange(String(g.id))}
        />
      ))}

      {/* Sort button */}
      <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/15
                         text-sm text-white/70 hover:text-white hover:border-white/30
                         transition-all ml-auto flex-shrink-0">
        <SlidersHorizontal className="w-3.5 h-3.5" />
        Sort
      </button>
    </div>
  )
}

function FilterChip({ label, isActive, onClick }: {
  label: string; isActive: boolean; onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0
        ${isActive
          ? 'bg-white text-black'
          : 'bg-transparent border border-white/15 text-white/70 hover:text-white hover:border-white/30'
        }`}
      whileTap={{ scale: 0.95 }}
    >
      {label}
    </motion.button>
  )
}
