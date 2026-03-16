'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { GRADE_LABELS } from '@/data/mockData';
import type { UserGrade } from '@/types';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, currentUser, addToCart, categories, subCategories } = useStore();
  const product = products.find(p => p.id === id);
  const [quantity, setQuantity] = useState(product?.minQuantity || 1);
  const [added, setAdded] = useState(false);

  if (!product || !currentUser) {
    return (
      <div className="max-w-4xl text-center py-20">
        <p className="text-gray-400">상품을 찾을 수 없습니다.</p>
        <button onClick={() => router.back()} className="text-sm text-primary mt-4">돌아가기</button>
      </div>
    );
  }

  const grade: UserGrade = currentUser.grade;
  const myPrice = product.prices[grade];
  const today = new Date().toISOString().split('T')[0];
  const isExpired = product.saleEndDate < today;
  const category = categories.find(c => c.id === product.categoryId);
  const subCategory = subCategories.find(c => c.id === product.subCategoryId);

  const handleAddToCart = () => {
    if (quantity < product.minQuantity || quantity > product.maxQuantity) return;
    addToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <button onClick={() => router.back()} className="hover:text-primary">← 뒤로</button>
        <span>/</span>
        <span>{category?.name}</span>
        {subCategory && <><span>/</span><span>{subCategory.name}</span></>}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-2 gap-0">
          {/* Image */}
          <div className="aspect-square bg-gray-50 flex items-center justify-center relative">
            <span className="text-8xl">
              {product.categoryId === 'cat-ichiban' ? '🎰' : product.categoryId === 'cat-figure' ? '🗿' : product.categoryId === 'cat-gacha' ? '🎱' : '🎁'}
            </span>
            {isExpired && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-red-500 text-white px-6 py-2 rounded-full font-medium">판매종료</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-8 flex flex-col">
            <h1 className="text-lg font-bold text-gray-800 mb-3">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">{product.description}</p>

            {/* Price table */}
            <div className="border border-gray-100 rounded-xl overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-2 text-xs text-gray-500 font-medium">등급</th>
                    <th className="text-right px-4 py-2 text-xs text-gray-500 font-medium">단가</th>
                  </tr>
                </thead>
                <tbody>
                  {(['VVIP', 'VIP', 'GOLD', 'SILVER'] as UserGrade[]).map(g => (
                    <tr key={g} className={g === grade ? 'bg-primary/5' : ''}>
                      <td className="px-4 py-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium badge-${g.toLowerCase()}`}>{g}</span>
                        {g === grade && <span className="text-[10px] text-primary ml-2">← 내 등급</span>}
                      </td>
                      <td className="text-right px-4 py-2 font-medium">
                        {product.prices[g].toLocaleString()}원
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 text-xs text-gray-400">정가</td>
                    <td className="text-right px-4 py-2 text-gray-400 line-through text-xs">
                      {product.basePrice.toLocaleString()}원
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 text-xs mb-6">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 mb-0.5">최소 주문수량</p>
                <p className="font-medium">{product.minQuantity}개</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 mb-0.5">최대 주문수량</p>
                <p className="font-medium">{product.maxQuantity}개</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 mb-0.5">판매기간</p>
                <p className="font-medium">{product.saleStartDate} ~ {product.saleEndDate}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 mb-0.5">재고</p>
                <p className="font-medium">{product.stock}개</p>
              </div>
            </div>

            {/* Order section */}
            {!isExpired && (
              <div className="mt-auto">
                <div className="flex items-center gap-3 mb-4">
                  <label className="text-sm text-gray-600">수량:</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    min={product.minQuantity}
                    max={product.maxQuantity}
                    className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-xs text-gray-400">({product.minQuantity}~{product.maxQuantity})</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-gray-500">합계:</span>
                  <span className="text-xl font-bold text-primary">
                    {(myPrice * quantity).toLocaleString()}원
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={quantity < product.minQuantity || quantity > product.maxQuantity}
                  className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
                    added
                      ? 'bg-green-500 text-white'
                      : 'bg-primary text-white hover:bg-primary/90'
                  } disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed`}
                >
                  {added ? '장바구니에 담겼습니다 ✓' : '장바구니에 담기'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
