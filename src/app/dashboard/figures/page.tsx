'use client';
import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import ProductGrid from '@/components/ProductGrid';

export default function FiguresPage() {
  const { products, subCategories, fetchProducts } = useStore();

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter(p => p.categoryId === 'cat-figure');
  const subs = subCategories.filter(sc => sc.parentId === 'cat-figure');

  return <ProductGrid products={filtered} title="피규어" subCategories={subs} />;
}
