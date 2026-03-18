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

type SortKey = 'newest' | 'name' | 'low' | 'high';

export default function ProductGrid({ products, title, subCategories }: Props) {
  const { currentUser, addToCart } = useStore();
  const grade: UserGrade = currentUser?.grade || 'SILVER';
  const [activeSubCat, setActiveSubCat] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>('newest');
  const [addedId, setAddedId] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const getStatus = (p: Product) => {
    if (p.saleEndDate < today) return 'expired';
    if (p.saleStartDate > today) return 'upcoming';
    return 'sale';
  };

  let filtered = activeSubCat ? products.filter(p => p.subCategoryId === activeSubCat) : [...products];

  // Sort
  filtered.sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'low') return a.prices[grade] - b.prices[grade];
    if (sort === 'high') return b.prices[grade] - a.prices[grade];
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleQuickCart = (e: React.MouseEvent, p: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(p.id, p.minQuantity);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-400 mt-1">등록 제품 : {filtered.length}개</p>
        </div>
        <div className="flex gap-2 sm:gap-3 text-[11px] sm:text-[12px] text-gray-400 flex-wrap">
          {([['newest', '신상품'], ['name', '상품명'], ['low', '낮은가격'], ['high', '높은가격']] as [SortKey, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setSort(key)}
              className={`transition-colors ${sort === key ? 'text-gray-900 font-semibold' : 'hover:text-gray-600'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-category tabs */}
      {subCategories && subCategories.length > 0 && (
        <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 flex-wrap">
          <button onClick={() => setActiveSubCat(null)}
            className={`text-[13px] px-3.5 py-1.5 rounded-lg border transition-colors ${!activeSubCat ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>
            전체 ({products.length})
          </button>
          {subCategories.map(sc => {
            const count = products.filter(p => p.subCategoryId === sc.id).length;
            return (
              <button key={sc.id} onClick={() => setActiveSubCat(sc.id)}
                className={`text-[13px] px-3.5 py-1.5 rounded-lg border transition-colors ${activeSubCat === sc.id ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>
                {sc.name} ({count})
              </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
          <p className="text-gray-400 text-sm">등록된 상품이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-4 sm:gap-x-4 sm:gap-y-6">
          {filtered.map(p => {
            const status = getStatus(p);
            const isExpired = status === 'expired';
            const myPrice = p.prices[grade];

            return (
              <Link key={p.id} href={isExpired ? '#' : `/dashboard/product/${p.id}`}
                className={`group bg-white border border-gray-100 rounded-lg overflow-hidden hover:border-gray-300 transition-all ${isExpired ? 'opacity-40 cursor-not-allowed' : ''}`}>
                {/* Image */}
                <div className="aspect-square relative overflow-hidden bg-gray-50">
                  <ProductImage imageUrl={p.imageUrl} categoryId={p.categoryId} alt={p.name} />
                  {isExpired && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded border">판매종료</span>
                    </div>
                  )}
                  {status === 'upcoming' && <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded">출시예정</span>}
                  {status === 'sale' && (
                    <div className="absolute bottom-2 right-2 flex gap-1">
                      <button onClick={(e) => handleQuickCart(e, p)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${addedId === p.id ? 'bg-green-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-900 hover:text-white'}`}>
                        {addedId === p.id
                          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                          : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                        }
                      </button>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  {/* Deadline */}
                  {!isExpired && (
                    <p className="text-[10px] text-gray-400 mb-1.5">
                      ~{p.saleEndDate} 마감{p.manufacturer ? ` / ${p.manufacturer}` : ''}
                    </p>
                  )}
                  <p className="text-[13px] text-gray-700 mb-2 line-clamp-2 leading-snug min-h-[36px] group-hover:text-gray-900">{p.name}</p>

                  {/* Prices */}
                  <p className="text-xs text-gray-400 line-through">{p.basePrice.toLocaleString()}원</p>
                  <p className="text-[15px] font-bold text-gray-900 mt-0.5">{myPrice.toLocaleString()}원</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
