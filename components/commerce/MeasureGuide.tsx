'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { MeasureKey } from '@/lib/commerce/measurements';

/**
 * Ghidul vizual: o siluetă desenată în linie fină (ca un tipar de croitor) și centimetrul auriu
 * care arată exact unde se măsoară câmpul activ. Fără ilustrații externe: SVG pur, scalabil.
 */

const TAPE = '#D4AF37';

/* Forma centimetrului pentru fiecare măsură (coordonate în viewBox 0 0 200 400). */
const TAPES: Record<MeasureKey, { d: string; label: [number, number]; anchor?: 'start' | 'end' | 'middle' }> = {
  neck: { d: 'M90 63 C90 67 110 67 110 63 C110 59 90 59 90 63', label: [116, 60], anchor: 'start' },
  chest: { d: 'M60 106 C60 114 140 114 140 106 C140 98 60 98 60 106', label: [146, 104], anchor: 'start' },
  waist: { d: 'M69 170 C69 177 131 177 131 170 C131 163 69 163 69 170', label: [137, 168], anchor: 'start' },
  hip: { d: 'M70 211 C70 218 130 218 130 211 C130 204 70 204 70 211', label: [136, 209], anchor: 'start' },
  shoulders: { d: 'M60 70 L91 59 L109 59 L140 70 M60 65 L60 75 M140 65 L140 75', label: [146, 62], anchor: 'start' },
  biceps: { d: 'M47 118 C47 123 67 125 67 120 C67 115 47 113 47 118', label: [44, 108], anchor: 'end' },
  sleeve: { d: 'M55 72 C45 90 43 125 41 160 L37 228 M50 72 L60 72 M32 228 L42 228', label: [26, 250], anchor: 'start' },
  inseam: { d: 'M95 247 L92 378 M90 247 L100 247 M87 378 L97 378', label: [84, 312], anchor: 'end' },
  height: { d: 'M182 18 L182 382 M176 18 L188 18 M176 382 L188 382', label: [176, 11], anchor: 'middle' },
  weight: { d: 'M66 384 L134 384 L134 392 L66 392 Z M96 388 L104 388', label: [100, 372], anchor: 'middle' },
};

export function MeasureGuide({ active, value, unit, className = '' }: { active: MeasureKey; value?: number; unit: string; className?: string }) {
  const reduce = useReducedMotion();
  const tape = TAPES[active];

  return (
    <svg viewBox="0 0 200 400" role="img" aria-label="Ghid de măsurare: silueta și locul în care se pune centimetrul" className={className}>
      {/* grilă fină de tipar */}
      <g stroke="rgba(197,160,89,.08)" strokeWidth="0.5">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`h${i}`} x1="0" x2="200" y1={i * 50} y2={i * 50} />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={`v${i}`} y1="0" y2="400" x1={i * 50} x2={i * 50} />
        ))}
      </g>

      {/* silueta */}
      <g fill="none" stroke="rgba(229,229,224,.55)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="100" cy="36" rx="15" ry="18" />
        <path d="M93 53 L93 64 M107 53 L107 64" />
        <path d="M93 64 L62 74 C56 100 62 140 69 168 L70 200 C69 214 69 224 72 232" />
        <path d="M107 64 L138 74 C144 100 138 140 131 168 L130 200 C131 214 131 224 128 232" />
        <path d="M72 232 L77 380 L92 380 L97 248 Q100 240 103 248 L108 380 L123 380 L128 232" />
        <path d="M62 74 C52 90 49 125 47 160 L43 226 M70 100 C66 125 64 140 63 160 L57 226 M43 226 C44 236 56 236 57 226" />
        <path d="M138 74 C148 90 151 125 153 160 L157 226 M130 100 C134 125 136 140 137 160 L143 226 M157 226 C156 236 144 236 143 226" />
      </g>

      {/* centimetrul auriu */}
      <motion.path
        key={active}
        d={tape.d}
        fill="none"
        stroke={TAPE}
        strokeWidth="1.6"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0, opacity: 0.2 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
      <text
        x={tape.label[0]}
        y={tape.label[1]}
        textAnchor={tape.anchor ?? 'start'}
        fill={TAPE}
        style={{ font: '600 11px var(--font-manrope), sans-serif', letterSpacing: '0.06em' }}
      >
        {value !== undefined && Number.isFinite(value) ? `${String(value).replace('.', ',')} ${unit}` : `— ${unit}`}
      </text>
    </svg>
  );
}
