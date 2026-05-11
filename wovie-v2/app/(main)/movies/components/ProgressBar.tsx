'use client'

import { motion} from 'framer-motion'


interface Props {
    watchedSeconds: number
    totalSeconds: number
}

export default function ProgressBar({ 
    watchedSeconds, 
    totalSeconds

}: Props) {
    const pct = Math.min(Math.round((watchedSeconds / totalSeconds) * 100), 100)
    return (
        <div className="w-full px-3 pb-3">
            <div className="flex items-center justify-between text-[10px] text-white/50 mb-1">
            <span> Continue Watching</span>
            <span>{pct}%</span>
            </div>
            <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #D4537E, #993556)' }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                />
            </div>        
        </div>
    )
}