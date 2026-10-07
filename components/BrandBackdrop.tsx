/**
 * Fundalul global al site-ului: catifea neagră cu fir auriu și „CESARINI” centrat sus.
 * `position: fixed` pe un strat separat (nu `background-attachment: fixed`, care sacadează pe iOS),
 * așa că textura rămâne pe loc în spatele tuturor secțiunilor, la scroll.
 *
 * - Opacitatea se reglează dintr-un singur loc: --backdrop-opacity (implicit 0.2, în app/globals.css).
 * - Pe mobil (sub md) se folosește o imagine verticală 9:16, fără text (__mobile).
 * Decorativ: aria-hidden, fără click-uri.
 */
export function BrandBackdrop() {
  return (
    <div aria-hidden className="brand-backdrop pointer-events-none">
      {/* desktop / tabletă */}
      <div className="brand-backdrop__image hidden md:block" />
      {/* mobil: imagine verticală fără text */}
      <div className="brand-backdrop__mobile block md:hidden" />
      {/* Vălul de lectură: lasă cuvântul și partea de sus luminoase, adâncește restul ca textul să rămână clar */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0)_0%,rgba(10,10,10,0)_28%,rgba(10,10,10,.35)_60%,rgba(10,10,10,.5)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(140%_100%_at_50%_20%,transparent_50%,rgba(10,10,10,.6)_100%)]" />
    </div>
  );
}
