'use client';
import { useStore } from '@/store/useStore';
import ProductGrid from '@/components/ProductGrid';

export default function GachaPage() {
  const { products, subCategories } = useStore();
  const filtered = products.filter(p => p.categoryId === 'cat-gacha');
  const subs = subCategories.filter(sc => sc.parentId === 'cat-gacha');

  return <ProductGrid products={filtered} title="가챠" subCategories={subs} />;
}
