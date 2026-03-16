'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { GRADE_LABELS } from '@/data/mockData';
import type { UserGrade } from '@/types';

const categoryIcons: Record<string, JSX.Element> = {
  'cat-ichiban': (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  'cat-figure': (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
      <path d="M12 2a4 4 0 0 1 4 4v2H8V6a4 4 0 0 1 4-4z" />
      <rect x="8" y="8" width="8" height="10" rx="1" />
      <path d="M10 18v4M14 18v4" />
    </svg>
  ),
  'cat-gacha': (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="8" />
    </svg>
  ),
  'cat-goods': (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
      <path d="M20 12v10H4V12" />
      <rect x="2" y="7" width="20" height="5" rx="1" />
      <path d="M12 22V7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  ),
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, currentUser, addToCart, categories, subCategories } = useStore();
  const product = products.find(p => p.id === id);
  const [quantity, setQuantity] = useState(product?.minQuantity || 1);
  const [added, setAdded] = useState(false);

  if (!product || !currentUser) {
    return (
      <div className="text-center py-20">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300 mb-4">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <p className="text-gray-400">상품을 찾을 수 없습니다.</p>
        <button onClick={() => router.back()} className="text-sm text-primary mt-4 hover:underline">돌아가기</button>
      </div>
    );
  }

  const grade: UserGrade = currentUser.grade;
  const myPrice = product.prices[grade];
  const today = new Date().toISOString().split('T')[0];
  const isExpired = product.saleEndDate < today;
  const category = categories.find(c => c.id === product.categoryId);
  const subCategory = subCategories.find(c => c.id === product.subCategoryId);
  const discountPercent = Math.round((1 - myPrice / product.basePrice) * 100);

  const handleAddToCart = () => {
    if (quantity < product.minQuantity || quantity > product.maxQuantity) return;
    addToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <button onClick={() => router.back()} className="hover:text-primary transition-colors flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          뒤로
        </button>
        <span className="text-gray-300">/</span>
        <span>{category?.name}</span>
        {subCategory && <><span className="text-gray-300">/</span><span>{subCategory.name}</span></>}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
            <div className="scale-[3]">
              {categoryIcons[product.categoryId] || categoryIcons['cat-goods']}
            </div>
            {isExpired && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-red-500 text-white px-6 py-2 rounded-full font-medium">판매종료</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-8 flex flex-col">
            <h1 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">{product.description}</p>

            {/* Price highlight */}
            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-highlight text-lg font-bold">{discountPercent}%</span>
                <span className="text-2xl font-bold text-gray-900">{myPrice.toLocaleString()}원</span>
              </div>
              <p className="text-sm text-gray-400 line-through">{product.basePrice.toLocaleString()}원</p>
              <p className="text-xs text-primary mt-1">{grade} 등급 적용가</p>
            </div>

            {/* Price table */}
            <div className="border border-gray-100 rounded-xl overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">등급</th>
                    <th className="text-right px-4 py-2.5 text-xs text-gray-500 font-medium">단가</th>
                  </tr>
                </thead>
                <tbody>
                  {(['VVIP', 'VIP', 'GOLD', 'SILVER'] as UserGrade[]).map(g => (
                    <tr key={g} className={g === grade ? 'bg-primary/5' : ''}>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium badge-${g.toLowerCase()}`}>{g}</span>
                        {g === grade && <span className="text-[10px] text-primary ml-2">내 등급</span>}
                      </td>
                      <td className="text-right px-4 py-2.5 font-medium">
                        {product.prices[g].toLocaleString()}원
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 text-xs mb-6">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 mb-0.5">최소 주문수량</p>
                <p className="font-medium text-gray-700">{product.minQuantity}개</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 mb-0.5">최대 주문수량</p>
                <p className="font-medium text-gray-700">{product.maxQuantity}개</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 mb-0.5">판매기간</p>
                <p className="font-medium text-gray-700">{product.saleStartDate} ~ {product.saleEndDate}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 mb-0.5">재고</p>
                <p className="font-medium text-gray-700">{product.stock}개</p>
              </div>
            </div>

            {/* Order section */}
            {!isExpired && (
              <div className="mt-auto border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <label className="text-sm text-gray-600 font-medium">수량</label>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(product.minQuantity, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={e => setQuantity(Number(e.target.value))}
                      min={product.minQuantity}
                      max={product.maxQuantity}
                      className="w-16 h-10 text-center text-sm border-x border-gray-200 focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.maxQuantity, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">({product.minQuantity}~{product.maxQuantity})</span>
                </div>

                <div className="flex items-center justify-between mb-4 bg-gray-50 rounded-lg px-4 py-3">
                  <span className="text-sm text-gray-500">총 상품금액</span>
                  <span className="text-xl font-bold text-primary">
                    {(myPrice * quantity).toLocaleString()}원
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={quantity < product.minQuantity || quantity > product.maxQuantity}
                  className={`w-full py-3.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                    added
                      ? 'bg-green-500 text-white'
                      : 'bg-primary text-white hover:bg-primary/90'
                  } disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed`}
                >
                  {added ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      장바구니에 담겼습니다
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                      장바구니에 담기
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
