'use client';
import { useStore } from '@/store/useStore';
import ProductGrid from '@/components/ProductGrid';

export default function IchibanPage() {
  const { products, subCategories } = useStore();
  const filtered = products.filter(p => p.categoryId === 'cat-ichiban');
  const subs = subCategories.filter(sc => sc.parentId === 'cat-ichiban');

  return <ProductGrid products={filtered} title="제일복권" subCategories={subs} />;
}
