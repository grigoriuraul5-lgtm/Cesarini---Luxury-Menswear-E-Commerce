'use client';

import Image from 'next/image';
import { useState } from 'react';
import { unsplashLoader, type Media } from '@/lib/media';

type Props = {
  media: Media;
  sizes: string;
  priority?: boolean;
  /** `grade` unifică fotografii din surse diferite: le coboară spre negru-obsidian cu o tentă caldă. */
  grade?: 'none' | 'soft' | 'deep';
  /** zoom lent la hover (necesită `group` pe părinte) */
  zoom?: boolean;
  className?: string;
  imgClassName?: string;
};

/**
 * Imagine „de lux”: object-cover pe tot cadrul, grading unitar, zoom lent la hover
 * și fundal de stofă dacă sursa nu se încarcă (fără cadre goale sau iconițe de imagine spartă).
 */
export function LuxImage({ media, sizes, priority, grade = 'soft', zoom = true, className = '', imgClassName = '' }: Props) {
  const [failed, setFailed] = useState(false);
  const remote = media.src.startsWith('http');

  return (
    <div className={`fabric-herringbone relative overflow-hidden ${className}`}>
      {!failed && (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes={sizes}
          priority={priority}
          loader={remote ? unsplashLoader : undefined}
          onError={() => setFailed(true)}
          style={{ objectPosition: media.focal ?? '50% 50%' }}
          className={`object-cover transition-transform duration-[1600ms] ease-expo ${
            zoom ? 'group-hover:scale-[1.06]' : ''
          } ${grade !== 'none' ? 'saturate-[.82]' : ''} ${imgClassName}`}
        />
      )}
      {grade !== 'none' && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 ${
            grade === 'deep'
              ? 'bg-[linear-gradient(180deg,rgba(10,10,10,.25)_0%,rgba(10,10,10,.15)_40%,rgba(10,10,10,.85)_100%)]'
              : 'bg-[linear-gradient(180deg,rgba(10,10,10,.05)_0%,rgba(10,10,10,0)_45%,rgba(10,10,10,.6)_100%)]'
          }`}
        />
      )}
      {/* tentă caldă: aduce fotografiile reci spre paleta aurie */}
      {grade !== 'none' && <div aria-hidden className="pointer-events-none absolute inset-0 bg-gold-900/20 mix-blend-soft-light" />}
    </div>
  );
}
