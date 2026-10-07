/**
 * Măsurătorile pentru „Croit pe măsură” (Made-to-Measure online).
 * Intervalele sunt plaje de plauzibilitate pentru bărbați adulți: prind greșelile de tastare
 * (ex. 1020 în loc de 102), nu înlocuiesc verificarea făcută de consultant la telefon.
 */
import type { GarmentType } from './catalog';

export type MeasureKey = 'height' | 'weight' | 'chest' | 'waist' | 'hip' | 'shoulders' | 'biceps' | 'sleeve' | 'neck' | 'inseam';
export type Measurements = Partial<Record<MeasureKey, number>>;

export type MeasureField = {
  key: MeasureKey;
  label: string;
  /** etichetă scurtă pentru rezumate și mesajele către atelier */
  short: string;
  unit: 'cm' | 'kg';
  min: number;
  max: number;
  group: 'calibrare' | 'corp';
  garments: GarmentType[];
  how: string;
};

export const MEASURE_FIELDS: MeasureField[] = [
  { key: 'height', label: 'Înălțime totală', short: 'Înălțime', unit: 'cm', min: 150, max: 210, group: 'calibrare', garments: ['suit', 'shirt'],
    how: 'Desculț, cu spatele și călcâiele lipite de perete. Pune o carte pe creștet și măsoară de la podea până la ea.' },
  { key: 'weight', label: 'Greutate', short: 'Greutate', unit: 'kg', min: 45, max: 170, group: 'calibrare', garments: ['suit', 'shirt'],
    how: 'Greutatea de acum, aproximativ. O folosim doar ca să calibrăm proporțiile croielii.' },
  { key: 'neck', label: 'Circumferință gât', short: 'Gât', unit: 'cm', min: 34, max: 50, group: 'corp', garments: ['shirt'],
    how: 'La baza gâtului, acolo unde se închide gulerul. Lasă un deget între bandă și gât.' },
  { key: 'chest', label: 'Circumferință piept', short: 'Piept', unit: 'cm', min: 80, max: 150, group: 'corp', garments: ['suit', 'shirt'],
    how: 'Banda pe sub brațe, peste partea cea mai lată a pieptului și a omoplaților. Ține-o orizontal și respiră normal.' },
  { key: 'waist', label: 'Talie / abdomen', short: 'Talie', unit: 'cm', min: 60, max: 150, group: 'corp', garments: ['suit', 'shirt'],
    how: 'La nivelul buricului, unde stă cureaua pantalonului de costum. Nu trage burta.' },
  { key: 'hip', label: 'Circumferință șold / șezut', short: 'Șold', unit: 'cm', min: 80, max: 150, group: 'corp', garments: ['suit', 'shirt'],
    how: 'Cu picioarele lipite, peste partea cea mai proeminentă a șezutului.' },
  { key: 'shoulders', label: 'Lățime umeri', short: 'Umeri', unit: 'cm', min: 36, max: 58, group: 'corp', garments: ['suit', 'shirt'],
    how: 'Pe spate, de la vârful umărului stâng la vârful umărului drept, urmând linia umerilor. E mai precis dacă te măsoară altcineva.' },
  { key: 'biceps', label: 'Circumferință biceps', short: 'Biceps', unit: 'cm', min: 22, max: 50, group: 'corp', garments: ['suit', 'shirt'],
    how: 'Brațul relaxat pe lângă corp. Banda în jurul celei mai groase părți a brațului, imediat sub axilă.' },
  { key: 'sleeve', label: 'Lungime mânecă', short: 'Mânecă', unit: 'cm', min: 52, max: 72, group: 'corp', garments: ['suit', 'shirt'],
    how: 'Brațul ușor îndoit. De la vârful umărului, peste cot, până la osul încheieturii.' },
  { key: 'inseam', label: 'Lungime pantalon (interior)', short: 'Pantalon int.', unit: 'cm', min: 65, max: 95, group: 'corp', garments: ['suit'],
    how: 'Pe interiorul piciorului, de la încheietură până la podea, desculț. Sau măsoară cusătura interioară a unui pantalon care îți vine bine.' },
];

export const MEASURE_TIP = 'Folosește un centimetru de croitorie și măsoară peste o cămașă subțire. Banda stă lipită de corp, fără să strângă.';

export const fieldsFor = (g: GarmentType) => MEASURE_FIELDS.filter((f) => f.garments.includes(g));

export function validateMeasure(f: MeasureField, raw: string | number | undefined): string | null {
  if (raw === undefined || raw === '') return `Completează ${f.label.toLowerCase()}.`;
  const v = typeof raw === 'number' ? raw : Number(String(raw).replace(',', '.'));
  if (!Number.isFinite(v)) return 'Scrie doar cifre, de exemplu 102.';
  if (v < f.min || v > f.max) return `Verifică valoarea: de obicei e între ${f.min} și ${f.max} ${f.unit}.`;
  return null;
}

export const isComplete = (g: GarmentType, m: Measurements | undefined) =>
  !!m && fieldsFor(g).every((f) => validateMeasure(f, m[f.key]) === null);

export const filledCount = (g: GarmentType, m: Measurements | undefined) =>
  fieldsFor(g).filter((f) => m && validateMeasure(f, m[f.key]) === null).length;

const fmt = (n: number) => String(n).replace('.', ',');

/** „Piept 102 · Talie 88 · …” (doar măsurile de corp, în cm) */
export function bodySummary(g: GarmentType, m: Measurements) {
  return fieldsFor(g)
    .filter((f) => f.group === 'corp' && m[f.key] !== undefined)
    .map((f) => `${f.short} ${fmt(m[f.key]!)}`)
    .join(' · ');
}

export function calibrationSummary(m: Measurements) {
  return [m.height !== undefined && `Înălțime ${fmt(m.height)} cm`, m.weight !== undefined && `Greutate ${fmt(m.weight)} kg`].filter(Boolean).join(' · ');
}
