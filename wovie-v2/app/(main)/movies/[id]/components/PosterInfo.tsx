'use client'
import { motion, Variants } from 'framer-motion'
import { Play, Download, Plus, Share2, Heart, Star } from 'lucide-react'
import { useAccentColor } from '../hooks/useAccentColor'

interface Props {
  film: any;
}

const formatRuntime = (minutes: number) => {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h > 0 ? h + 'h ' : ''}${m}min`;
}

const formatCurrency = (value: number) => {
  if (!value) return 'N/A';
  if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
  return `$${value.toLocaleString()}`;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

const CrewCard = ({ role, member }: { role: string, member: any }) => {
  if (!member) return (
    <div className="flex flex-col justify-center bg-[#12151C] border border-white/5 rounded-xl px-5 py-3">
      <span className="text-white/40 text-[10px] tracking-wider uppercase mb-1">{role}</span>
      <span className="text-white text-sm font-medium">—</span>
    </div>
  );

  return (
    <div className="flex items-center gap-3 bg-[#12151C] border border-white/5 rounded-xl px-4 py-3">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
        {member.profile_path ? (
          <img src={`https://image.tmdb.org/t/p/w185${member.profile_path}`} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">?</div>
        )}
      </div>
      <div className="flex flex-col justify-center">
        <span className="text-white/40 text-[10px] tracking-wider uppercase mb-0.5">{role}</span>
        <span className="text-white text-sm font-medium line-clamp-1">{member.name}</span>
      </div>
    </div>
  )
}

const formatVotes = (votes: number) => {
  if (!votes) return '0 votes';
  if (votes >= 1000000) return `${(votes / 1000000).toFixed(1)}M votes`;
  if (votes >= 1000) return `${(votes / 1000).toFixed(1)}K votes`;
  return `${votes} votes`;
}

