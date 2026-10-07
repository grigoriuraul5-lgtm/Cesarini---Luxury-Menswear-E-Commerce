import type { Metadata } from 'next';
import { Checkout } from '@/components/commerce/Checkout';

export const metadata: Metadata = {
  title: 'Finalizare comandă',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <Checkout />;
}
