// Doar pentru previzualizarea găzduită: next/image → <img>. Imaginile locale se servesc relativ.
import type { CSSProperties, ImgHTMLAttributes } from 'react';
type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'loader'> & {
  src: string; fill?: boolean; priority?: boolean; sizes?: string; style?: CSSProperties;
  loader?: (a: { src: string; width: number; quality?: number }) => string;
};
export default function Image({ src, fill, priority, loader, style, ...rest }: Props) {
  const url = loader ? loader({ src, width: 1200 }) : src.replace(/^\//, '');
  return <img src={url} loading={priority ? 'eager' : 'lazy'} style={fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', ...style } : style} {...rest} />;
}
