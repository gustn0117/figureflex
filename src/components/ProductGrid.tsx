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
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{filtered.length}개 상품</p>
      </div>

      {subCategories && subCategories.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <button onClick={() => setActiveSubCat(null)}
            className={`text-[13px] px-3.5 py-1.5 rounded-lg font-medium transition-all ${!activeSubCat ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'}`}>
            전체
          </button>
          {subCategories.map(sc => (
            <button key={sc.id} onClick={() => setActiveSubCat(sc.id)}
              className={`text-[13px] px-3.5 py-1.5 rounded-lg font-medium transition-all ${activeSubCat === sc.id ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'}`}>
              {sc.name}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <p className="text-gray-400 text-sm">등록된 상품이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(p => {
            const status = getStatus(p);
            const isExpired = status === 'expired';
            const discountPercent = Math.round((1 - p.prices[grade] / p.basePrice) * 100);
            return (
              <Link key={p.id} href={isExpired ? '#' : `/dashboard/product/${p.id}`}
                className={`bg-white border border-gray-100 rounded-xl overflow-hidden transition-all ${isExpired ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300'}`}>
                <div className="aspect-square relative overflow-hidden">
                  <ProductImage imageUrl={p.imageUrl} categoryId={p.categoryId} alt={p.name} />
                  {isExpired && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-white text-gray-900 text-xs px-3 py-1 rounded font-medium">판매종료</span>
                    </div>
                  )}
                  {status === 'upcoming' && (
                    <span className="absolute top-2 left-2 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded font-medium">출시예정</span>
                  )}
                  {status === 'sale' && discountPercent > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px] px-1.5 py-0.5 rounded font-bold">{discountPercent}%</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[13px] text-gray-800 mb-2 line-clamp-2 leading-snug min-h-[36px]">{p.name}</p>
                  <p className="text-[15px] font-bold text-gray-900">{p.prices[grade].toLocaleString()}원</p>
                  <p className="text-xs text-gray-400 line-through">{p.basePrice.toLocaleString()}원</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
