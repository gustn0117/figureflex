'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import type { Product, UserGrade } from '@/types';

interface Props {
  products: Product[];
  title: string;
  subCategories?: { id: string; name: string }[];
}

const categoryIcons: Record<string, JSX.Element> = {
  'cat-ichiban': <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  'cat-figure': <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2H8V6a4 4 0 0 1 4-4z" /><rect x="8" y="8" width="8" height="10" rx="1" /><path d="M10 18v4M14 18v4" /></svg>,
  'cat-gacha': <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="8" /></svg>,
  'cat-goods': <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12v10H4V12" /><rect x="2" y="7" width="20" height="5" rx="1" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>,
};

const categoryBg: Record<string, string> = {
  'cat-ichiban': 'from-amber-400 to-orange-500',
  'cat-figure': 'from-indigo-400 to-violet-500',
  'cat-gacha': 'from-pink-400 to-rose-500',
  'cat-goods': 'from-emerald-400 to-teal-500',
};

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-secondary">{title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{filtered.length}개 상품</p>
        </div>
      </div>

      {subCategories && subCategories.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveSubCat(null)}
            className={`text-[13px] px-4 py-2 rounded-full font-semibold transition-all ${
              !activeSubCat ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
            }`}
          >
            전체
          </button>
          {subCategories.map(sc => (
            <button
              key={sc.id}
              onClick={() => setActiveSubCat(sc.id)}
              className={`text-[13px] px-4 py-2 rounded-full font-semibold transition-all ${
                activeSubCat === sc.id ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {sc.name}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300 mb-4">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <p className="text-gray-400 text-sm">등록된 상품이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => {
            const status = getStatus(p);
            const isExpired = status === 'expired';
            const discountPercent = Math.round((1 - p.prices[grade] / p.basePrice) * 100);
            return (
              <Link
                key={p.id}
                href={isExpired ? '#' : `/dashboard/product/${p.id}`}
                className={`bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all group ${
                  isExpired ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
                  <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${categoryBg[p.categoryId] || categoryBg['cat-goods']} opacity-10`}>
                    <div className="scale-[3] opacity-50">{categoryIcons[p.categoryId] || categoryIcons['cat-goods']}</div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryBg[p.categoryId]} flex items-center justify-center text-white shadow-lg ${isExpired ? '' : 'group-hover:scale-110'} transition-transform`}>
                      {categoryIcons[p.categoryId] || categoryIcons['cat-goods']}
                    </div>
                  </div>
                  {isExpired && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">판매종료</span>
                    </div>
                  )}
                  {status === 'upcoming' && (
                    <span className="absolute top-2.5 left-2.5 bg-blue-500 text-white text-[10px] px-2.5 py-0.5 rounded-lg font-semibold">출시예정</span>
                  )}
                  {status === 'sale' && discountPercent > 0 && (
                    <span className="absolute top-2.5 left-2.5 bg-highlight text-white text-[11px] px-2 py-0.5 rounded-lg font-bold">{discountPercent}%</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-[13px] text-gray-800 font-medium mb-2.5 line-clamp-2 leading-snug min-h-[36px]">{p.name}</p>
                  <div className="flex items-end gap-2">
                    <p className="text-[15px] font-bold text-secondary">{p.prices[grade].toLocaleString()}원</p>
                    <p className="text-xs text-gray-400 line-through mb-px">{p.basePrice.toLocaleString()}원</p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2.5">
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-medium">MOQ {p.minQuantity}</span>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-medium">~{p.saleEndDate}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
