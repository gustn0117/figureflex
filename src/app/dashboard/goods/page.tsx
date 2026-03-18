'use client';
import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import ProductGrid from '@/components/ProductGrid';

export default function GoodsPage() {
  const { products, subCategories, fetchProducts } = useStore();

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter(p => p.categoryId === 'cat-goods');
  const subs = subCategories.filter(sc => sc.parentId === 'cat-goods');

  return <ProductGrid products={filtered} title="굿즈" subCategories={subs} />;
}
