'use client';

import { useEffect, useState } from 'react';
import type { GarmentType } from '@/lib/commerce/catalog';
import { MEASURE_TIP, fieldsFor, validateMeasure, type MeasureKey, type Measurements } from '@/lib/commerce/measurements';
import { SidePanel } from '../ui/SidePanel';
import { goldButtonClass } from '../ui/GoldButton';
import { MeasureGuide } from './MeasureGuide';

type Props = {
  open: boolean;
  onClose: () => void;
  garment: GarmentType;
  productName: string;
  initial?: Measurements;
  onSave: (m: Measurements) => void;
};

const toNum = (s: string) => Number(s.replace(',', '.'));

/**
 * Configuratorul „Croit pe măsură”: stânga, ghidul ilustrat pentru câmpul activ; dreapta, câmpurile.
 * Validare la ieșirea din câmp (nu la fiecare tastă), progres vizibil, salvare doar când totul e completat.
 */
export function MeasurementsPanel({ open, onClose, garment, productName, initial, onSave }: Props) {
  const fields = fieldsFor(garment);
  const [values, setValues] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState<MeasureKey>(fields[0]?.key ?? 'height');
  const [triedSave, setTriedSave] = useState(false);

  useEffect(() => {
    if (!open) return;
    setValues(Object.fromEntries(Object.entries(initial ?? {}).map(([k, v]) => [k, String(v).replace('.', ',')])));
    setTouched({});
    setTriedSave(false);
    if (fields[0]) setActive(fields[0].key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const errorOf = (k: MeasureKey) => {
    const f = fields.find((x) => x.key === k)!;
    return validateMeasure(f, values[k]?.trim() ? values[k] : undefined);
  };
  const done = fields.filter((f) => !errorOf(f.key)).length;
  const activeField = fields.find((f) => f.key === active) ?? fields[0];
  if (!activeField) return null;
  const activeValue = values[active] ? toNum(values[active]) : undefined;

  function save() {
    setTriedSave(true);
    const firstBad = fields.find((f) => errorOf(f.key));
    if (firstBad) {
      setActive(firstBad.key);
      document.getElementById(`m-${firstBad.key}`)?.focus();
      return;
    }
    onSave(Object.fromEntries(fields.map((f) => [f.key, toNum(values[f.key])])) as Measurements);
  }

  const groups = [
    { id: 'calibrare', title: 'Calibrare', note: 'Ne ajută să citim corect proporțiile.' },
    { id: 'corp', title: 'Măsurile corpului', note: 'În centimetri, măsurate pe corp, nu pe haină.' },
  ] as const;

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      eyebrow="Croit pe măsură"
      title={<>Măsurile <em className="text-gold-400">tale</em></>}
      subtitle={<>Pentru {productName}. Durează cam 5 minute; ai nevoie de un centimetru de croitorie și, ideal, de cineva care să te ajute.</>}
      width="max-w-[64rem]"
      closeLabel="Închide măsurile"
      footer={
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-px w-28 bg-gold-400/20" aria-hidden>
              <span className="absolute inset-y-0 left-0 bg-gold-400 transition-[width] duration-500 ease-expo" style={{ width: `${(done / fields.length) * 100}%` }} />
            </div>
            <p className="text-sm tabular-nums text-stone-400" aria-live="polite">
              {done} din {fields.length} completate
            </p>
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <button type="button" onClick={onClose} className="min-h-12 cursor-pointer px-4 text-[0.7rem] font-semibold uppercase tracking-wide2 text-stone-400 transition-colors hover:text-gold-300">
              Renunță
            </button>
            <button type="button" onClick={save} className={goldButtonClass('solid')}>
              <span className="relative">Salvează măsurile</span>
            </button>
          </div>
        </div>
      }
    >
      <p className="px-6 pt-6 text-sm leading-relaxed text-stone-400 sm:px-10 md:hidden">{MEASURE_TIP}</p>
      <div className="grid gap-8 px-6 py-8 sm:px-10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-12">
        {/* ——— Ghidul ——— */}
        <aside className="hidden md:sticky md:top-8 md:block md:self-start" aria-live="polite">
          <div className="fabric-herringbone relative border border-gold-400/20 p-4">
            <MeasureGuide active={active} value={activeValue} unit={activeField.unit} className="mx-auto h-56 w-auto md:h-[22rem]" />
            <span aria-hidden className="absolute left-2 top-2 h-3 w-3 border-l border-t border-gold-500/60" />
            <span aria-hidden className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-gold-500/60" />
          </div>
          <h3 className="mt-6 font-display text-2xl text-ivory">{activeField.label}</h3>
          <p className="mt-2 max-w-prose leading-relaxed text-silk/85">{activeField.how}</p>
          <p className="mt-4 max-w-prose text-sm leading-relaxed text-stone-400">{MEASURE_TIP}</p>
        </aside>

        {/* ——— Câmpurile ——— */}
        <div className="space-y-10">
          {groups.map((g) => (
            <fieldset key={g.id}>
              <legend className="flex w-full items-baseline justify-between gap-4 border-b border-gold-400/20 pb-3">
                <span className="eyebrow">{g.title}</span>
                <span className="text-xs text-stone-500">{g.note}</span>
              </legend>
              <ol className="mt-2">
                {fields
                  .filter((f) => f.group === g.id)
                  .map((f) => {
                    const err = (touched[f.key] || triedSave) && errorOf(f.key);
                    const ok = !errorOf(f.key);
                    const isActive = active === f.key;
                    return (
                      <li key={f.key} className="border-b border-gold-400/10">
                        <div className={`grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-3 transition-colors duration-300 ${isActive ? 'text-ivory' : 'text-silk/80'}`}>
                          <label htmlFor={`m-${f.key}`} className="flex cursor-pointer items-center gap-3">
                            <span
                              aria-hidden
                              className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${ok ? 'border-gold-400 bg-gold-400 text-obsidian' : isActive ? 'border-gold-400' : 'border-gold-400/30'}`}
                            >
                              {ok && <svg viewBox="0 0 12 12" className="h-2.5 w-2.5"><path d="M2.5 6.2l2.3 2.3 4.7-4.9" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>}
                            </span>
                            <span className="text-[0.95rem]">{f.label}</span>
                          </label>
                          <div className={`flex min-h-12 items-center border bg-obsidian/60 transition-colors duration-300 focus-within:border-gold-400 ${err ? 'border-red-400/70' : 'border-gold-400/20'}`}>
                            <input
                              id={`m-${f.key}`}
                              inputMode="decimal"
                              autoComplete="off"
                              value={values[f.key] ?? ''}
                              onFocus={() => setActive(f.key)}
                              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value.replace(/[^\d.,]/g, '').slice(0, 5) }))}
                              onBlur={() => setTouched((t) => ({ ...t, [f.key]: true }))}
                              aria-invalid={!!err}
                              aria-describedby={err ? `m-${f.key}-err` : undefined}
                              placeholder="—"
                              className="w-20 bg-transparent px-3 text-right font-display text-xl tabular-nums text-ivory placeholder:text-stone-600 focus:outline-none sm:w-24"
                            />
                            <span className="pr-3 text-xs uppercase tracking-wide2 text-stone-500">{f.unit}</span>
                          </div>
                          {err && (
                            <p id={`m-${f.key}-err`} className="col-span-2 text-xs text-red-300">
                              {err}
                            </p>
                          )}
                          {/* Pe telefon, ghidul apare chiar sub câmpul activ */}
                          {isActive && (
                            <div className="col-span-2 mt-3 grid grid-cols-[6.5rem_1fr] gap-4 md:hidden">
                              <div className="fabric-herringbone border border-gold-400/20 p-1.5">
                                <MeasureGuide active={f.key} value={activeValue} unit={f.unit} className="h-40 w-full" />
                              </div>
                              <p className="text-sm leading-relaxed text-silk/85">{f.how}</p>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
              </ol>
            </fieldset>
          ))}
          <p className="text-sm leading-relaxed text-stone-400">
            După comandă, un consultant Cesarini te sună să verifice măsurile înainte de croire.
          </p>
        </div>
      </div>
    </SidePanel>
  );
}
