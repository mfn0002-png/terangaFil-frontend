'use client';

import { useParams } from 'next/navigation';
import { SupplierDetailsContent } from '@/components/shared/SupplierDetailsContent';

export default function SupplierProfile() {
  const { id } = useParams();
  
  if (!id) return null;

  return (
    <div className="bg-sand/10 min-h-screen pb-24 font-sans">
      <div className="container mx-auto px-4 py-8">
        <SupplierDetailsContent supplierId={Number(id)} />
      </div>
    </div>
  );
}
