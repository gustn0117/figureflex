'use client';
import { useStore } from '@/store/useStore';
import ProductGrid from '@/components/ProductGrid';

export default function GoodsPage() {
  const { products } = useStore();
  const filtered = products.filter(p => p.categoryId === 'cat-goods');

  return <ProductGrid products={filtered} title="굿즈" />;
}