export default function PosterInfo({ film }: Props) {
  const year = film.release_date ? film.release_date.split('-')[0] : '';
  const countries = film.production_countries?.map((c: any) => c.name).join(', ') || '';
  const shortCountries = film.production_countries?.map((c: any) => c.iso_3166_1).join(' / ') || '';
  const logo = film.images?.logos?.[0]?.file_path;
  const posterUrl = film.poster_path ? `https://image.tmdb.org/t/p/w500${film.poster_path}` : undefined;
  const accent = useAccentColor(posterUrl);
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };
  
  return (
    <div className="flex flex-col gap-8 px-8 -mt-20 relative z-10">
      
      <div className="flex gap-8">
        {/* Постер */}
        <motion.div
          className="w-[280px] lg:w-[320px] flex-shrink-0 self-start rounded-xl overflow-hidden"
          style={{ boxShadow: `0 20px 60px ${accent.rgba(0.3)}, 0 0 80px ${accent.rgba(0.1)}`, border: `1px solid ${accent.rgba(0.15)}` }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {film.poster_path ? (
            <img
              src={posterUrl}
              alt={film.title}
              className="w-full block object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-full aspect-[2/3] flex items-center justify-center text-white/30">
              No Poster
            </div>
          )}
        </motion.div>

        {/* Инфа справа */}
        <motion.div
          className="flex-1 pt-12 flex flex-col justify-end pb-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="mb-6">
            {logo ? (
              <img 
                src={`https://image.tmdb.org/t/p/w500${logo}`} 
                alt={film.title} 
                className="max-h-[120px] object-contain object-left drop-shadow-2xl mb-4" 
              />
            ) : (
              <h1 className="text-5xl font-bold text-white tracking-tight mb-2 drop-shadow-lg">{film.title}</h1>
            )}
            <p className="text-white/60 text-base font-medium">
              {film.original_title}{year ? `, ${year}` : ''} {countries ? `— ${countries}` : ''}
            </p>
          </motion.div>

          {/* Рейтинги */}
          <motion.div variants={itemVariants} className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5" style={{
                    color: i <= Math.round(film.vote_average / 2) ? accent.hex : accent.rgba(0.25),
                    fill: i <= Math.round(film.vote_average / 2) ? accent.hex : 'transparent'
                  }} />
                ))}
              </div>
              <span className="font-bold text-xl ml-2 drop-shadow" style={{ color: accent.hex }}>{film.vote_average?.toFixed(1)}</span>
              <span className="text-white/40 text-sm">{formatVotes(film.vote_count)}</span>
            </div>
            
            <div className="flex items-center gap-2 border-l border-white/10 pl-6">
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ borderWidth: 2, borderColor: accent.hex, color: accent.hex, backgroundColor: accent.rgba(0.1) }}>
                93%
              </span>
              <span className="text-white/60 text-sm font-medium">Rotten Tomatoes</span>
            </div>
          </motion.div>

          {/* Чипы */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1.5 text-sm rounded-full font-medium shadow-sm backdrop-blur-sm"
                  style={{ backgroundColor: accent.rgba(0.1), border: `1px solid ${accent.rgba(0.2)}`, color: accent.rgba(0.9) }}>18+</span>
            {film.genres?.map((g: any) => (
              <span key={g.id} className="px-3 py-1.5 text-sm rounded-full font-medium shadow-sm backdrop-blur-sm"
                    style={{ backgroundColor: accent.rgba(0.06), border: `1px solid ${accent.rgba(0.15)}`, color: 'rgba(255,255,255,0.8)' }}>
                {g.name}
              </span>
            ))}
            {film.runtime > 0 && (
              <span className="px-3 py-1.5 text-sm rounded-full font-medium shadow-sm backdrop-blur-sm"
                    style={{ backgroundColor: accent.rgba(0.06), border: `1px solid ${accent.rgba(0.15)}`, color: 'rgba(255,255,255,0.8)' }}>
                {formatRuntime(film.runtime)}
              </span>
            )}
            <span className="px-3 py-1.5 text-sm rounded-full font-medium shadow-sm backdrop-blur-sm"
                  style={{ backgroundColor: accent.rgba(0.06), border: `1px solid ${accent.rgba(0.15)}`, color: 'rgba(255,255,255,0.8)' }}>4K UHD</span>
          </motion.div>

          {/* Слоган и Описание */}
          <motion.div variants={itemVariants} className="mb-8">
            {film.tagline && (
              <p className="italic text-lg mb-3 font-medium drop-shadow-sm" style={{ color: accent.hex }}>
                «{film.tagline}»
              </p>
            )}
            <p className="text-white/80 text-base leading-relaxed max-w-4xl drop-shadow-sm">
              {film.overview}
            </p>
          </motion.div>

          {/* Кнопки */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
            <button className="flex items-center gap-2 text-white px-8 py-3.5 rounded-xl font-bold transition-all duration-300"
                    style={{ backgroundColor: accent.hex, color: accent.isDark ? '#fff' : '#000', boxShadow: `0 8px 32px ${accent.rgba(0.4)}` }}>
              <Play className="w-5 h-5" style={{ fill: accent.isDark ? '#fff' : '#000' }} />
              Watch
            </button>
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors border border-white/10 text-white px-6 py-3.5 rounded-xl font-medium backdrop-blur-sm">
              <Download className="w-5 h-5" />
              Download
            </button>
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors border border-white/10 text-white px-6 py-3.5 rounded-xl font-medium backdrop-blur-sm">
              <Plus className="w-5 h-5" />
              Add to List
            </button>
            <button className="p-3.5 bg-white/10 hover:bg-white/20 transition-colors border border-white/10 text-white rounded-xl backdrop-blur-sm">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-3.5 bg-white/10 hover:bg-white/20 transition-colors border border-white/10 text-white rounded-xl backdrop-blur-sm">
              <Heart className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Полоска со статистикой */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-[#12151C] rounded-2xl py-6 px-8"
        style={{ border: `1px solid ${accent.rgba(0.1)}` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex flex-col items-center text-center border-r border-white/5 last:border-0 md:last:border-r-0">
          <span className="text-white/40 text-xs tracking-wider uppercase mb-1">Year</span>
          <span className="text-white font-semibold">{year || '—'}</span>
        </div>
        <div className="flex flex-col items-center text-center border-r border-white/5 last:border-0 md:last:border-r-0">
          <span className="text-white/40 text-xs tracking-wider uppercase mb-1">Country</span>
          <span className="text-white font-semibold">{shortCountries || '—'}</span>
        </div>
        <div className="flex flex-col items-center text-center border-r border-white/5 last:border-0 md:last:border-r-0">
          <span className="text-white/40 text-xs tracking-wider uppercase mb-1">Budget</span>
          <span className="text-white font-semibold">{formatCurrency(film.budget)}</span>
        </div>
        <div className="flex flex-col items-center text-center border-r border-white/5 md:border-r-0">
          <span className="text-white/40 text-xs tracking-wider uppercase mb-1">Revenue</span>
          <span className="text-white font-semibold">{formatCurrency(film.revenue)}</span>
        </div>
        <div className="flex flex-col items-center text-center col-span-2 md:col-span-1 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
          <span className="text-white/40 text-xs tracking-wider uppercase mb-1">Release</span>
          <span className="text-white font-semibold">{formatDate(film.release_date) || '—'}</span>
        </div>
      </motion.div>

      {/* Создатели */}
      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-xl font-medium text-white mb-4">Crew</h2>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <CrewCard role="Director" member={film.credits?.crew?.find((c: any) => c.job === 'Director')} />
            <CrewCard role="Screenplay" member={film.credits?.crew?.find((c: any) => c.job === 'Screenplay' || c.job === 'Writer')} />
            <CrewCard role="Producer" member={film.credits?.crew?.find((c: any) => c.job === 'Producer')} />
            <CrewCard role="Cinematography" member={film.credits?.crew?.find((c: any) => c.job === 'Director of Photography')} />
          </div>
          <CrewCard role="Music" member={film.credits?.crew?.find((c: any) => c.job === 'Original Music Composer')} />
        </div>
      </motion.div>

    </div>
  )
}
