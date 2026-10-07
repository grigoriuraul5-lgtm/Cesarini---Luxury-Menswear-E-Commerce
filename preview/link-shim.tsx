// Doar pentru previzualizare: înlocuiește next/link cu un <a>.
// Rutele construite (/, /produs/…, /checkout) navighează în interiorul previzualizării; restul rămân pe loc.
import type { AnchorHTMLAttributes } from 'react';
export default function Link({ href, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (href.startsWith('/')) {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('preview:navigate', { detail: href }));
        }
      }}
      {...rest}
    />
  );
}
