import { useId } from 'react';
import { CREST, FORHIM, LOCKUP, LOCKUP_D, WORDMARK } from '@/lib/logo';

/**
 * Logo oficial Cesarini (din fișierul Illustrator al clientului), desenat ca SVG inline:
 * se vede perfect la orice dimensiune, nu face request-uri și nu se pierde în previzualizarea offline.
 *
 * - `tone="gold"`: aurul periat al logoului (gradientul original, champagne → highlight → bronz)
 * - `tone="current"`: o singură culoare din `currentColor` (semnătura discretă din footer, stări hover)
 */
type Tone = 'gold' | 'current';

function GoldGradient({ id, w, h }: { id: string; w: number; h: number }) {
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={w} y2={h}>
      <stop offset="0" stopColor="#C79C45" />
      <stop offset=".3" stopColor="#F3D98A" />
      <stop offset=".5" stopColor="#FBE6A0" />
      <stop offset=".72" stopColor="#E7C470" />
      <stop offset="1" stopColor="#B08838" />
    </linearGradient>
  );
}

function useFill(tone: Tone) {
  const id = `lg${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return { id, fill: tone === 'gold' ? `url(#${id})` : 'currentColor' };
}

type PieceProps = { className?: string; tone?: Tone; title?: string };

function Piece({ shape, className, tone = 'gold', title }: PieceProps & { shape: { w: number; h: number; d: string } }) {
  const { id, fill } = useFill(tone);
  return (
    <svg
      viewBox={`0 0 ${shape.w} ${shape.h}`}
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {tone === 'gold' && (
        <defs>
          <GoldGradient id={id} w={shape.w} h={shape.h} />
        </defs>
      )}
      <path fill={fill} d={shape.d} />
    </svg>
  );
}

/** Blazonul: coroana, scutul cu „C” și lauri. */
export const CrestMark = (p: PieceProps) => <Piece shape={CREST} {...p} />;
/** „CESARINI”, literele exacte din logo. */
export const Wordmark = (p: PieceProps) => <Piece shape={WORDMARK} {...p} />;
/** „FOR HIM” între cele două linii. */
export const ForHim = (p: PieceProps) => <Piece shape={FORHIM} {...p} />;

/** Logoul complet, vertical: blazon, CESARINI, FOR HIM. Un singur gradient pe tot ansamblul, ca în original. */
export function LogoLockup({ className, tone = 'gold', title = 'Cesarini — For Him' }: PieceProps) {
  const { id, fill } = useFill(tone);
  return (
    <svg viewBox={`0 0 ${LOCKUP.w} ${LOCKUP.h}`} className={className} role="img" aria-label={title} focusable="false">
      {tone === 'gold' && (
        <defs>
          <GoldGradient id={id} w={LOCKUP.w} h={LOCKUP.h} />
        </defs>
      )}
      <path fill={fill} d={LOCKUP_D} />
    </svg>
  );
}
