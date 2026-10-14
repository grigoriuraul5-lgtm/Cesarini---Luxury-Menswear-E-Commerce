'use client';

import { useEffect } from 'react';
import { LogoLockup } from './brand/Logo';

/**
 * Intrarea pe site (doar pe prima pagină, o dată pe sesiune): logoul oficial apare auriu pe obsidian,
 * apoi cortina se ridică și dezvăluie hero-ul. ~2 secunde, fără click.
 *
 * Fără „flash”: animația e CSS pur (rulează de la primul pixel). Un script mic din <head> (app/layout.tsx)
 * pune clasa `intro-seen` pe <html> dacă vizitatorul a văzut deja intro-ul în sesiune → CSS îl ascunde.
 * La prefers-reduced-motion nu apare deloc.
 */
export const INTRO_KEY = 'cesarini-intro';
export const INTRO_TOTAL = 1.55; // secunde până când cortina începe să se ridice

/** Cât trebuie să-și întârzie hero-ul animațiile (0 dacă intro-ul nu rulează). */
export function introDelay() {
  if (typeof window === 'undefined') return 0;
  const html = document.documentElement;
  if (html.classList.contains('intro-seen')) return 0;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 0;
  return INTRO_TOTAL;
}

export function IntroCurtain() {
  useEffect(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* stocare indisponibilă: intro-ul rulează din nou, nu e grav */
    }
    // după ce cortina s-a ridicat: revenirea pe prima pagină (navigare internă) nu mai repetă intro-ul
    const t = window.setTimeout(() => document.documentElement.classList.add('intro-seen'), 2700);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div aria-hidden className="intro-curtain">
      <div className="intro-curtain__glow" />
      <LogoLockup title="Cesarini" className="intro-curtain__logo h-auto w-[clamp(13rem,52vw,22rem)]" />
      <span className="intro-curtain__line" />
    </div>
  );
}
