'use client';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import type { Product, UserGrade } from '@/types';

interface Props {
  products: Product[];
  title: string;
  subCategories?: { id: string; name: string }[];
}

export default function ProductGrid({ products, title, subCategories }: Props) {
  const { currentUser } = useStore();
  const grade: UserGrade = currentUser?.grade || 'SILVER';

  const today = new Date().toISOString().split('T')[0];

  const getStatus = (p: Product) => {
    if (p.saleEndDate < today) return 'expired';
    if (p.saleStartDate > today) return 'upcoming';
    return 'sale';
  };

  return (
    <div className="max-w-6xl">
      <h2 className="text-xl font-bold text-gray-800 mb-6">{title}</h2>

      {/* Sub-category tabs */}
      {subCategories && subCategories.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <span className="text-xs bg-primary text-white px-3 py-1.5 rounded-full cursor-pointer">전체</span>
          {subCategories.map(sc => (
            <span key={sc.id} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
              {sc.name}
            </span>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-sm">등록된 상품이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => {
            const status = getStatus(p);
            const isExpired = status === 'expired';
            return (
              <Link
                key={p.id}
                href={isExpired ? '#' : `/dashboard/product/${p.id}`}
                className={`bg-white border border-gray-100 rounded-xl overflow-hidden transition-shadow ${
                  isExpired ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md'
                }`}
              >
                {/* Image */}
                <div className="aspect-square bg-gray-50 flex items-center justify-center relative">
                  <span className="text-5xl">
                    {p.categoryId === 'cat-ichiban' ? '🎰' : p.categoryId === 'cat-figure' ? '🗿' : p.categoryId === 'cat-gacha' ? '🎱' : '🎁'}
                  </span>
                  {/* Status badge */}
                  {isExpired && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">판매종료</span>
                    </div>
                  )}
                  {status === 'upcoming' && (
                    <span className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full">출시예정</span>
                  )}
                  {status === 'sale' && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full">판매중</span>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs text-gray-500 mb-1 line-clamp-2 leading-relaxed min-h-[32px]">{p.name}</p>
                  <div className="flex items-end gap-2">
                    <p className="text-sm font-bold text-primary">{p.prices[grade].toLocaleString()}원</p>
                    <p className="text-[10px] text-gray-400 line-through">{p.basePrice.toLocaleString()}원</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-gray-400">
                      MOQ {p.minQuantity}개
                    </span>
                    <span className="text-[10px] text-gray-400">|</span>
                    <span className="text-[10px] text-gray-400">
                      ~{p.saleEndDate}
                    </span>
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
