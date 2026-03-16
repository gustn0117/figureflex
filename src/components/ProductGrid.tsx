'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import ProductImage from '@/components/ProductImage';
import type { Product, UserGrade } from '@/types';

interface Props {
  products: Product[];
  title: string;
  subCategories?: { id: string; name: string }[];
}

export default function ProductGrid({ products, title, subCategories }: Props) {
  const { currentUser } = useStore();
  const grade: UserGrade = currentUser?.grade || 'SILVER';
  const [activeSubCat, setActiveSubCat] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const getStatus = (p: Product) => {
    if (p.saleEndDate < today) return 'expired';
    if (p.saleStartDate > today) return 'upcoming';
    return 'sale';
  };
  const filtered = activeSubCat ? products.filter(p => p.subCategoryId === activeSubCat) : products;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">{title}</h2>
      <p className="text-xs text-gray-400 mb-6">{filtered.length}개 상품</p>

      {subCategories && subCategories.length > 0 && (
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveSubCat(null)}
            className={`text-[13px] px-3.5 py-1.5 rounded-lg border transition-colors ${!activeSubCat ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>
            전체
          </button>
          {subCategories.map(sc => (
            <button key={sc.id} onClick={() => setActiveSubCat(sc.id)}
              className={`text-[13px] px-3.5 py-1.5 rounded-lg border transition-colors ${activeSubCat === sc.id ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>
              {sc.name}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
          <p className="text-gray-400 text-sm">등록된 상품이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-7">
          {filtered.map(p => {
            const status = getStatus(p);
            const isExpired = status === 'expired';
            const discountPercent = Math.round((1 - p.prices[grade] / p.basePrice) * 100);
            return (
              <Link key={p.id} href={isExpired ? '#' : `/dashboard/product/${p.id}`}
                className={`group ${isExpired ? 'opacity-40 cursor-not-allowed' : ''}`}>
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3 border border-gray-100 relative">
                  <ProductImage imageUrl={p.imageUrl} categoryId={p.categoryId} alt={p.name} />
                  {isExpired && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-500 bg-white px-2.5 py-1 rounded border border-gray-200">판매종료</span>
                    </div>
                  )}
                  {status === 'upcoming' && (
                    <span className="absolute top-2 left-2 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded">출시예정</span>
                  )}
                </div>
                <p className="text-[13px] text-gray-600 mb-1.5 line-clamp-2 leading-snug group-hover:text-gray-900">{p.name}</p>
                <div className="flex items-baseline gap-1.5">
                  {discountPercent > 0 && <span className="text-[13px] font-bold text-red-500">{discountPercent}%</span>}
                  <span className="text-[14px] font-bold text-gray-900">{p.prices[grade].toLocaleString()}원</span>
                </div>
                {discountPercent > 0 && <p className="text-[11px] text-gray-400 line-through mt-0.5">{p.basePrice.toLocaleString()}원</p>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
