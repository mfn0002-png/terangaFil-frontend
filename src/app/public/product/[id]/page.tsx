'use client';

import { useParams } from 'next/navigation';
import { ProductDetailsContent } from '@/components/shared/ProductDetailsContent';

export default function ProductDetailsPage() {
  const { id } = useParams();

  if (!id) return null;

  return (
    <div className="bg-sand/10 min-h-screen pb-24 font-sans">
      <div className="container mx-auto px-4 py-8">
        <ProductDetailsContent productId={Number(id)} />
      </div>
    </div>
  );
}
