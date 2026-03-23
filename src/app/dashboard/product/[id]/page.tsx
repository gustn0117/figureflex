'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import ProductImage from '@/components/ProductImage';
import type { UserGrade } from '@/types';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, currentUser, addToCart, categories, subCategories, gradeDiscounts, fetchProducts } = useStore();

  useEffect(() => { fetchProducts(); }, []);
  const product = products.find(p => p.id === id);
  const [quantity, setQuantity] = useState(product?.minQuantity || 1);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // 등급별 공개 제한: 볼 수 없는 등급이면 접근 차단
  const gradeBlocked = product && currentUser && product.visibleGrades && product.visibleGrades.length > 0 && !product.visibleGrades.includes(currentUser.grade);

  if (!product || !currentUser || gradeBlocked) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">{gradeBlocked ? '접근 권한이 없는 상품입니다.' : '상품을 찾을 수 없습니다.'}</p>
        <button onClick={() => router.back()} className="text-sm text-gray-900 mt-4 hover:underline font-medium">돌아가기</button>
      </div>
    );
  }

  const grade: UserGrade = currentUser.grade;
  const myPrice = Math.round(product.basePrice * (1 - (gradeDiscounts[grade] || 0)));
  const today = new Date().toISOString().split('T')[0];
  const isExpired = product.saleEndDate < today;
  const category = categories.find(c => c.id === product.categoryId);
  const subCategory = subCategories.find(c => c.id === product.subCategoryId);
  const discountPercent = Math.round((1 - myPrice / product.basePrice) * 100);

  const hasImg = (url: string) => url && url.length > 0 && !url.startsWith('/images/');
  const allImages = [product.imageUrl, ...(product.images || [])].filter(img => hasImg(img));

  const handleAddToCart = () => {
    if (quantity < product.minQuantity || quantity > product.maxQuantity) return;
    addToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div>
      <button onClick={() => router.back()} className="text-xs sm:text-sm text-gray-400 hover:text-gray-900 transition-colors mb-4 sm:mb-6 inline-block">&larr; {category?.name}{subCategory ? ` / ${subCategory.name}` : ''}</button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 max-w-5xl mx-auto">
          {/* Images */}
          <div>
            <div className="aspect-square relative overflow-hidden bg-gray-100 rounded-lg">
              {allImages.length > 0 ? (
                <img src={allImages[selectedImage] || allImages[0]} alt={product.name} className="w-full h-full object-contain" />
              ) : (
                <ProductImage imageUrl={product.imageUrl} categoryId={product.categoryId} alt={product.name} size="lg" />
              )}
              {isExpired && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold">판매종료</span>
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {allImages.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded-md overflow-hidden shrink-0 border-2 transition-all ${selectedImage === idx ? 'border-gray-900' : 'border-gray-200 opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-xs text-gray-400 mb-2">{category?.name}{subCategory ? ` / ${subCategory.name}` : ''}</p>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{product.name}</h1>
            {product.description && <p className="text-sm text-gray-500 mb-4 leading-relaxed">{product.description}</p>}

            {/* Origin / Manufacturer */}
            {(product.origin || product.manufacturer) && (
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                {product.manufacturer && <span>제조사: <span className="text-gray-600 font-medium">{product.manufacturer}</span></span>}
                {product.origin && <span>원산지: <span className="text-gray-600 font-medium">{product.origin}</span></span>}
              </div>
            )}

            {/* Price */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-5 mb-4 sm:mb-5">
              <div className="flex items-end gap-2 sm:gap-3 mb-1">
                {discountPercent > 0 && <span className="text-red-500 text-base sm:text-lg font-bold">{discountPercent}%</span>}
                <span className="text-xl sm:text-2xl font-extrabold text-gray-900">{myPrice.toLocaleString()}원</span>
              </div>
              <p className="text-sm text-gray-400 line-through">{product.basePrice.toLocaleString()}원</p>
              <p className="text-xs text-gray-500 mt-1">{grade} 등급 적용가</p>
            </div>


            {/* Info grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs mb-5">
              {[
                { label: '최소 주문', value: `${product.minQuantity}개` },
                { label: '최대 주문', value: `${product.maxQuantity}개` },
                { label: '판매기간', value: `${product.saleStartDate} ~ ${product.saleEndDate}` },
                { label: '재고', value: `${product.stock}개` },
              ].map((info, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 mb-0.5 font-medium">{info.label}</p>
                  <p className="font-semibold text-gray-700">{info.value}</p>
                </div>
              ))}
            </div>

            {/* Order */}
            {!isExpired && (
              <div className="mt-auto border-t border-gray-100 pt-5">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                  <label className="text-sm text-gray-600 font-semibold">수량</label>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(product.minQuantity, quantity - (product.quantityStep || 1)))} className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
                    <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} min={product.minQuantity} max={product.maxQuantity} step={product.quantityStep || 1}
                      className="w-12 sm:w-14 h-9 sm:h-10 text-center text-sm border-x border-gray-200 focus:outline-none font-semibold" />
                    <button onClick={() => setQuantity(Math.min(product.maxQuantity, quantity + (product.quantityStep || 1)))} className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-400">
                    ({product.minQuantity}~{product.maxQuantity}
                    {(product.quantityStep || 1) > 1 ? ` · ${product.quantityStep}개 단위` : ''})
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4 bg-gray-50 rounded-lg px-3 sm:px-4 py-3">
                  <span className="text-xs sm:text-sm text-gray-500 font-medium">총 상품금액</span>
                  <span className="text-lg sm:text-xl font-extrabold text-gray-900">{(myPrice * quantity).toLocaleString()}원</span>
                </div>

                <button onClick={handleAddToCart}
                  disabled={quantity < product.minQuantity || quantity > product.maxQuantity}
                  className={`w-full py-3.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    added ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-black/10'
                  } disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.98]`}>
                  {added ? (
                    <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>장바구니에 담겼습니다</>
                  ) : (
                    <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>장바구니에 담기</>
                  )}
                </button>
              </div>
            )}
          </div>
      </div>

      {/* Detail Content */}
      {product.detailContent && (
        <div className="mt-10 pt-10 border-t border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">상세 정보</h2>
          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{product.detailContent}</div>
        </div>
      )}

      {/* Sub Images Gallery */}
      {product.images && product.images.length > 0 && product.images.some(img => img && !img.startsWith('/images/')) && (
        <div className="mt-10 pt-10 border-t border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">상품 이미지</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {product.images.filter(img => img && !img.startsWith('/images/')).map((img, idx) => (
              <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
