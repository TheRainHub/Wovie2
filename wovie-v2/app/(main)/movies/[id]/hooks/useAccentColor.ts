'use client'
import { useState, useEffect } from 'react'
import { FastAverageColor } from 'fast-average-color'


export function useAccentColor(imageUrl: string | undefined) {
  const [accent, setAccent] = useState({
    hex: '#F5C518',
    rgb: 'rgb(245, 197, 24)',
    rgba: (alpha: number) => `rgba(245, 197, 24, ${alpha})`,
    r: 245, g: 197, b: 24,
    isDark: false,
  })

  useEffect(() => {
    if (!imageUrl) return

    const fac = new FastAverageColor()
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageUrl

    img.onload = () => {
      try {
        const result = fac.getColor(img, {
          algorithm: 'dominant',
          ignoredColor: [
            [0, 0, 0, 255, 30],
            [255, 255, 255, 255, 30]
          ]
        })

        // Повышаем насыщенность для более яркого акцента
        const [r, g, b] = result.value
        const boosted = boostSaturation(r, g, b, 1.4)

        setAccent({
          hex: rgbToHex(boosted.r, boosted.g, boosted.b),
          rgb: `rgb(${boosted.r}, ${boosted.g}, ${boosted.b})`,
          rgba: (alpha: number) => `rgba(${boosted.r}, ${boosted.g}, ${boosted.b}, ${alpha})`,
          r: boosted.r, g: boosted.g, b: boosted.b,
          isDark: result.isDark,
        })
      } catch (e) {
      }
    }

    return () => fac.destroy()
  }, [imageUrl])

  return accent
}


function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

function boostSaturation(r: number, g: number, b: number, factor: number) {
  // RGB → HSL → boost S → HSL → RGB
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  let h = 0, s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break
      case gn: h = ((bn - rn) / d + 2) / 6; break
      case bn: h = ((rn - gn) / d + 4) / 6; break
    }
  }

  s = Math.min(1, s * factor)

  // HSL → RGB
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }

  let ro: number, go: number, bo: number
  if (s === 0) {
    ro = go = bo = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    ro = hue2rgb(p, q, h + 1/3)
    go = hue2rgb(p, q, h)
    bo = hue2rgb(p, q, h - 1/3)
  }

  return {
    r: Math.round(ro * 255),
    g: Math.round(go * 255),
    b: Math.round(bo * 255),
  }
}
