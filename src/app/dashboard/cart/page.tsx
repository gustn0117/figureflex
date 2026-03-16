'use client';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import ProductImage from '@/components/ProductImage';
import type { UserGrade } from '@/types';

export default function CartPage() {
  const router = useRouter();
  const { cart, products, currentUser, updateCartQuantity, removeFromCart, placeOrder } = useStore();
  const grade: UserGrade = currentUser?.grade || 'SILVER';

  const cartProducts = cart.map(ci => {
    const product = products.find(p => p.id === ci.productId)!;
    const unitPrice = product.prices[grade];
    return { ...ci, product, unitPrice, total: unitPrice * ci.quantity };
  });
  const totalAmount = cartProducts.reduce((sum, cp) => sum + cp.total, 0);

  const handleOrder = () => { const id = placeOrder(); if (id) router.push('/dashboard/orders'); };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-6">장바구니</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-sm mb-3">장바구니가 비어있습니다.</p>
          <button onClick={() => router.push('/dashboard')} className="text-sm text-gray-900 font-medium hover:underline">상품 둘러보기</button>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-100">
            {cartProducts.map(cp => (
              <div key={cp.productId} className="flex gap-4 py-5">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <ProductImage imageUrl={cp.product.imageUrl} categoryId={cp.product.categoryId} alt={cp.product.name} size="sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 mb-1 truncate">{cp.product.name}</p>
                  <p className="text-sm text-gray-500 mb-3">{cp.unitPrice.toLocaleString()}원</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded">
                      <button onClick={() => updateCartQuantity(cp.productId, Math.max(cp.product.minQuantity, cp.quantity - 1))}
                        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-900">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      </button>
                      <span className="w-10 text-center text-sm">{cp.quantity}</span>
                      <button onClick={() => updateCartQuantity(cp.productId, Math.min(cp.product.maxQuantity, cp.quantity + 1))}
                        className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-900">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(cp.productId)} className="text-xs text-gray-400 hover:text-red-500">삭제</button>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900 shrink-0 pt-1">{cp.total.toLocaleString()}원</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">{grade} 등급 적용</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalAmount.toLocaleString()}원</p>
            </div>
            <button onClick={handleOrder}
              className="bg-gray-900 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-black transition-colors">
              주문하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
